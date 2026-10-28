'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');

const HAPESIRA = 12;

const mundTeNdryshoje = (p) => p.roli === 'ADMINISTRATOR' || p.roli === 'OPERATOR_BASHKIE' || p.roli === 'SPECIALIST';
const iPlote = (v) => Number.isInteger(v) && v > 0 && v < 2147483647;
const emriISakte = (v) => (typeof v === 'string' && v.replace(/\s+/g, ' ').trim().length >= 2 && v.length <= 150
  ? v.replace(/\s+/g, ' ').trim() : null);

const KOLONAT = `o.id, o.kodi, o.emri, o.aktiv, o.perditesuar_me, p.emri_plote AS perdoruesi`;

async function lista(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  const kerkuar = Number(new URL(req.url, 'http://x').searchParams.get('bashkia'));
  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : (iPlote(kerkuar) ? kerkuar : p.bashkia_id);

  const [bashkite, operatoret] = await Promise.all([
    db.query(`SELECT b.id, b.emri, b.prefiksi, q.emri AS qarku
                FROM bashkia b JOIN qarku q ON q.id = b.qarku_id
               WHERE b.aktive AND ($1::int IS NULL OR b.id = $1)
               ORDER BY q.emri, b.emri`, [kufizuarNeBashki(p) ? p.bashkia_id : null]),
    db.query(`SELECT ${KOLONAT} FROM operatori o JOIN perdoruesi p ON p.id = o.perdoruesi_id
               WHERE o.bashkia_id = $1 ORDER BY o.kodi`, [bashkiaId]),
  ]);
  if (!bashkite.rows.some((b) => b.id === bashkiaId)) return dergoJson(res, 404, { gabim: 'bashkia' });
  dergoJson(res, 200, {
    bashkia_id: bashkiaId,
    bashkite: bashkite.rows,
    operatoret: operatoret.rows,
    mundTeNdryshoje: mundTeNdryshoje(p),
    kufizim: kufizuarNeBashki(p) ? { qarku: p.qarku, bashkia: p.bashkia } : null,
  });
}

async function emriZene(klienti, bashkiaId, emri, perjashto) {
  const r = await klienti.query(
    'SELECT 1 FROM operatori WHERE bashkia_id = $1 AND lower(emri) = lower($2) AND id <> $3',
    [bashkiaId, emri, perjashto || 0]);
  return r.rowCount > 0;
}

async function krijo(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req);
  const emri = emriISakte(trupi.emri);
  if (!iPlote(trupi.bashkia_id) || !emri) return dergoJson(res, 400, { gabim: 'te_dhena' });
  if (kufizuarNeBashki(p) && trupi.bashkia_id !== p.bashkia_id) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    await klienti.query('SELECT pg_advisory_xact_lock($1, $2)', [HAPESIRA, trupi.bashkia_id]);
    const b = await klienti.query('SELECT prefiksi FROM bashkia WHERE id = $1 AND aktive', [trupi.bashkia_id]);
    if (!b.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'bashkia' }); }
    if (await emriZene(klienti, trupi.bashkia_id, emri)) { await klienti.query('ROLLBACK'); return dergoJson(res, 409, { gabim: 'emri_ekziston' }); }
    const n = await klienti.query(
      'SELECT COALESCE(max(substring(kodi FROM 3)::int), 0) + 1 AS n FROM operatori WHERE bashkia_id = $1', [trupi.bashkia_id]);
    const kodi = b.rows[0].prefiksi + String(n.rows[0].n).padStart(3, '0');
    const r = await klienti.query(
      `INSERT INTO operatori (bashkia_id, kodi, emri, perdoruesi_id) VALUES ($1, $2, $3, $4) RETURNING id`,
      [trupi.bashkia_id, kodi, emri, p.id]);
    const id = r.rows[0].id;
    await klienti.query(
      'INSERT INTO operatori_historiku (operatori_id, para, pas, perdoruesi_id) VALUES ($1, NULL, $2, $3)',
      [id, JSON.stringify({ emri, aktiv: true }), p.id]);
    const o = await klienti.query(`SELECT ${KOLONAT} FROM operatori o JOIN perdoruesi p ON p.id = o.perdoruesi_id WHERE o.id = $1`, [id]);
    await klienti.query('COMMIT');
    dergoJson(res, 201, { operatori: o.rows[0] });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

async function ndrysho(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req);
  const emri = emriISakte(trupi.emri);
  if (!iPlote(trupi.id) || !emri || typeof trupi.aktiv !== 'boolean') return dergoJson(res, 400, { gabim: 'te_dhena' });

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    const para = await klienti.query('SELECT bashkia_id, emri, aktiv FROM operatori WHERE id = $1 FOR UPDATE', [trupi.id]);
    if (!para.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 404, { gabim: 'operatori' }); }
    const v = para.rows[0];
    if (kufizuarNeBashki(p) && v.bashkia_id !== p.bashkia_id) { await klienti.query('ROLLBACK'); return dergoJson(res, 403, { gabim: 'jashte_bashkise' }); }
    if (v.emri !== emri && await emriZene(klienti, v.bashkia_id, emri, trupi.id)) {
      await klienti.query('ROLLBACK');
      return dergoJson(res, 409, { gabim: 'emri_ekziston' });
    }
    if (v.emri !== emri || v.aktiv !== trupi.aktiv) {
      await klienti.query(
        'UPDATE operatori SET emri = $2, aktiv = $3, perdoruesi_id = $4, perditesuar_me = NOW() WHERE id = $1',
        [trupi.id, emri, trupi.aktiv, p.id]);
      await klienti.query(
        'INSERT INTO operatori_historiku (operatori_id, para, pas, perdoruesi_id) VALUES ($1, $2, $3, $4)',
        [trupi.id, JSON.stringify({ emri: v.emri, aktiv: v.aktiv }), JSON.stringify({ emri, aktiv: trupi.aktiv }), p.id]);
    }
    const o = await klienti.query(`SELECT ${KOLONAT} FROM operatori o JOIN perdoruesi p ON p.id = o.perdoruesi_id WHERE o.id = $1`, [trupi.id]);
    await klienti.query('COMMIT');
    dergoJson(res, 200, { operatori: o.rows[0] });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

module.exports = {
  'GET /api/operatoret': lista,
  'POST /api/operatoret': krijo,
  'PUT /api/operatoret': ndrysho,
};
