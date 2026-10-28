'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');

const MAKS_NDRYSHIME = 500;

function mundTeNdryshoje(p) {
  return !!p && (p.roli === 'ADMINISTRATOR' || p.roli === 'OPERATOR_BASHKIE' || p.roli === 'SPECIALIST');
}

function iPlote(v) {
  return Number.isInteger(v) && v > 0 && v < 2147483647;
}

async function lista(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });

  const kerkuar = Number(new URL(req.url, 'http://x').searchParams.get('bashkia'));
  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : (iPlote(kerkuar) ? kerkuar : p.bashkia_id);

  const [bashkite, grupet, kulturat, zgjedhur] = await Promise.all([
    db.query(`SELECT b.id, b.emri, q.emri AS qarku
                FROM bashkia b JOIN qarku q ON q.id = b.qarku_id
               WHERE b.aktive AND ($1::int IS NULL OR b.id = $1)
               ORDER BY q.emri, b.emri`, [kufizuarNeBashki(p) ? p.bashkia_id : null]),
    db.query(`SELECT id, kodi, emri FROM grupi_kultures ORDER BY kodi`),
    db.query(`SELECT id, kodi, emri, emri_shkencor, grupi_id, lloji, statusi
                FROM kultura ORDER BY kodi`),
    db.query(`SELECT bk.kultura_id, bk.krijuar_me, p.emri_plote AS perdoruesi
                FROM bashkia_kultura bk JOIN perdoruesi p ON p.id = bk.perdoruesi_id
               WHERE bk.bashkia_id = $1`, [bashkiaId]),
  ]);
  if (!bashkite.rows.some((b) => b.id === bashkiaId)) return dergoJson(res, 404, { gabim: 'bashkia' });

  dergoJson(res, 200, {
    bashkia_id: bashkiaId,
    bashkite: bashkite.rows,
    grupet: grupet.rows,
    kulturat: kulturat.rows,
    zgjedhur: zgjedhur.rows,
    mundTeNdryshoje: mundTeNdryshoje(p),
    kufizim: kufizuarNeBashki(p) ? { qarku: p.qarku, bashkia: p.bashkia } : null,
  });
}

async function ndrysho(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req, 64 * 1024);
  const bashkiaId = trupi.bashkia_id;
  const shto = Array.isArray(trupi.shto) ? trupi.shto : null;
  const hiq = Array.isArray(trupi.hiq) ? trupi.hiq : null;
  if (!iPlote(bashkiaId) || !shto || !hiq || !(shto.length + hiq.length) || shto.length + hiq.length > MAKS_NDRYSHIME
      || !shto.every(iPlote) || !hiq.every(iPlote)
      || new Set(shto.concat(hiq)).size !== shto.length + hiq.length) {
    return dergoJson(res, 400, { gabim: 'te_dhena' });
  }
  if (kufizuarNeBashki(p) && bashkiaId !== p.bashkia_id) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    const b = await klienti.query('SELECT 1 FROM bashkia WHERE id = $1 AND aktive', [bashkiaId]);
    if (!b.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'bashkia' }); }

    if (shto.length) {
      const k = await klienti.query(`SELECT id FROM kultura WHERE id = ANY($1::int[]) AND statusi <> 'jo_aktiv'`, [shto]);
      if (k.rowCount !== shto.length) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'kultura' }); }
    }

    let shtuar = 0;
    let hequr = 0;
    for (const id of shto) {
      const r = await klienti.query(
        `INSERT INTO bashkia_kultura (bashkia_id, kultura_id, perdoruesi_id) VALUES ($1, $2, $3)
         ON CONFLICT (bashkia_id, kultura_id) DO NOTHING`, [bashkiaId, id, p.id]);
      if (!r.rowCount) continue;
      await klienti.query(
        `INSERT INTO bashkia_kultura_historiku (bashkia_id, kultura_id, veprimi, perdoruesi_id)
         VALUES ($1, $2, 'shtuar', $3)`, [bashkiaId, id, p.id]);
      shtuar += 1;
    }
    for (const id of hiq) {
      const r = await klienti.query('DELETE FROM bashkia_kultura WHERE bashkia_id = $1 AND kultura_id = $2', [bashkiaId, id]);
      if (!r.rowCount) continue;
      await klienti.query(
        `INSERT INTO bashkia_kultura_historiku (bashkia_id, kultura_id, veprimi, perdoruesi_id)
         VALUES ($1, $2, 'hequr', $3)`, [bashkiaId, id, p.id]);
      hequr += 1;
    }
    await klienti.query('COMMIT');
    dergoJson(res, 200, { shtuar, hequr });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

module.exports = {
  'GET /api/kulturat/bashkia': lista,
  'PUT /api/kulturat/bashkia': ndrysho,
};
