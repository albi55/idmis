'use strict';

const db = require('../lib/db');
const { perdoruesiAktual, kufizuarNeBashki } = require('../lib/autentikimi');
const { KOKAT_SIGURIE, dergoJson, lexoJson, ngaEnjejtaOrigjine } = require('../lib/http');

const MAKS_FORMULARE = 50;
const MAKS_SKEMA = 500;

const EMRAT_E_SKEDAREVE = { 'Malsi e Madhe': 'Malësi e Madhe', Delvin: 'Delvinë' };
const EMRI_NE_SKEDARE = Object.fromEntries(Object.entries(EMRAT_E_SKEDAREVE).map(([a, b]) => [b, a]));
const LLOJET = ['rezervuar', 'lume', 'stacion'];
const TRANSFERIMET = ['plota', 'pjeserisht'];

const STATUSET = ['M', 'D', 'V', 'PZ', 'PZB'];
const VITI_MAKS = new Date().getFullYear() + 1;

const tekst = (maks) => (v) => (typeof v === 'string' && v.trim() && v.length <= maks ? v.trim() : undefined);
const njeNga = (lista) => (v) => (lista.includes(v) ? v : undefined);
const numer = (maks, dhjetore) => (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > maks) return undefined;
  const f = 10 ** dhjetore;
  return Math.abs(Math.round(v * f) - v * f) < 1e-6 ? Math.round(v * f) / f : undefined;
};
const viti = (v) => (Number.isInteger(v) && v >= 1900 && v <= VITI_MAKS ? v : undefined);
const vitOseDate = (v) => {
  if (typeof v !== 'string') return undefined;
  if (/^\d{4}$/.test(v)) return viti(+v) ? v : undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m || !viti(+m[1])) return undefined;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? v : undefined;
};
const FUNKSIONAL = njeNga(['po', 'pjeserisht', 'jo', 'panjohur']);

const FUSHAT = {
  kodi_i_ri: tekst(40),
  njesite: null,
  lloji: njeNga(['gravitet', 'pompim', 'perzier', 'tjeter']),
  operatori_id: null,
  siperfaqja_ujitshme: numer(1e6, 2),
  siperfaqja_sherbyeshme: numer(1e6, 2),
  siperfaqja_ujitur: numer(1e6, 2),
  siperfaqja_ujitur_viti: viti,
  fermere: numer(1e6, 0),
  fermere_sherbyer: numer(1e6, 0),
  fermere_sherbyer_viti: viti,
  burimi: njeNga(['lume', 'rezervuar', 'kanal', 'nentokesor', 'tjeter']),
  marrja: FUNKSIONAL,
  rrjeti_kryesor: FUNKSIONAL,
  rrjeti_shperndares: FUNKSIONAL,
  stacione: numer(1000, 0),
  stacione_funksionale: numer(1000, 0),
  gjendja: njeNga(['funksionale', 'pjeserisht', 'jofunksionale', 'panjohur']),
  vleresimi_fundit: vitOseDate,
  problemet: tekst(2000),
  dokumentacioni: tekst(300),
  statusi: njeNga(STATUSET),
  komente: tekst(2000),
};

const ME_STATUS = ['kodi_bashkise', 'kodi_skemes', 'emertimi', 'njesite', 'lloji', 'operatori', 'kodi_operatorit',
  'siperfaqja_ujitshme', 'siperfaqja_sherbyeshme', 'siperfaqja_ujitur', 'fermere', 'fermere_sherbyer', 'burimi',
  'marrja', 'rrjeti_kryesor', 'rrjeti_shperndares', 'stacione', 'stacione_funksionale', 'gjendja',
  'vleresimi_fundit', 'problemet', 'dokumentacioni'];
const VLERA_E_FUSHES = { kodi_skemes: 'kodi_i_ri', operatori: 'operatori_id' };

