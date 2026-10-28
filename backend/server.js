'use strict';

const http = require('node:http');
const konfigurimi = require('./lib/konfigurimi');
const db = require('./lib/db');
const statike = require('./lib/statike');
const { dergoJson } = require('./lib/http');

const cfg = konfigurimi.lexo();

const API = {
  ...require('./routes/hyrja'),
  ...require('./routes/vendndodhjet'),
  ...require('./routes/zonat'),
  ...require('./routes/kulturat'),
  ...require('./routes/profilet'),
  ...require('./routes/nevoja'),
  ...require('./routes/skemat'),
  ...require('./routes/operatoret'),
};

const PING = '/__idmis_ping';

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  if (urlPath === PING) {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    return res.end('idmis-hyrje');
  }
  try {
    const fn = API[req.method + ' ' + urlPath];
    if (fn) return await fn(req, res);
    if (urlPath.startsWith('/api/')) return dergoJson(res, 404, { gabim: 'nuk_ekziston' });
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    await statike.sherbe(req, res, urlPath);
  } catch (err) {
    if (err.kodi) return dergoJson(res, err.kodi, { gabim: 'kerkese' });
    console.error(new Date().toISOString(), req.method, urlPath, err);
    if (!res.headersSent) dergoJson(res, 500, { gabim: 'serveri' });
    else res.end();
  }
});

server.listen(cfg.port, '127.0.0.1', async () => {
  try {
    await db.query('SELECT 1');
    console.log('IDMIS: http://127.0.0.1:' + cfg.port + '/  (databaza ' + cfg.db.database + ' në ' + cfg.db.host + ':' + cfg.db.port + ')');
  } catch (err) {
    console.error('IDMIS: serveri u nis, por databaza nuk përgjigjet: ' + err.message);
  }
});
