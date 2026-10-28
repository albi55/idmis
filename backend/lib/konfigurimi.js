'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ENV = path.join(__dirname, '..', '.env');
let cfg = null;

function lexo() {
  if (cfg) return cfg;
  if (!fs.existsSync(ENV)) {
    throw new Error('Mungon backend/.env. Ekzekutoni një herë: npm run konfiguro');
  }
  process.loadEnvFile(ENV);
  const e = process.env;
  for (const k of ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'SESSION_SECRET']) {
    if (!e[k]) throw new Error('Mungon ' + k + ' në backend/.env');
  }
  cfg = {
    port: +(e.PORT || 47821),
    db: { host: e.DB_HOST, port: +e.DB_PORT, database: e.DB_NAME, user: e.DB_USER, password: e.DB_PASSWORD },
    sekreti: e.SESSION_SECRET,
  };
  return cfg;
}

module.exports = { lexo, ENV };
