require('dotenv').config();
const connection = require("../admin/database_backup");

const { google } = require('googleapis');
const https = require('https');
const { normalizeAmount, normalizeObjCode } = require('../utils/helper');

async function currentSync() {
    return await syncFunds(
        process.env.GOOGLE_TABLE_SPREADSHEET_ID,
        process.env.GOOGLE_CURRENT_RANGE,
        process.env.GOOGLE_SHEETS_API_KEY
    );
}

async function continuingSync() {
    return await syncFunds(
        process.env.GOOGLE_TABLE_SPREADSHEET_ID,
        process.env.GOOGLE_CONTINUING_RANGE,
        process.env.GOOGLE_SHEETS_API_KEY
    );
}

async function syncAllFunds() {
    const current = await currentSync();
    const continuing = await continuingSync();



    return { current, continuing };
}

async function destroyAllFunds() {
    // await FundSource.destroy({ where: {}, truncate: true });
}

async function syncFunds(sheetId, range, apiKey) {
    return new Promise((resolve, reject) => {
        const path = `/v4/spreadsheets/${sheetId}/values/${encodeURI(range)}?key=${apiKey}`;
        const options = {
            hostname: 'sheets.googleapis.com',
            path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        console.log(options)

        const apiReq = https.request(options, apiRes => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', async () => {   // <-- mark callback async
                try {
                    const parsed = JSON.parse(data);

                    const values = JSON.stringify({ lastUpdated: new Date().toISOString(), data: parsed });

                    if (range.includes('CURRENT')) {
                        await connection.postSettingsByKey('fund_source_current', data = values, 'json', '', 1);
                    } else if (range.includes('CONTINUING')) {
                        await connection.postSettingsByKey('fund_source_continuing', data = values, 'json', '', 1);
                    }
                    resolve({ lastUpdated: new Date().toISOString(), data: parsed });
                } catch (err) {
                    console.error('Parse error:', err.message);
                    reject(new Error('Failed to parse API response'));
                }
            });
        });

        apiReq.on('error', err => {
            console.error('HTTPS request error:', err.message);
            // res.status(500).json({ error: 'External API request failed' });
            reject(new Error('External API request failed'));
        });

        apiReq.end();
    });
}

module.exports = { currentSync, continuingSync, destroyAllFunds, syncAllFunds };