function pastro(hyrja, njesiteLejuara, operatoretLejuar) {
  if (!hyrja || typeof hyrja !== 'object' || Array.isArray(hyrja)) return { gabim: 'te_dhena' };
  const d = {};
  for (const [k, v] of Object.entries(hyrja)) {
    if (k === 'statuset') continue;
    if (!(k in FUSHAT)) return { gabim: 'fusha', fusha: k };
    if (v == null || v === '') continue;
    if (k === 'njesite') {
      if (!Array.isArray(v) || new Set(v).size !== v.length || !v.every((n) => njesiteLejuara.has(n))) return { gabim: 'vlera', fusha: k };
      if (v.length) d.njesite = v.slice().sort((a, b) => a.localeCompare(b, 'sq'));
      continue;
    }
    if (k === 'operatori_id') {
      if (!operatoretLejuar.has(v)) return { gabim: 'vlera', fusha: 'operatori' };
      d.operatori_id = v;
      continue;
    }
    const x = FUSHAT[k](v);
    if (x === undefined) return { gabim: 'vlera', fusha: k };
    d[k] = x;
  }
  const s = hyrja.statuset;
  if (s != null) {
    if (typeof s !== 'object' || Array.isArray(s)) return { gabim: 'vlera', fusha: 'statuset' };
    const st = {};
    for (const [k, v] of Object.entries(s)) {
      if (v == null || v === '') continue;
      if (!ME_STATUS.includes(k) || !STATUSET.includes(v)) return { gabim: 'vlera', fusha: 'statuset' };
      st[k] = v;
    }
    if (Object.keys(st).length) d.statuset = st;
  }
  for (const k of ME_STATUS) {
    const f = VLERA_E_FUSHES[k] || k;
    if (f in FUSHAT && d[f] != null && !(d.statuset && d.statuset[k])) return { gabim: 'statusi', fusha: k };
  }
  if (d.siperfaqja_ujitur != null && d.siperfaqja_ujitur_viti == null) return { gabim: 'viti', fusha: 'siperfaqja_ujitur' };
  if (d.fermere_sherbyer != null && d.fermere_sherbyer_viti == null) return { gabim: 'viti', fusha: 'fermere_sherbyer' };
  const mbi = (a, b) => d[a] != null && d[b] != null && d[a] > d[b];
  if (mbi('siperfaqja_ujitur', 'siperfaqja_ujitshme')) return { gabim: 'kufiri', fusha: 'siperfaqja_ujitur' };
  if (mbi('fermere_sherbyer', 'fermere')) return { gabim: 'kufiri', fusha: 'fermere_sherbyer' };
  if (mbi('stacione_funksionale', 'stacione')) return { gabim: 'kufiri', fusha: 'stacione_funksionale' };
  return { te_dhenat: d };
}

async function gjejBashkine(emri) {
  const r = await db.query('SELECT id, emri, kodi FROM bashkia WHERE aktive AND emri = $1',
    [EMRAT_E_SKEDAREVE[emri] || emri || '']);
  return r.rows[0] || null;
}

const mundTeNdryshoje = (p) => p.roli === 'ADMINISTRATOR' || p.roli === 'OPERATOR_BASHKIE' || p.roli === 'SPECIALIST';

async function bashkiaESkemave(id) {
  const r = await db.query('SELECT bashkuar_ne_id FROM bashkia_bashkimi WHERE bashkia_id = $1', [id]);
  return r.rowCount ? r.rows[0].bashkuar_ne_id : id;
}

async function lejohetBashkia(p, bashkiaId) {
  return !kufizuarNeBashki(p) || bashkiaId === await bashkiaESkemave(p.bashkia_id);
}

const numri = (v) => (v == null ? null : Number(v));

async function skematSipasBashkise(bashkiaId, q = db) {
  const r = await q.query(
    `SELECT s.id, s.transferimi, s.kodi, s.emertimi, s.burimi, s.km, s.teren, s.perditesuar_km, s.ndryshuar_me, b.emri AS bashkia,
            COALESCE(json_agg(json_build_object('lloji', l.lloji, 'renditja', l.renditja, 'burimi', l.burimi))
                     FILTER (WHERE l.lloji IS NOT NULL), '[]') AS llojet
       FROM skema_ujitese s
       JOIN bashkia b ON b.id = s.bashkia_id
       LEFT JOIN skema_ujitese_lloji l ON l.skema_id = s.id
      WHERE $1::int IS NULL OR s.bashkia_id = $1
      GROUP BY s.id, b.emri
      ORDER BY b.emri, s.transferimi, s.renditja`, [bashkiaId]);
  const te = {};
  for (const s of r.rows) {
    const k = EMRI_NE_SKEDARE[s.bashkia] || s.bashkia;
    const m = te[k] = te[k] || { plota: [], pjeserisht: [] };
    const rr = { id: s.id, kodi: s.kodi, emertimi: s.emertimi, burimi: s.burimi, km: numri(s.km),
      teren: s.teren ? true : null, perditesuarKm: numri(s.perditesuar_km), lloji: [], ord: {} };
    for (const l of s.llojet) {
      rr.lloji.push(l.lloji);
      rr.ord[l.lloji] = l.renditja - 1;
      if (l.burimi != null) (rr.burimiSh = rr.burimiSh || {})[l.lloji] = l.burimi;
    }
    if (s.ndryshuar_me) rr.perditesuarMe = s.ndryshuar_me.toISOString();
    m[s.transferimi].push(rr);
  }
  return te;
}

