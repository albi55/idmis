'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Client } = require('pg');
const { ENV } = require('../lib/konfigurimi');

const DB = { host: 'localhost', port: 5433, database: 'idmis', user: 'postgres' };
const SQL_002 = path.join(__dirname, '..', '..', 'database', '002_hyrja_ne_sistem.sql');

(async () => {
  if (fs.existsSync(ENV)) {
    console.log('backend/.env ekziston tashmë; konfigurimi nuk u përsërit.');
    return;
  }
  const fjalekalimiDb = crypto.randomBytes(24).toString('base64url');
  const sekreti = crypto.randomBytes(48).toString('base64url');

  const c = new Client(DB);
  await c.connect();
  let ekziston;
  try {
    ekziston =(await c.query("SELECT 1 FROM pg_roles WHERE rolname = 'idmis_app'")).rowCount > 0;
    const { rows } = await c.query(
      `SELECT format('${ekziston ? 'ALTER' : 'CREATE'} ROLE idmis_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD %L', $1::text) AS sql`,
      [fjalekalimiDb]);
    await c.query(rows[0].sql);
    await c.query(fs.readFileSync(SQL_002, 'utf8'));
  } finally {
    await c.end();
  }

  fs.writeFileSync(ENV, [
    '# IDMIS server — krijuar nga scripts/konfiguro.js. Mos e ndani këtë skedar.',
    'PORT=47821',
    'DB_HOST=localhost',
    'DB_PORT=5433',
    'DB_NAME=idmis',
    'DB_USER=idmis_app',
    'DB_PASSWORD=' + fjalekalimiDb,
    'SESSION_SECRET=' + sekreti,
    '',
  ].join('\n'));
  console.log('Gati: roli idmis_app u ' + (ekziston ? 'përditësua' : 'krijua') + ', të drejtat u dhanë, backend/.env u shkrua.');
})().catch((err) => { console.error('Konfigurimi dështoi: ' + err.message); process.exit(1); });
