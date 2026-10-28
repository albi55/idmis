'use strict';

const KOKAT_SIGURIE = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'SAMEORIGIN',
};

function dergoJson(res, kodi, trupi, kokat = {}) {
  const b = Buffer.from(JSON.stringify(trupi));
  res.writeHead(kodi, { ...KOKAT_SIGURIE, 'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': b.length, 'Cache-Control': 'no-store', ...kokat });
  res.end(b);
}

function gabimHttp(kodi) {
  return Object.assign(new Error('HTTP ' + kodi), { kodi });
}

function lexoJson(req, limit = 10 * 1024) {
  return new Promise((resolve, reject) => {
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) {
      return reject(gabimHttp(415));
    }
    let madhesia = 0;
    const copat = [];
    req.on('data', (c) => {
      madhesia += c.length;
      if (madhesia > limit) { reject(gabimHttp(413)); req.destroy(); return; }
      copat.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(copat).toString('utf8') || '{}')); }
      catch { reject(gabimHttp(400)); }
    });
    req.on('error', reject);
  });
}

function ngaEnjejtaOrigjine(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

module.exports = { KOKAT_SIGURIE, dergoJson, gabimHttp, lexoJson, ngaEnjejtaOrigjine };