async function skripti(req, res) {
  const p = await perdoruesiAktual(req);
  let te = {};
  if (p) te = await skematSipasBashkise(kufizuarNeBashki(p) ? await bashkiaESkemave(p.bashkia_id) : null);
  const b = Buffer.from('window.IDMIS_SKEMAT = ' + JSON.stringify(te).replace(/</g, '\\u003c') + ';\n', 'utf8');
  res.writeHead(200, { ...KOKAT_SIGURIE, 'Content-Type': 'text/javascript; charset=utf-8',
    'Content-Length': b.length, 'Cache-Control': 'no-store' });
  res.end(b);
}

const tekstSkeme = (maks, iDetyruar) => (v) => {
  if (v == null || v === '') return iDetyruar ? undefined : null;
  if (typeof v !== 'string') return undefined;
  const t = v.replace(/\s+/g, ' ').trim();
  if (!t) return iDetyruar ? undefined : null;
  return t.length <= maks ? t : undefined;
};
const km = (v) => (v == null ? null : numer(1e6, 2)(v));
const FUSHAT_SKEMA = {
  kodi: tekstSkeme(60, true),
  emertimi: tekstSkeme(200, true),
  burimi: tekstSkeme(200, false),
  km,
  teren: (v) => (v === true ? true : v == null || v === false ? null : undefined),
  perditesuarKm: km,
};
const KOLONA = { kodi: 'kodi', emertimi: 'emertimi', burimi: 'burimi', km: 'km', teren: 'teren', perditesuarKm: 'perditesuar_km' };

function pastroSkemen(hyrja, eRe) {
  if (!hyrja || typeof hyrja !== 'object' || Array.isArray(hyrja)) return { gabim: 'te_dhena' };
  const d = {};
  for (const [k, f] of Object.entries(FUSHAT_SKEMA)) {
    if (!(k in hyrja)) {
      if (eRe && (k === 'kodi' || k === 'emertimi')) return { gabim: 'vlera', fusha: k };
      continue;
    }
    const v = f(hyrja[k]);
    if (v === undefined) return { gabim: 'vlera', fusha: k };
    d[k] = v;
  }
  return { d };
}

const pamja = (s) => ({ kodi: s.kodi, emertimi: s.emertimi, burimi: s.burimi ?? null, km: numri(s.km), teren: s.teren ? true : null, perditesuarKm: numri(s.perditesuar_km) });

