'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');

const MAKS_NDRYSHIME = 400;

function mundTeNdryshoje(p) {
  return !!p && (p.roli === 'ADMINISTRATOR' || p.roli === 'OPERATOR_BASHKIE' || p.roli === 'SPECIALIST');
}

async function lista(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });

  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : null;
  const [zonat, njesite] = await Promise.all([
    db.query(`SELECT id, kodi, emri, zyrtare
                FROM zona_agroklimatike
               ORDER BY kodi`),
    db.query(`SELECT n.id, n.kodi, n.emri, n.zona_id, b.emri AS bashkia, q.emri AS qarku
                FROM njesia_administrative n
                JOIN bashkia b ON b.id = n.bashkia_id
                JOIN qarku q   ON q.id = b.qarku_id
               WHERE n.aktive AND ($1::int IS NULL OR b.id = $1)
               ORDER BY q.emri, b.emri, n.emri`, [bashkiaId]),
  ]);
  dergoJson(res, 200, {
    zonat: zonat.rows,
    njesite: njesite.rows,
    mundTeNdryshoje: mundTeNdryshoje(p),
    kufizim: bashkiaId ? { qarku: p.qarku, bashkia: p.bashkia } : null,
  });
}

function iPlote(v) {
  return Number.isInteger(v) && v > 0 && v < 2147483647;
}

async function ndrysho(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req, 64 * 1024);
  const ndryshimet = trupi.ndryshimet;
  if (!Array.isArray(ndryshimet) || !ndryshimet.length || ndryshimet.length > MAKS_NDRYSHIME
      || !ndryshimet.every((n) => n && iPlote(n.id) && iPlote(n.zona_id))
      || new Set(ndryshimet.map((n) => n.id)).size !== ndryshimet.length) {
    return dergoJson(res, 400, { gabim: 'te_dhena' });
  }

  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : null;

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    const zonat = new Set((await klienti.query('SELECT id FROM zona_agroklimatike')).rows.map((z) => z.id));
    let perditesuar = 0;
    for (const n of ndryshimet) {
      if (!zonat.has(n.zona_id)) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'zona', id: n.id }); }
      const r = await klienti.query('SELECT zona_id, bashkia_id FROM njesia_administrative WHERE id = $1 AND aktive FOR UPDATE', [n.id]);
      if (!r.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'njesia', id: n.id }); }
      if (bashkiaId && r.rows[0].bashkia_id !== bashkiaId) {
        await klienti.query('ROLLBACK');
        return dergoJson(res, 403, { gabim: 'jashte_bashkise', id: n.id });
      }
      const ishte = r.rows[0].zona_id;
      if (ishte === n.zona_id) continue;
      await klienti.query('UPDATE njesia_administrative SET zona_id = $2 WHERE id = $1', [n.id, n.zona_id]);
      await klienti.query(
        `INSERT INTO njesia_zona_historiku (njesia_id, zona_e_meparshme_id, zona_e_re_id, perdoruesi_id)
         VALUES ($1, $2, $3, $4)`, [n.id, ishte, n.zona_id, p.id]);
      perditesuar += 1;
    }
    await klienti.query('COMMIT');
    dergoJson(res, 200, { perditesuar });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

module.exports = {
  'GET /api/zonat': lista,
  'PUT /api/zonat/njesite': ndrysho,
};
