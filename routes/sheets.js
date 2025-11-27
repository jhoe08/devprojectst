const express = require('express');
const https = require('https');

const connection = require('../admin/database');

const router = express.Router();
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
// const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';

// if (!clientEmail || !privateKeyRaw) {
//   console.warn('Google Sheets service account not configured (GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY missing)');
// }

// const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

router.get('/read', async (req, res) => {
  const { sheetId, range } = req.query;
  if (!sheetId || !range) return res.status(400).json({ error: 'Missing sheetId or range' });

  try {
    const auth = new google.auth.JWT(clientEmail, null, privateKey, SCOPES);
    // optional explicit authorize (helps surface auth errors early)
    await auth.authorize();

    const sheets = google.sheets({ version: 'v4', auth });
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    return res.json(resp.data);
  } catch (err) {
    console.error('Sheets API error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Sheets API error' });
  }
});

// Route: External API call using native https
// GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}?key=YOUR_API_KEY
// Route: External API call using native https and API key
router.get('/sheets', async (req, res) => {
  const { sheetId, range } = req.query;
  // const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  const result = await connection.getSettingByKey('integration_api_key');
  const row = Array.isArray(result) ? result[0] : result;
  const apiKey = row.value;

  console.log(apiKey)

  if (!sheetId || !range || !apiKey) {
    return res.status(400).json({ error: 'Missing sheetId, range, or API key' });
  }

  const path = `/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const options = {
    hostname: 'sheets.googleapis.com',
    path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const apiReq = https.request(options, apiRes => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (apiRes.statusCode >= 400) {
          return res.status(apiRes.statusCode).json({ error: parsed.error || 'API error' });
        }
        res.json({lastUpdated: new Date().toISOString(),parsed});
      } catch (err) {
        console.error('Parse error:', err.message);
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  });

  apiReq.on('error', err => {
    console.error('HTTPS request error:', err.message);
    res.status(500).json({ error: 'External API request failed' });
  });

  apiReq.end();
});

module.exports = router;