async function ruajSkemat(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req, 512 * 1024);
  const ndryshime = Array.isArray(trupi.ndryshime) ? trupi.ndryshime : [];
  const shtesa = Array.isArray(trupi.shtesa) ? trupi.shtesa : [];
  if (!ndryshime.length && !shtesa.length) return dergoJson(res, 400, { gabim: 'te_dhena' });
  if (ndryshime.length + shtesa.length > MAKS_SKEMA) return dergoJson(res, 400, { gabim: 'shume' });
  const llojiFaqes = trupi.lloji ? (LLOJET.includes(trupi.lloji) ? trupi.lloji : undefined) : null;
  if (llojiFaqes === undefined) return dergoJson(res, 400, { gabim: 'vlera', fusha: 'lloji' });
  const b = await gjejBashkine(trupi.bashkia);
  if (!b) return dergoJson(res, 400, { gabim: 'bashkia' });
  if (b.id !== await bashkiaESkemave(b.id)) return dergoJson(res, 400, { gabim: 'bashkia' });
  if (!await lejohetBashkia(p, b.id)) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });

  const ndr = [];
  for (const n of ndryshime) {
    if (!n || !Number.isInteger(n.id)) return dergoJson(res, 400, { gabim: 'te_dhena' });
    const r = pastroSkemen(n, false);
    if (r.gabim) return dergoJson(res, 400, { ...r, id: n.id });
    ndr.push({ id: n.id, d: r.d });
  }
  if (new Set(ndr.map((n) => n.id)).size !== ndr.length) return dergoJson(res, 400, { gabim: 'te_dhena' });
  const shs = [];
  for (const s of shtesa) {
    const r = pastroSkemen(s, true);
    if (r.gabim) return dergoJson(res, 400, r);
    if (!TRANSFERIMET.includes(s.transferimi)) return dergoJson(res, 400, { gabim: 'vlera', fusha: 'transferimi' });
    const llojet = Array.isArray(s.lloji) ? s.lloji : [];
    if (new Set(llojet).size !== llojet.length || !llojet.every((l) => LLOJET.includes(l))) return dergoJson(res, 400, { gabim: 'vlera', fusha: 'lloji' });
    shs.push({ transferimi: s.transferimi, llojet, d: { km: 0, ...r.d } });
  }

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    await klienti.query('SELECT pg_advisory_xact_lock(14, $1)', [b.id]);
    let ruajtur = 0;
    for (const n of ndr) {
      const para = await klienti.query(
        'SELECT kodi, emertimi, burimi, km, teren, perditesuar_km FROM skema_ujitese WHERE id = $1 AND bashkia_id = $2 FOR UPDATE', [n.id, b.id]);
      if (!para.rowCount) {
        await klienti.query('ROLLBACK');
        return dergoJson(res, 404, { gabim: 'skema', id: n.id });
      }
      const vjeter = pamja(para.rows[0]);
      const d = { ...n.d };
      let llojiBurimi = null;
      if (llojiFaqes && 'burimi' in d) {
        const l = await klienti.query('SELECT burimi FROM skema_ujitese_lloji WHERE skema_id = $1 AND lloji = $2', [n.id, llojiFaqes]);
        if (l.rowCount && l.rows[0].burimi != null) {
          llojiBurimi = { para: l.rows[0].burimi, pas: d.burimi };
          delete d.burimi;
        }
      }
      const ri = { ...vjeter, ...d };
      if (ri.perditesuarKm != null && ri.perditesuarKm > (ri.km || 0)) {
        await klienti.query('ROLLBACK');
        return dergoJson(res, 400, { gabim: 'kufiri', fusha: 'perditesuarKm', id: n.id });
      }
      const ndryshuarFusha = Object.keys(d).filter((k) => ri[k] !== vjeter[k]);
      const ndryshuarLloji = llojiBurimi && llojiBurimi.pas !== llojiBurimi.para;
      if (!ndryshuarFusha.length && !ndryshuarLloji) continue;
      if (ndryshuarFusha.length) {
        await klienti.query(
          `UPDATE skema_ujitese SET ${ndryshuarFusha.map((k, i) => KOLONA[k] + ' = $' + (i + 3)).join(', ')}, perdoruesi_id = $2, ndryshuar_me = now() WHERE id = $1`,
          [n.id, p.id, ...ndryshuarFusha.map((k) => ri[k])]);
      } else {
        await klienti.query('UPDATE skema_ujitese SET perdoruesi_id = $2, ndryshuar_me = now() WHERE id = $1', [n.id, p.id]);
      }
      const hPara = { ...vjeter }, hPas = { ...ri };
      if (ndryshuarLloji) {
        await klienti.query('UPDATE skema_ujitese_lloji SET burimi = $3 WHERE skema_id = $1 AND lloji = $2', [n.id, llojiFaqes, llojiBurimi.pas]);
        hPara['burimi_' + llojiFaqes] = llojiBurimi.para;
        hPas['burimi_' + llojiFaqes] = llojiBurimi.pas;
      }
      await klienti.query('INSERT INTO skema_ujitese_historiku (skema_id, para, pas, perdoruesi_id) VALUES ($1, $2, $3, $4)',
        [n.id, JSON.stringify(hPara), JSON.stringify(hPas), p.id]);
      ruajtur += 1;
    }
    for (const s of shs) {
      if (s.d.perditesuarKm != null && s.d.perditesuarKm > (s.d.km || 0)) {
        await klienti.query('ROLLBACK');
        return dergoJson(res, 400, { gabim: 'kufiri', fusha: 'perditesuarKm' });
      }
      const r = await klienti.query(
        `INSERT INTO skema_ujitese (bashkia_id, bashkia_burim_id, transferimi, renditja, kodi, emertimi, burimi, km, teren, perditesuar_km, perdoruesi_id, ndryshuar_me)
         SELECT $1::int, $1::int, $2::varchar, COALESCE(MAX(renditja), 0) + 1, $3::varchar, $4::varchar, $5::varchar, $6::numeric, $7::boolean, $8::numeric, $9::bigint, now()
           FROM skema_ujitese WHERE bashkia_id = $1::int AND transferimi = $2::varchar
         RETURNING id`,
        [b.id, s.transferimi, s.d.kodi, s.d.emertimi, s.d.burimi ?? null, s.d.km ?? 0, s.d.teren ?? null, s.d.perditesuarKm ?? null, p.id]);
      const id = r.rows[0].id;
      for (const l of s.llojet) {
        await klienti.query(
          `INSERT INTO skema_ujitese_lloji (skema_id, lloji, renditja)
           SELECT $1::int, $2::varchar, COALESCE(MAX(l.renditja), 0) + 1
             FROM skema_ujitese_lloji l JOIN skema_ujitese s ON s.id = l.skema_id
            WHERE s.bashkia_id = $3::int AND l.lloji = $2::varchar`, [id, l, b.id]);
      }
      await klienti.query('INSERT INTO skema_ujitese_historiku (skema_id, para, pas, perdoruesi_id) VALUES ($1, NULL, $2, $3)',
        [id, JSON.stringify({ transferimi: s.transferimi, lloji: s.llojet, ...pamja({ ...s.d, perditesuar_km: s.d.perditesuarKm }) }), p.id]);
      ruajtur += 1;
    }
    await klienti.query('COMMIT');
    const te = await skematSipasBashkise(b.id);
    const emri = EMRI_NE_SKEDARE[b.emri] || b.emri;
    dergoJson(res, 200, { ruajtur, bashkia: emri, te_dhenat: te[emri] || { plota: [], pjeserisht: [] } });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    if (err.code === '23505') return dergoJson(res, 409, { gabim: 'dyfish' });
    if (err.code === '23514') return dergoJson(res, 400, { gabim: 'kufiri' });
    throw err;
  } finally {
    klienti.release();
  }
}

