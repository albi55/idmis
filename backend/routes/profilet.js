'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');
const { kalendari, nevojaMujore } = require('../lib/llogaritja');

const MAKS_NDRYSHIME = 500;

function mundTeNdryshoje(p) {
  return !!p && p.roli === 'ADMINISTRATOR';
}

const iPlote = (v) => Number.isInteger(v) && v > 0 && v < 2147483647;
const numOsePa = (v) => (v == null ? null : Number(v));
const kcIVlefshem = (v) => v === null || (typeof v === 'number' && v >= 0 && v <= 2 && Math.abs(v * 100 - Math.round(v * 100)) < 1e-9);
const etoIVlefshem = (v) => typeof v === 'number' && v >= 0 && v <= 15 && Math.abs(v * 10 - Math.round(v * 10)) < 1e-9;
const reshjetTeVlefshme = (v) => v === null || (typeof v === 'number' && v >= 0 && v <= 500 && Math.abs(v * 10 - Math.round(v * 10)) < 1e-9);
const fazatTeVlefshme = (l) => l === null || (Array.isArray(l) && l.length === 4
  && l.every((d) => Number.isInteger(d) && d >= 1 && d <= 365) && l.reduce((a, b) => a + b, 0) <= 366);

async function lista(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });

  const params = new URL(req.url, 'http://x').searchParams;
  const kerkuarB = Number(params.get('bashkia'));
  const bashkiaId = kufizuarNeBashki(p) ? p.bashkia_id : (iPlote(kerkuarB) ? kerkuarB : p.bashkia_id);

  const [zonatR, bashkiteR, zonatBashkiseR] = await Promise.all([
    db.query('SELECT id, kodi, emri FROM zona_agroklimatike ORDER BY kodi'),
    db.query(`SELECT b.id, b.emri, q.emri AS qarku
                FROM bashkia b JOIN qarku q ON q.id = b.qarku_id
               WHERE b.aktive AND ($1::int IS NULL OR b.id = $1)
               ORDER BY q.emri, b.emri`, [kufizuarNeBashki(p) ? p.bashkia_id : null]),
    db.query(`SELECT zona_id FROM njesia_administrative WHERE bashkia_id = $1 AND zona_id IS NOT NULL
               GROUP BY zona_id ORDER BY count(*) DESC, zona_id`, [bashkiaId]),
  ]);
  const zonat = zonatR.rows;
  if (!bashkiteR.rows.some((b) => b.id === bashkiaId)) return dergoJson(res, 404, { gabim: 'bashkia' });
  const zonatBashkise = zonatBashkiseR.rows.map((r) => r.zona_id);
  const zona = zonat.find((z) => z.kodi === params.get('zona'))
    || zonat.find((z) => z.id === zonatBashkise[0]) || zonat[0];

  const [klima, profilet, paProfil, nZgjedhur] = await Promise.all([
    db.query(`SELECT muaji, eto_mm_dite, reshjet_efektive_mm FROM klima_mujore WHERE zona_id = $1 ORDER BY muaji`, [zona.id]),
    db.query(`SELECT v.id, v.rendi, v.emri, v.l1, v.l2, v.l3, v.l4,
                     v.kc_ini, v.kc_mid, v.kc_end, v.muaji_mbjelljes, v.mbjellja_orientuese,
                     v.statusi_validimit, v.shenim
                FROM v_profili_kultures v
                JOIN kultura k ON k.id = v.kultura_id
                JOIN bashkia_kultura bk ON bk.kultura_id = v.kultura_id AND bk.bashkia_id = $2
               WHERE v.zona_id = $1 ORDER BY k.kodi`, [zona.id, bashkiaId]),
    db.query(`SELECT k.emri
                FROM bashkia_kultura bk JOIN kultura k ON k.id = bk.kultura_id
               WHERE bk.bashkia_id = $2
                 AND NOT EXISTS (SELECT 1 FROM profili_kultures p WHERE p.kultura_id = k.id AND p.zona_id = $1)
               ORDER BY k.kodi`, [zona.id, bashkiaId]),
    db.query('SELECT count(*)::int AS n FROM bashkia_kultura WHERE bashkia_id = $1', [bashkiaId]),
  ]);
  const admin = mundTeNdryshoje(p);
  const eto = klima.rows.map((r) => Number(r.eto_mm_dite));
  const reshjet = klima.rows.map((r) => numOsePa(r.reshjet_efektive_mm));
  dergoJson(res, 200, {
    zonat,
    zona_id: zona.id,
    bashkia_id: bashkiaId,
    bashkite: bashkiteR.rows,
    zonat_e_bashkise: zonatBashkise,
    kufizim: kufizuarNeBashki(p),
    zgjedhur: nZgjedhur.rows[0].n,
    pa_profil: paProfil.rows,
    klima: klima.rows.map((r) => ({ muaji: r.muaji, eto: Number(r.eto_mm_dite), reshjet: numOsePa(r.reshjet_efektive_mm) })),
    profilet: profilet.rows.map((r) => {
      const l = r.l1 == null ? null : [r.l1, r.l2, r.l3, r.l4];
      const kc = [numOsePa(r.kc_ini), numOsePa(r.kc_mid), numOsePa(r.kc_end)];
      const nevoja = nevojaMujore(l, kc, r.muaji_mbjelljes, eto, reshjet);
      const rreshti = {
        id: r.id, rendi: r.rendi, emri: r.emri,
        muaji: r.muaji_mbjelljes, mbjellja: r.mbjellja_orientuese, statusi: r.statusi_validimit, shenim: r.shenim,
        kalendari: kalendari(l, r.muaji_mbjelljes),
        etc: nevoja && nevoja.etc,
        neto: nevoja && nevoja.neto,
        mungon: !l ? 'profili' : !r.muaji_mbjelljes ? 'muaji' : null,
      };
      if (admin) { rreshti.l = l; rreshti.kc = kc; }
      return rreshti;
    }),
    mundTeNdryshoje: mundTeNdryshoje(p),
  });
}

