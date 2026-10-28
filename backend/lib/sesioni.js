'use strict';

const crypto = require('node:crypto');

const EMRI = 'idmis_sesioni';
const ORE = 3600 * 1000;
const ZGJATJA_NORMALE = 12 * ORE;
const ZGJATJA_MBAJ_MEND = 30 * 24 * ORE;

function nenshkruaj(teksti, sekreti) {
  return crypto.createHmac('sha256', sekreti).update(teksti).digest('base64url');
}

function krijo(perdoruesId, mbajMend, sekreti) {
  const skadon = Date.now() + (mbajMend ? ZGJATJA_MBAJ_MEND : ZGJATJA_NORMALE);
  const payload = Buffer.from(JSON.stringify({ uid: String(perdoruesId), exp: skadon })).toString('base64url');
  const vlera = payload + '.' + nenshkruaj(payload, sekreti);
  const pjeset = [EMRI + '=' + vlera, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (mbajMend) pjeset.push('Max-Age=' + Math.floor(ZGJATJA_MBAJ_MEND / 1000));
  return pjeset.join('; ');
}

function fshi() {
  return EMRI + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function lexo(cookieHeader, sekreti) {
  const gjetur = String(cookieHeader || '').split(';').map((c) => c.trim())
    .find((c) => c.startsWith(EMRI + '='));
  if (!gjetur) return null;
  const [payload, firma] = gjetur.slice(EMRI.length + 1).split('.');
  if (!payload || !firma) return null;
  const pritur = Buffer.from(nenshkruaj(payload, sekreti));
  const marre = Buffer.from(firma);
  if (pritur.length !== marre.length || !crypto.timingSafeEqual(pritur, marre)) return null;
  try {
    const t = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return t.exp > Date.now() && /^\d+$/.test(t.uid) ? t.uid : null;
  } catch {
    return null;
  }
}

module.exports = { krijo, fshi, lexo };
