'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson } = require('../lib/http');

async function vendndodhjet(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });

  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : null;

  const [qarqet, bashkite, njesite, zonat] = await Promise.all([
    db.query(`SELECT q.id, q.kodi, q.emri
                FROM qarku q
               WHERE $1::int IS NULL OR q.id = (SELECT qarku_id FROM bashkia WHERE id = $1)
               ORDER BY q.emri`, [bashkiaId]),
    db.query(`SELECT id, kodi, emri, qarku_id
                FROM bashkia
               WHERE aktive AND ($1::int IS NULL OR id = $1)
               ORDER BY emri`, [bashkiaId]),
    db.query(`SELECT n.id, n.kodi, n.emri, n.bashkia_id, b.qarku_id, n.zona_id
                FROM njesia_administrative n
                JOIN bashkia b ON b.id = n.bashkia_id
               WHERE n.aktive AND b.aktive AND ($1::int IS NULL OR b.id = $1)
               ORDER BY n.emri, n.kodi`, [bashkiaId]),
    db.query(`SELECT id, kodi, emri
                FROM zona_agroklimatike
               ORDER BY kodi`),
  ]);

  dergoJson(res, 200, {
    qarqet: qarqet.rows,
    bashkite: bashkite.rows,
    njesite: njesite.rows,
    zonat: zonat.rows,
    kufizim: bashkiaId ? { qarku: p.qarku, bashkia: p.bashkia } : null,
  }, { 'Cache-Control': 'private, no-store' });
}

module.exports = {
  'GET /api/vendndodhjet': vendndodhjet,
};