async function lista(req, res) {
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  const b = await gjejBashkine(new URL(req.url, 'http://x').searchParams.get('bashkia'));
  if (!b) return dergoJson(res, 404, { gabim: 'bashkia' });
  if (!await lejohetBashkia(p, b.id)) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });

  const [njesite, operatoret, formularet] = await Promise.all([
    db.query('SELECT emri FROM njesia_administrative WHERE bashkia_id = $1 ORDER BY emri', [b.id]),
    db.query('SELECT id, kodi, emri, aktiv FROM operatori WHERE bashkia_id = $1 ORDER BY kodi', [b.id]),
    db.query(`SELECT f.celesi, f.te_dhenat, f.perditesuar_me, p.emri_plote AS perdoruesi
                FROM skema_formulari f JOIN perdoruesi p ON p.id = f.perdoruesi_id
               WHERE f.bashkia_id = $1`, [b.id]),
  ]);
  const f = {};
  formularet.rows.forEach((r) => { f[r.celesi] = { te_dhenat: r.te_dhenat, perditesuar_me: r.perditesuar_me, perdoruesi: r.perdoruesi }; });
  dergoJson(res, 200, {
    bashkia: { emri: b.emri, kodi: b.kodi },
    njesite: njesite.rows.map((r) => r.emri),
    operatoret: operatoret.rows,
    formularet: f,
    mundTeNdryshoje: mundTeNdryshoje(p),
  });
}

