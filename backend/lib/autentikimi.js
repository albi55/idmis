'use strict';

const db = require('./db');
const konfigurimi = require('./konfigurimi');
const sesioni = require('./sesioni');

const { sekreti } = konfigurimi.lexo();

async function perdoruesiAktual(req) {
  const id = sesioni.lexo(req.headers.cookie, sekreti);
  if (!id) return null;
  const { rows } = await db.query(
    `SELECT p.id, p.emri_perdoruesit, p.email, p.emri_plote, p.roli, p.bashkia_id, b.emri AS bashkia,
            b.qarku_id, q.emri AS qarku
       FROM perdoruesi p
       JOIN bashkia b ON b.id = p.bashkia_id
       JOIN qarku q   ON q.id = b.qarku_id
      WHERE p.id = $1 AND p.aktiv`, [id]);
  return rows[0] || null;
}

function kufizuarNeBashki(p) {
  return !!p && p.roli !== 'ADMINISTRATOR';
}

module.exports = { perdoruesiAktual, kufizuarNeBashki, sekreti };
