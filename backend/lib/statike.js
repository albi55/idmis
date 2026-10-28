'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { KOKAT_SIGURIE } = require('./http');
const { perdoruesiAktual } = require('./autentikimi');

const SITI = path.resolve(__dirname, '..', '..', 'idms');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.csv': 'text/csv; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const PA_HYRJE = new Set(['/account/login.html', '/account/register.html']);

function dergo404(res) {
  const b = Buffer.from('<!doctype html><meta charset="utf-8"><h1>404</h1><p>Faqja nuk u gjet.</p>');
  res.writeHead(404, { ...KOKAT_SIGURIE, 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': b.length });
  res.end(b);
}

function sherbeMePerdorues(req, res, skedari, p) {
  fs.readFile(skedari, 'utf8', (err, html) => {
    if (err) return dergo404(res);
    const info = { emri_plote: p.emri_plote, roli: p.roli, bashkia: p.bashkia, qarku: p.qarku };
    const skript = '<script>window.IDMIS_PERDORUESI=' + JSON.stringify(info).replace(/</g, '\\u003c') + ';</script>\n';
    const at = html.indexOf('</head>');
    const b = Buffer.from(at >= 0 ? html.slice(0, at) + skript + html.slice(at) : skript + html, 'utf8');
    res.writeHead(200, { ...KOKAT_SIGURIE, 'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': b.length, 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : b);
  });
}

async function sherbe(req, res, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath); } catch { res.writeHead(400); return res.end(); }
  if (rel.endsWith('/')) rel += 'index.html';
  const skedari = path.resolve(SITI, '.' + rel);
  if (skedari !== SITI && !skedari.startsWith(SITI + path.sep)) { res.writeHead(403); return res.end(); }

  const lower = rel.toLowerCase();
  if (lower.startsWith('/account/') && lower.endsWith('.html') && !PA_HYRJE.has(lower)) {
    const p = await perdoruesiAktual(req);
    if (!p) {
      const kthehu = urlPath + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
      res.writeHead(302, { ...KOKAT_SIGURIE, Location: '/Account/Login.html?next=' + encodeURIComponent(kthehu), 'Cache-Control': 'no-store' });
      return res.end();
    }
    return sherbeMePerdorues(req, res, skedari, p);
  }

  fs.stat(skedari, (err, st) => {
    if (err || !st.isFile()) return dergo404(res);
    res.writeHead(200, { ...KOKAT_SIGURIE, 'Content-Type': MIME[path.extname(skedari).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(skedari).pipe(res);
  });
}

module.exports = { sherbe };