async function ruaj(req, res) {
  if (!ngaEnjejtaOrigjine(req)) return dergoJson(res, 403, { gabim: 'origjina' });
  const p = await perdoruesiAktual(req);
  if (!p) return dergoJson(res, 401, { gabim: 'pa_hyrje' });
  if (!mundTeNdryshoje(p)) return dergoJson(res, 403, { gabim: 'pa_leje' });

  const trupi = await lexoJson(req, 256 * 1024);
  const lista = Array.isArray(trupi.formularet) ? trupi.formularet : null;
  if (!lista || !lista.length || lista.length > MAKS_FORMULARE) return dergoJson(res, 400, { gabim: 'te_dhena' });
  const b = await gjejBashkine(trupi.bashkia);
  if (!b) return dergoJson(res, 400, { gabim: 'bashkia' });
  if (!await lejohetBashkia(p, b.id)) return dergoJson(res, 403, { gabim: 'jashte_bashkise' });

  const skemat = new Set((await db.query('SELECT id FROM skema_ujitese WHERE bashkia_id = $1', [b.id])).rows.map((r) => String(r.id)));
  const njesite = new Set((await db.query('SELECT emri FROM njesia_administrative WHERE bashkia_id = $1', [b.id])).rows.map((r) => r.emri));
  const aktiv = new Map((await db.query('SELECT id, aktiv FROM operatori WHERE bashkia_id = $1', [b.id])).rows.map((r) => [r.id, r.aktiv]));
  const teMira = [];
  for (const f of lista) {
    const ok = (s, maks) => typeof s === 'string' && s.trim() && s.length <= maks;
    if (!f || !ok(f.celesi, 200) || !ok(f.kodi, 60) || !ok(f.emertimi, 200)) return dergoJson(res, 400, { gabim: 'te_dhena' });
    if (!skemat.has(f.celesi)) return dergoJson(res, 400, { gabim: 'skema', celesi: f.celesi });
    const r = pastro(f.te_dhenat, njesite, aktiv);
    if (r.gabim) return dergoJson(res, 400, { gabim: r.gabim, fusha: r.fusha, celesi: f.celesi });
    teMira.push({ celesi: f.celesi, kodi: f.kodi.trim(), emertimi: f.emertimi.trim(), te_dhenat: r.te_dhenat });
  }
  if (new Set(teMira.map((f) => f.celesi)).size !== teMira.length) return dergoJson(res, 400, { gabim: 'te_dhena' });

  const klienti = await db.connect();
  try {
    await klienti.query('BEGIN');
    let ruajtur = 0;
    const kthim = {};
    for (const f of teMira) {
      const para = await klienti.query(
        'SELECT te_dhenat, te_dhenat = $3::jsonb AS njejte FROM skema_formulari WHERE bashkia_id = $1 AND celesi = $2 FOR UPDATE',
        [b.id, f.celesi, JSON.stringify(f.te_dhenat)]);
      if (para.rowCount && para.rows[0].njejte) continue;
      const op = f.te_dhenat.operatori_id;
      if (op != null && !aktiv.get(op) && !(para.rowCount && para.rows[0].te_dhenat.operatori_id === op)) {
        await klienti.query('ROLLBACK');
        return dergoJson(res, 400, { gabim: 'operatori_jo_aktiv', fusha: 'operatori', celesi: f.celesi });
      }
      if (!para.rowCount && !Object.keys(f.te_dhenat).length) continue;
      const r = await klienti.query(
        `INSERT INTO skema_formulari (bashkia_id, celesi, kodi, emertimi, te_dhenat, perdoruesi_id, skema_id)
         VALUES ($1, $2, $3, $4, $5, $6, $2::int)
         ON CONFLICT (bashkia_id, celesi) DO UPDATE
           SET kodi = EXCLUDED.kodi, emertimi = EXCLUDED.emertimi, te_dhenat = EXCLUDED.te_dhenat,
               perdoruesi_id = EXCLUDED.perdoruesi_id, perditesuar_me = NOW()
         RETURNING perditesuar_me`,
        [b.id, f.celesi, f.kodi, f.emertimi, JSON.stringify(f.te_dhenat), p.id]);
      await klienti.query(
        `INSERT INTO skema_formulari_historiku (bashkia_id, celesi, para, pas, perdoruesi_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [b.id, f.celesi, para.rowCount ? JSON.stringify(para.rows[0].te_dhenat) : null, JSON.stringify(f.te_dhenat), p.id]);
      kthim[f.celesi] = { perditesuar_me: r.rows[0].perditesuar_me, perdoruesi: p.emri_plote };
      ruajtur += 1;
    }
    await klienti.query('COMMIT');
    dergoJson(res, 200, { ruajtur, formularet: kthim });
  } catch (err) {
    await klienti.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    klienti.release();
  }
}

module.exports = {
  'GET /js/skemat-ujitese-data.js': skripti,
  'PUT /api/skemat': ruajSkemat,
  'GET /api/skemat/formulari': lista,
  'PUT /api/skemat/formulari': ruaj,
};