async function ndrysho(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req, 128 * 1024);
  const zonaId = trupi.zona_id;
  const arsyeja = typeof trupi.arsyeja === 'string' ? trupi.arsyeja.trim() : '';
  const profilet = Array.isArray(trupi.profilet) ? trupi.profilet : [];
  const klima = Array.isArray(trupi.klima) ? trupi.klima : [];
  if (!iPlote(zonaId) || !arsyeja || arsyeja.length > 500) return dergoJson(res, 400, { gabim: arsyeja ? 'te_dhena' : 'arsyeja' });
  if (!(profilet.length + klima.length) || profilet.length + klima.length > MAKS_NDRYSHIME
      || !profilet.every((x) => x && iPlote(x.id) && fazatTeVlefshme(x.l) && Array.isArray(x.kc) && x.kc.length === 3
        && x.kc.every(kcIVlefshem) && (x.muaji === null || (Number.isInteger(x.muaji) && x.muaji >= 1 && x.muaji <= 12)))
      || !klima.every((x) => x && Number.isInteger(x.muaji) && x.muaji >= 1 && x.muaji <= 12
        && ('eto' in x || 'reshjet' in x) && (!('eto' in x) || etoIVlefshem(x.eto)) && (!('reshjet' in x) || reshjetTeVlefshme(x.reshjet)))
      || new Set(profilet.map((x) => x.id)).size !== profilet.length
      || new Set(klima.map((x) => x.muaji)).size !== klima.length) {
    return dergoJson(res, 400, { gabim: 'te_dhena' });
  }

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    const z = await klienti.query('SELECT kodi FROM zona_agroklimatike WHERE id = $1', [zonaId]);
    if (!z.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'zona' }); }
    const historik = (tabela, rreshti, para, pas) => klienti.query(
      `INSERT INTO parametrat_historiku (tabela, rreshti, para, pas, arsyeja, perdoruesi_id)
       VALUES ($1, $2, $3, $4, $5, $6)`, [tabela, rreshti, para, pas, arsyeja, p.id]);

    let nProfile = 0;
    for (const x of profilet) {
      const r = await klienti.query(
        `SELECT p.zona_id, p.kc_ini, p.kc_mid, p.kc_end, p.muaji_mbjelljes,
                (SELECT array_agg(ditet ORDER BY nr) FROM profili_faza f WHERE f.profili_id = p.id) AS l
           FROM profili_kultures p WHERE p.id = $1 FOR UPDATE`, [x.id]);
      if (!r.rowCount || r.rows[0].zona_id !== zonaId) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'profili', id: x.id }); }
      const ishte = r.rows[0];
      const para = {};
      const pas = {};
      const lIshte = ishte.l || null;
      if (JSON.stringify(lIshte) !== JSON.stringify(x.l)) {
        para.fazat = lIshte; pas.fazat = x.l;
        if (x.l === null) {
          await klienti.query('DELETE FROM profili_faza WHERE profili_id = $1', [x.id]);
        } else if (lIshte === null) {
          await klienti.query(
            `INSERT INTO profili_faza (profili_id, nr, ditet) SELECT $1, n, d FROM unnest($2::smallint[]) WITH ORDINALITY AS t (d, n)`,
            [x.id, x.l]);
        } else {
          for (let n = 0; n < 4; n++) {
            if (lIshte[n] !== x.l[n]) await klienti.query('UPDATE profili_faza SET ditet = $3 WHERE profili_id = $1 AND nr = $2', [x.id, n + 1, x.l[n]]);
          }
        }
      }
      const fushat = ['kc_ini', 'kc_mid', 'kc_end'];
      const set = [];
      const vlerat = [x.id];
      fushat.forEach((f, i) => {
        const a = numOsePa(ishte[f]);
        if (a !== x.kc[i]) { para[f] = a; pas[f] = x.kc[i]; vlerat.push(x.kc[i]); set.push(f + ' = $' + vlerat.length); }
      });
      if (ishte.muaji_mbjelljes !== x.muaji) {
        para.muaji_mbjelljes = ishte.muaji_mbjelljes; pas.muaji_mbjelljes = x.muaji;
        vlerat.push(x.muaji); set.push('muaji_mbjelljes = $' + vlerat.length);
      }
      if (set.length) await klienti.query('UPDATE profili_kultures SET ' + set.join(', ') + ' WHERE id = $1', vlerat);
      if (Object.keys(pas).length) { await historik('profili_kultures', String(x.id), para, pas); nProfile += 1; }
    }

    let nKlima = 0;
    for (const x of klima) {
      const r = await klienti.query('SELECT eto_mm_dite, reshjet_efektive_mm FROM klima_mujore WHERE zona_id = $1 AND muaji = $2 FOR UPDATE', [zonaId, x.muaji]);
      if (!r.rowCount) { await klienti.query('ROLLBACK'); return dergoJson(res, 400, { gabim: 'klima', muaji: x.muaji }); }
      const ishte = { eto_mm_dite: Number(r.rows[0].eto_mm_dite), reshjet_efektive_mm: numOsePa(r.rows[0].reshjet_efektive_mm) };
      const behet = {
        eto_mm_dite: 'eto' in x ? x.eto : ishte.eto_mm_dite,
        reshjet_efektive_mm: 'reshjet' in x ? x.reshjet : ishte.reshjet_efektive_mm,
      };
      const para = {};
      const pas = {};
      Object.keys(behet).forEach((f) => { if (behet[f] !== ishte[f]) { para[f] = ishte[f]; pas[f] = behet[f]; } });
      if (!Object.keys(pas).length) continue;
      await klienti.query('UPDATE klima_mujore SET eto_mm_dite = $3, reshjet_efektive_mm = $4 WHERE zona_id = $1 AND muaji = $2',
        [zonaId, x.muaji, behet.eto_mm_dite, behet.reshjet_efektive_mm]);
      await historik('klima_mujore', z.rows[0].kodi + '-' + x.muaji, para, pas);
      nKlima += 1;
    }
    await klienti.query('COMMIT');
    dergoJson(res, 200, { profile: nProfile, klima: nKlima });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

module.exports = {
  'GET /api/profilet': lista,
  'PUT /api/profilet': ndrysho,
};
