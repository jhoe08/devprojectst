import https from "https";
import connection from "../admin/database.js"; // adjust path to your connection module

export async function fetchSheetData(key_name, sheetId, range) {
  // Get API key from DB
  const result = await connection.getSettingByKey("integration_api_key");
  const row = Array.isArray(result) ? result[0] : result;
  const apiKey = row.value;

  if (!sheetId || !range || !apiKey) {
    throw new Error("Missing sheetId, range, or API key");
  }

  const path = `/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const options = {
    hostname: "sheets.googleapis.com",
    path,
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return new Promise((resolve, reject) => {
    const apiReq = https.request(options, apiRes => {
      let data = "";
      apiRes.on("data", chunk => (data += chunk));
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (apiRes.statusCode >= 400) {
            return reject(new Error(parsed.error?.message || "API error"));
          }
          const results = { lastUpdated: new Date().toISOString(), parsed };
          const query = [ [key_name, JSON.stringify({lastUpdated: new Date().toISOString(), data}), "json", null, 1] ]
          // Update fund_source setting in DB
          connection.postSettings(query).catch(err => {
            console.error("Failed to update fund_source:", err);
          });
          
          resolve(results);
        } catch (err) {
          reject(new Error("Failed to parse API response"));
        }
      });
    });

    apiReq.on("error", err => reject(err));
    apiReq.end();
  });
}