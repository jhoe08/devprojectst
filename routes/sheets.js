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

// POST /api/dialog/list
// Request body: { type: 'employees'|'suppliers'|..., show: 'col1,col2', params: { ... } }
router.post('/dialog/list', async (req, res) => {
  try {
    const { type, show = '', params = {} } = req.body || {}
    if (!type) return res.status(400).json({ error: 'Missing type' })

    let rows = []

    switch ((type || '').toString().toLowerCase()) {
      case 'funds': {
        // Fetch funds from Google Sheets (supports params.sheetId and params.range)
        const sheetId = params.sheetId || '1alv_rcdABMcTuS7q5OBez9_CDboToPvmjXNRn2GI9pM'
        const range = params.range || 'ALL CURRENT'

        const apiKeyRow = await connection.getSettingByKey('integration_api_key')
        const apiKeyObj = Array.isArray(apiKeyRow) ? apiKeyRow[0] : apiKeyRow
        const apiKey = apiKeyObj && apiKeyObj.value
        if (!apiKey) throw new Error('Missing Google Sheets API key')

        const path = `/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`
        const options = { hostname: 'sheets.googleapis.com', path, method: 'GET', headers: { 'Content-Type': 'application/json' } }

        rows = await new Promise((resolve, reject) => {
          const req = https.request(options, apiRes => {
            let data = ''
            apiRes.on('data', chunk => data += chunk)
            apiRes.on('end', () => {
              try {
                const parsed = JSON.parse(data)
                if (apiRes.statusCode >= 400) return reject(new Error(parsed.error?.message || 'Sheets API error'))
                const values = parsed.values || []
                if (!values.length) return resolve([])

                const headers = values[0].map(h => (h || '').toString().trim())
                const mapped = values.slice(1).map((rowArr, idx) => {
                  const obj = {}
                  headers.forEach((h, i) => { obj[h] = rowArr[i] !== undefined ? rowArr[i] : '' })
                  // normalize keys
                  const norm = {}
                  Object.keys(obj).forEach(k => { norm[k.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'')] = obj[k] })
                  // heuristic mapping
                  const fund = {
                    id: norm.id || norm.code || `${sheetId}_${idx}`,
                    pap: norm.pap || norm.program || norm.program_activity || norm.program_activity_project || norm.p_a_p || '',
                    class: norm.class || norm.classification || '',
                    obj_code: norm.obj_code || norm.objcode || norm.object_code || norm.objectcode || norm.obj || '',
                    description: norm.description || norm.descriptions || norm.desc || norm.details || '',
                    amount: norm.amount || norm.balance || norm.available || ''
                  }
                  return fund
                })
                resolve(mapped)
              } catch (err) {
                reject(err)
              }
            })
          })
          req.on('error', err => reject(err))
          req.end()
        })
        break
      }
      case 'employees':
        rows = await connection.getEmployees(Object.keys(params || {}).length ? JSON.stringify(params) : undefined)
        break
      case 'suppliers':
        rows = await connection.getSuppliers(Object.keys(params || {}).length ? JSON.stringify(params) : undefined)
        break
      case 'market_scopes':
      case 'market-scopes':
      case 'market_scope':
        rows = await connection.getMarketScopes(Object.keys(params || {}).length ? JSON.stringify(params) : undefined)
        break
      case 'transactions':
        rows = await connection.getTransactions(Object.keys(params || {}).length ? JSON.stringify(params) : undefined)
        break
      default:
        // Fallback: try generic retrieve by table name
        // If params is an object, pass it directly as the where clause
        rows = await connection.retrieveData(type, '*', Object.keys(params || {}).length ? params : undefined)
        break
    }

    // If server returned an object with rows (some drivers), normalize to array
    if (!Array.isArray(rows) && rows && rows.rows) rows = rows.rows

    // If `show` was provided, map objects to only those keys (preserve order)
    if (show && Array.isArray(rows) && rows.length) {
      const cols = show.split(',').map(s => s.trim()).filter(Boolean)
      const filtered = rows.map(r => {
        const o = {}
        cols.forEach(c => { o[c] = r[c] !== undefined ? r[c] : null })
        return o
      })
      return res.json(filtered)
    }

    return res.json(rows || [])
  } catch (err) {
    console.error('Error /api/dialog/list', err)
    return res.status(500).json({ error: err?.message || 'Server error' })
  }
})

module.exports = router;