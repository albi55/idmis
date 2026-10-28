'use strict';

const crypto = require('node:crypto');
const db = require('../lib/db');
const fjalekalimi = require('../lib/fjalekalimi');
const sesioni = require('../lib/sesioni');
const { perdoruesiAktual, sekreti } = require('../lib/autentikimi');
const { dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');

const TENTATIVA_MAX = 5;
const BLLOKIMI_MS = 15 * 60 * 1000;
const tentativat = new Map();

function iBllokuar(celes) {
  const t = tentativat.get(celes);
  if (!t) return false;
  if (t.deri && t.deri > Date.now()) return true;
  if (t.deri) tentativat.delete(celes);
  return false;
}
function regjistroGabim(celes) {
  const t = tentativat.get(celes) || { numri: 0, deri: 0 };
  t.numri += 1;
  if (t.numri >= TENTATIVA_MAX) t.deri = Date.now() + BLLOKIMI_MS;
  tentativat.set(celes, t);
}

let HASH_I_RREME = '';
fjalekalimi.hash(crypto.randomBytes(16).toString('hex')).then((h) => { HASH_I_RREME = h; });

function pershkrimi(p) {
  return { id: p.id, emri_perdoruesit: p.emri_perdoruesit, email: p.email, emri_plote: p.emri_plote, roli: p.roli, bashkia: p.bashkia };
}

async function hyrje(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const trupi = await lexoJson(req);
  const login = String(trupi.perdoruesi || '').trim();
  const fjalekalim = String(trupi.fjalekalimi || '');
  if (!login || !fjalekalim || login.length > 254 || fjalekalim.length > 200) {
    return dergoJson(res, 400, { gabim: 'bosh' });
  }

  const celes = req.socket.remoteAddress + '|' + login.toLowerCase();
  if (iBllokuar(celes)) return dergoJson(res, 429, { gabim: 'bllokuar' });

  const { rows } = await db.query(
    `SELECT p.id, p.emri_perdoruesit, p.emri_plote, p.roli, p.aktiv, p.fjalekalimi_hash, b.emri AS bashkia
       FROM perdoruesi p JOIN bashkia b ON b.id = p.bashkia_id
      WHERE lower(p.emri_perdoruesit) = lower($1) OR lower(p.email) = lower($1)`, [login]);
  const p = rows[0];
  const ok = await fjalekalimi.verifiko(fjalekalim, p ? p.fjalekalimi_hash : HASH_I_RREME);

  if (!p || !ok) {
    regjistroGabim(celes);
    return dergoJson(res, 401, { gabim: 'kredenciale' });
  }
  if (!p.aktiv) return dergoJson(res, 403, { gabim: 'joaktiv' });

  tentativat.delete(celes);
  await db.query('UPDATE perdoruesi SET hyrja_e_fundit = now() WHERE id = $1', [p.id]);
  dergoJson(res, 200, { perdoruesi: pershkrimi(p) },
    { 'Set-Cookie': sesioni.krijo(p.id, trupi.mbajMend === true, sekreti) });
}

async function dalje(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  dergoJson(res, 200, { ok: true }, { 'Set-Cookie': sesioni.fshi() });
}

async function une(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' }, { 'Set-Cookie': sesioni.fshi() });
  dergoJson(res, 200, { perdoruesi: pershkrimi(p) });
}

module.exports = {
  'POST /api/hyrje': hyrje,
  'POST /api/dalje': dalje,
  'GET /api/une': une,
};
