'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { shto, fjalekalimRastesor } = require('./shto-perdorues');

const SKEDARI = path.join(__dirname, '..', 'PERDORUESIT_TEST.txt');

const PERDORUESIT = [
  { perdoruesi: 'admin', email: 'admin@idmis.test', emri: 'Administratori IDMIS',
    institucioni: 'Ministria e Bujqësisë dhe Zhvillimit Rural', bashkia: 'Tiranë', roli: 'ADMINISTRATOR' },
  { perdoruesi: 'operator.fier', email: 'operator.fier@idmis.test', emri: 'Operatori i Bashkisë Fier',
    institucioni: 'Bashkia Fier', bashkia: 'Fier' },
  { perdoruesi: 'operator.lushnje', email: 'operator.lushnje@idmis.test', emri: 'Operatori i Bashkisë Lushnjë',
    institucioni: 'Bashkia Lushnjë', bashkia: 'Lushnjë' },
  { perdoruesi: 'operator.korce', email: 'operator.korce@idmis.test', emri: 'Operatori i Bashkisë Korçë',
    institucioni: 'Bashkia Korçë', bashkia: 'Korçë' },
  { perdoruesi: 'operator.berat', email: 'operator.berat@idmis.test', emri: 'Operatori i Bashkisë Berat',
    institucioni: 'Bashkia Berat', bashkia: 'Berat', aktiv: false },
];

(async () => {
  const c = new Client({ host: 'localhost', port: 5433, database: 'idmis', user: 'postgres' });
  await c.connect();
  const rreshta = [];
  try {
    for (const p of PERDORUESIT) {
      const ka = await c.query('SELECT 1 FROM perdoruesi WHERE lower(emri_perdoruesit) = lower($1)', [p.perdoruesi]);
      if (ka.rowCount) { console.log('ekziston, u la si është: ' + p.perdoruesi); continue; }
      const fjalekalim = fjalekalimRastesor();
      await shto(c, p, fjalekalim);
      rreshta.push([p.perdoruesi, fjalekalim, p.roli || 'OPERATOR_BASHKIE', p.bashkia, p.aktiv === false ? 'JOAKTIV' : 'aktiv']);
      console.log('u shtua: ' + p.perdoruesi);
    }
  } finally {
    await c.end();
  }
  if (!rreshta.length) return;

  const koka = !fs.existsSync(SKEDARI)
    ? ['IDMIS — përdoruesit e provës (vetëm për testim, jo për përdorim real)',
       'Hyrja: http://127.0.0.1:47821/Account/Login.html',
       'Mund të hyni me emrin e përdoruesit ose me email-in (<emri>@idmis.test).', '',
       'Përdoruesi'.padEnd(20) + 'Fjalëkalimi'.padEnd(20) + 'Roli'.padEnd(20) + 'Bashkia'.padEnd(12) + 'Gjendja',
       '-'.repeat(80)]
    : [];
  fs.appendFileSync(SKEDARI, koka.concat(rreshta.map((r) =>
    r[0].padEnd(20) + r[1].padEnd(20) + r[2].padEnd(20) + r[3].padEnd(12) + r[4])).join('\n') + '\n');
  console.log('Kredencialet u shkruan në backend/PERDORUESIT_TEST.txt');
})().catch((err) => { console.error('Dështoi: ' + err.message); process.exit(1); });
