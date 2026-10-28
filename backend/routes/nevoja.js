'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { dergoJson } = require('../lib/http');
const { nevojaMujore } = require('../lib/llogaritja');

const GRUPET_SHUMEVJECARE = ['AL-GCROP-008', 'AL-GCROP-009', 'AL-GCROP-010'];

const numOsePa = (v) => (v == null ? null : Number(v));

function lexoDaten(s) {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return false;
  return { muaji: +m[2], dita: +m[3] };
}

async function nevoja(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });

  const params = new URL(req.url, 'http://x').searchParams;
  const data = lexoDaten(params.get('data'));
  if (data === false) return dergoJson(res, 400, { gabim: 'data' });

  const vend = await db.query(
    `SELECT b.id AS bashkia_id, z.kodi, z.emri, z.id AS zona_id
       FROM bashkia b
       JOIN njesia_administrative n ON n.bashkia_id = b.id AND n.emri = $2
       LEFT JOIN zona_agroklimatike z ON z.id = n.zona_id
      WHERE b.aktive AND b.emri = $1`, [params.get('bashkia') || '', params.get('njesia') || '']);
  if (!vend.rowCount) return dergoJson(res, 404, { gabim: 'njesia' });
  const v = vend.rows[0];
  if (kufizuarNeBashki(p) && v.bashkia_id !== p.bashkia_id) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });
  if (!v.zona_id) return dergoJson(res, 200, { zona: null, kulturat: [] });

  const [klima, kulturat] = await Promise.all([
    db.query('SELECT eto_mm_dite, reshjet_efektive_mm FROM klima_mujore WHERE zona_id = $1 ORDER BY muaji', [v.zona_id]),
    db.query(`SELECT k.emri, g.emri AS grupi, g.kodi AS grupi_kodi,
                     pr.l1, pr.l2, pr.l3, pr.l4, pr.kc_ini, pr.kc_mid, pr.kc_end, pr.muaji_mbjelljes, pr.id AS profili
                FROM bashkia_kultura bk
                JOIN kultura k ON k.id = bk.kultura_id
                JOIN grupi_kultures g ON g.id = k.grupi_id
                LEFT JOIN v_profili_kultures pr ON pr.kultura_id = k.id AND pr.zona_id = $2
               WHERE bk.bashkia_id = $1
               ORDER BY g.kodi, k.kodi`, [v.bashkia_id, v.zona_id]),
  ]);
  const eto = klima.rows.map((r) => Number(r.eto_mm_dite));
  const reshjet = klima.rows.map((r) => numOsePa(r.reshjet_efektive_mm));

  dergoJson(res, 200, {
    zona: { kodi: v.kodi, emri: v.emri },
    kulturat: kulturat.rows.map((r) => {
      const l = r.l1 == null ? null : [r.l1, r.l2, r.l3, r.l4];
      const kc = [numOsePa(r.kc_ini), numOsePa(r.kc_mid), numOsePa(r.kc_end)];
      const muaji = data ? data.muaji : r.muaji_mbjelljes;
      const n = l && muaji ? nevojaMujore(l, kc, muaji, eto, reshjet, data ? data.dita : 1) : null;
      return {
        emri: r.emri,
        grupi: r.grupi,
        shumevjecare: GRUPET_SHUMEVJECARE.includes(r.grupi_kodi),
        muaji,
        neto: n && n.neto,
        mungon: !r.profili ? 'profili' : !l || kc.some((k) => k == null) ? 'parametrat' : !muaji ? 'muaji' : null,
      };
    }),
  });
}

module.exports = {
  'GET /api/nevoja': nevoja,
};
