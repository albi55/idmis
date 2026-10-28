'use strict';

const crypto = require('node:crypto');
const { Client } = require('pg');
const fjalekalimi = require('../lib/fjalekalimi');

function argumentet() {
  const a = {}, v = process.argv.slice(2);
  for (let i = 0; i < v.length; i += 2) {
    if (!v[i].startsWith('--')) throw new Error('Argument i panjohur: ' + v[i]);
    a[v[i].slice(2)] = v[i + 1];
  }
  for (const k of ['perdoruesi', 'email', 'emri', 'institucioni', 'bashkia']) {
    if (!a[k]) throw new Error('Mungon --' + k);
  }
  return a;
}

function fjalekalimRastesor() {
  return crypto.randomBytes(12).toString('base64url');
}

async function shto(c, p, fjalekalim) {
  const b = await c.query('SELECT id FROM bashkia WHERE emri = $1', [p.bashkia]);
  if (!b.rowCount) throw new Error('Bashkia "' + p.bashkia + '" nuk ekziston');
  const { rows } = await c.query(
    `INSERT INTO perdoruesi (emri_perdoruesit, email, emri_plote, institucioni, fjalekalimi_hash, roli, bashkia_id, aktiv)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [p.perdoruesi, p.email, p.emri, p.institucioni, await fjalekalimi.hash(fjalekalim),
      p.roli || 'OPERATOR_BASHKIE', b.rows[0].id, p.aktiv !== false]);
  return rows[0].id;
}

module.exports = { shto, fjalekalimRastesor };

if (require.main === module) {
  (async () => {
    const p = argumentet();
    const fjalekalim = fjalekalimRastesor();
    const c = new Client({ host: 'localhost', port: 5433, database: 'idmis', user: 'postgres' });
    await c.connect();
    try {
      const id = await shto(c, p, fjalekalim);
      console.log('Përdoruesi u shtua (id ' + id + '): ' + p.perdoruesi);
      console.log('Fjalëkalimi i përkohshëm: ' + fjalekalim);
    } finally {
      await c.end();
    }
  })().catch((err) => { console.error('Nuk u shtua: ' + err.message); process.exit(1); });
}
