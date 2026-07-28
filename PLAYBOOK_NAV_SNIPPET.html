const https = require("https");
const querystring = require("querystring");

const endpoints = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter"
];

function postForm(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "BW-Playbook-Territory-Builder/3.2"
      },
      timeout: 105000
    }, res => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", chunk => raw += chunk);
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Overpass returned HTTP ${res.statusCode}`));
          return;
        }
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error("Overpass returned invalid JSON")); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("Overpass request timed out")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function (context, req) {
  try {
    const polygon = req.body && req.body.polygon;
    if (!Array.isArray(polygon) || polygon.length < 4) {
      context.res = { status: 400, body: { error: "A valid polygon is required." } };
      return;
    }

    const poly = polygon.map(([lon, lat]) => `${lat} ${lon}`).join(" ");
    const query =
      `[out:json][timeout:90];(` +
      `way["highway"]["name"](poly:"${poly}");` +
      `way["building"](poly:"${poly}");` +
      `);out tags geom;`;

    const formBody = querystring.stringify({ data: query });
    let payload = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        payload = await postForm(endpoint, formBody);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!payload) {
      throw new Error(`All map-data servers failed: ${lastError?.message || "unknown error"}`);
    }

    const roads = [];
    const buildings = [];

    for (const element of payload.elements || []) {
      const tags = element.tags || {};
      const coords = (element.geometry || [])
        .filter(p => Number.isFinite(p.lon) && Number.isFinite(p.lat))
        .map(p => [p.lon, p.lat]);

      if (tags.highway && tags.name && coords.length >= 2) {
        roads.push({
          id: element.id,
          name: tags.name,
          highway: tags.highway,
          oneway: tags.oneway || null,
          coords
        });
      } else if (tags.building && coords.length >= 3) {
        const first = coords[0], last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) coords.push(first);
        buildings.push({ id: element.id, coords });
      }
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: { version: "3.2-playbook", roads, buildings }
    };
  } catch (error) {
    context.log.error(error);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: error.message || "Map analysis failed." }
    };
  }
};