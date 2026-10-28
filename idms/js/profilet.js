(function () {
  'use strict';

  var root = document.getElementById('pkRoot');
  if (!root) return;

  var T = {
    sq: {
      edit: 'Ndrysho', cancel: 'Anulo', save: 'Ruaj', exportCsv: 'Eksporto CSV',
      viewCal: 'Kalendari i fazave', viewEtc: 'ETc (mm)', viewNeto: 'Nevoja për ujitje (mm)', views: 'Pamja', zone: 'Zona', bashkia: 'Bashkia',
      noneChosen: 'Bashkia {b} nuk ka zgjedhur ende kultura. Zgjidhini te {link}.',
      chooseLink: 'Përditësimi i të dhënave → Kulturat e bashkisë',
      noneInZone: 'Kulturat e zgjedhura nga bashkia {b} nuk kanë ende parametra për këtë zonë.',
      missing: 'Të zgjedhura nga bashkia, por pa parametra për këtë zonë ({n}):',
      months: ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'],
      mShort: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'],
      colNr: 'Nr.', colKultura: 'Kultura', colTco: 'TCo (ditë)', colFazat: 'Fazat (ditë)',
      colKc: 'Kc', colMuaji: 'Muaji i mbjelljes', colOrient: 'Mbjellja orientuese',
      colCal: 'Kalendari i fazave (Shtator → Gusht)', colEtcM: 'ETc sipas muajit (mm)', colEtcTot: 'ETc gjithsej (mm)',
      colNetoM: 'Nevoja neto për ujitje sipas muajit (mm)', colNetoTot: 'Neto gjithsej (mm)',
      etoRow: 'ET₀ (mm/ditë)', etoYear: '{n} mm/vit',
      peRow: 'Reshjet efektive (mm/muaj)', peYear: '{n} mm/vit', peNone: 'pa të dhëna',
      stage1: 'Faza fillestare', stage2: 'Zhvillimi', stage3: 'Mesi i sezonit', stage4: 'Fundi i sezonit',
      lvTitle: 'Niveli (mm në muaj):', lv0: 'Mbulohet nga reshjet', lv1: 'E ulët < {a}', lv2: 'Mesatare {a}–{b}', lv3: 'E lartë {a}–{b}', lv4: 'Kulmore ≥ {a}',
      cellTip: 'ETc {e} mm − mbuluar nga reshjet {r} mm = nevoja neto {n} mm',
      noRain: 'Reshjet efektive mungojnë për {n} muaj: atje nevoja neto = ETc. Administratori i plotëson te rreshti "Reshjet efektive" (Ndrysho).',
      title: '{z}: fazat dhe Kc e kulturave', count: '{n} kultura të zgjedhura · {c} me kalendar',
      noProfile: 'Pa profil: ditët dhe Kc mungojnë', noMonth: 'Pa muaj mbjelljeje',
      pickMonth: 'Klikoni muajin e mbjelljes',
      noRows: 'Për këtë zonë nuk është futur ende tabela e kulturave. ET₀ e zonës është gati.',
      readOnly: 'Parametrat e zonave i ndryshon vetëm administratori.',
      editHint: 'Ndryshoni ditët, Kc ose muajin e mbjelljes; klikoni një muaj te kalendari për ta zhvendosur mbjelljen atje. Kalendari, ETc dhe nevoja neto rillogariten menjëherë. ET₀ dhe reshjet efektive ndryshohen te dy rreshtat e parë.',
      reason: 'Arsyeja e ndryshimit', reasonPh: 'p.sh. Korrigjim sipas verifikimit agronomik të zonës',
      reasonNeed: 'Shkruani arsyen e ndryshimit para se të ruani.',
      invalid: 'Disa rreshta kanë vlera të pavlefshme (të kuqe). Fazat: 1–365 ditë, gjithsej ≤ 366, ose të katërta bosh; Kc: 0–2; ET₀: 0–15; reshjet: 0–500 ose bosh.',
      saved: 'U ruajtën ndryshimet: {p} kultura, {k} muaj të klimës.',
      errLoad: 'Parametrat nuk u ngarkuan. Kontrolloni që serveri i IDMIS është i ndezur dhe rifreskoni faqen.',
      errPerm: 'Parametrat e zonave i ndryshon vetëm administratori.',
      errSave: 'Ndryshimet nuk u ruajtën. Provoni përsëri.',
      leave: 'Keni ndryshime të paruajtura.',
      formula: 'ETc = ET₀ × Kc dhe nevoja neto = max(0, ETc − Pe), ditë për ditë (Pe e ditës = reshjet efektive të muajit / ditët e muajit); cikli nis në ditën 1 të muajit të mbjelljes. 1 mm = 10 m³/ha.'
    },
    en: {
      edit: 'Edit', cancel: 'Cancel', save: 'Save', exportCsv: 'Export CSV',
      viewCal: 'Stage calendar', viewEtc: 'ETc (mm)', viewNeto: 'Irrigation need (mm)', views: 'View', zone: 'Zone', bashkia: 'Municipality',
      noneChosen: '{b} has not chosen any crops yet. Choose them in {link}.',
      chooseLink: 'Data update → Municipality crops',
      noneInZone: 'The crops chosen by {b} have no parameters for this zone yet.',
      missing: 'Chosen by the municipality, but without parameters for this zone ({n}):',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      mShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      colNr: 'No.', colKultura: 'Crop', colTco: 'TCo (days)', colFazat: 'Stages (days)',
      colKc: 'Kc', colMuaji: 'Planting month', colOrient: 'Indicative planting',
      colCal: 'Stage calendar (September → August)', colEtcM: 'ETc by month (mm)', colEtcTot: 'ETc total (mm)',
      colNetoM: 'Net irrigation need by month (mm)', colNetoTot: 'Net total (mm)',
      etoRow: 'ET₀ (mm/day)', etoYear: '{n} mm/year',
      peRow: 'Effective rainfall (mm/month)', peYear: '{n} mm/year', peNone: 'no data',
      stage1: 'Initial stage', stage2: 'Development', stage3: 'Mid-season', stage4: 'Late season',
      lvTitle: 'Level (mm per month):', lv0: 'Covered by rain', lv1: 'Low < {a}', lv2: 'Medium {a}–{b}', lv3: 'High {a}–{b}', lv4: 'Peak ≥ {a}',
      cellTip: 'ETc {e} mm − covered by rain {r} mm = net need {n} mm',
      noRain: 'Effective rainfall is missing for {n} months: there the net need = ETc. An administrator fills it in on the "Effective rainfall" row (Edit).',
      title: '{z}: crop stages and Kc', count: '{n} chosen crops · {c} with a calendar',
      noProfile: 'No profile: days and Kc missing', noMonth: 'No planting month',
      pickMonth: 'Click the planting month',
      noRows: 'The crop table of this zone has not been entered yet. Its ET₀ is ready.',
      readOnly: 'Only an administrator can change the zone parameters.',
      editHint: 'Change the days, Kc or planting month; click a month in the calendar to move the planting there. The calendar, ETc and net need update at once. ET₀ and effective rainfall are edited on the first two rows.',
      reason: 'Reason for the change', reasonPh: 'e.g. Correction after the agronomic check of the zone',
      reasonNeed: 'Write the reason for the change before saving.',
      invalid: 'Some rows have invalid values (red). Stages: 1–365 days, total ≤ 366, or all four empty; Kc: 0–2; ET₀: 0–15; rainfall: 0–500 or empty.',
      saved: 'Changes saved: {p} crops, {k} climate months.',
      errLoad: 'The parameters could not be loaded. Check that the IDMIS server is running and reload the page.',
      errPerm: 'Only an administrator can change the zone parameters.',
      errSave: 'The changes were not saved. Try again.',
      leave: 'You have unsaved changes.',
      formula: 'ETc = ET₀ × Kc and net need = max(0, ETc − Pe), day by day (daily Pe = the month\'s effective rainfall / days in the month); the cycle starts on day 1 of the planting month. 1 mm = 10 m³/ha.'
    }
  };

  var lang = 'sq';
  try { if (localStorage.getItem('idms-lang') === 'en') lang = 'en'; } catch (e) {}
  var t = function (k, vars) {
    var s = (T[lang] || T.sq)[k] || T.sq[k] || '';
    Object.keys(vars || {}).forEach(function (v) { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var fmt = function (n, d) {
    return n.toLocaleString(lang === 'en' ? 'en-GB' : 'de-DE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  };
  var toast = function (type, text) { if (window.idmsToast) window.idmsToast(type, text); };
  var loading = function (on) { if (window.idmsLoading) window.idmsLoading(root, on); };
  var toLogin = function () { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname)); };

  var DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var COLS = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
  var NIVELET = [30, 80, 150];
  var round1 = function (x) { return Math.round(x * 10 + 1e-9) / 10; };

  var cycleDays = function (l, kcs, muaji) {
    var l1 = l[0], l2 = l[1], l3 = l[2], l4 = l[3];
    var doy = 0;
    for (var m0 = 0; m0 < muaji - 1; m0++) doy += DIM[m0];
    var out = [];
    for (var d = 0; d < l1 + l2 + l3 + l4; d++, doy = (doy + 1) % 365) {
      var m = 0, x = doy;
      while (x >= DIM[m]) { x -= DIM[m]; m++; }
      var faza = d < l1 ? 1 : d < l1 + l2 ? 2 : d < l1 + l2 + l3 ? 3 : 4;
      var kc = !kcs ? null
        : faza === 1 ? kcs[0]
          : faza === 2 ? kcs[0] + (kcs[1] - kcs[0]) * (d + 1 - l1) / l2
            : faza === 3 ? kcs[1]
              : kcs[1] + (kcs[2] - kcs[1]) * (d + 1 - l1 - l2 - l3) / l4;
      out.push({ m: m, faza: faza, kc: kc });
    }
    return out;
  };
  var stagesByMonth = function (v) {
    var out = [null, null, null, null, null, null, null, null, null, null, null, null];
    if (!v.l || !v.muaji) return out;
    cycleDays(v.l, null, v.muaji).forEach(function (d) {
      var q = out[d.m] || (out[d.m] = []);
      if (q[q.length - 1] !== d.faza) q.push(d.faza);
    });
    return out;
  };
  var calendar = function (byMonth, v) {
    var cells = COLS.map(function (m) { return byMonth[m - 1] ? { fazat: byMonth[m - 1] } : null; });
    if (!v.muaji) return cells;
    var prev = 0;
    for (var i = 0, col = COLS.indexOf(v.muaji); i < 12; i++, col = (col + 1) % 12) {
      var c = cells[col];
      if (!c) continue;
      c.fillim = c.fazat[0] !== prev;
      if (v.l) c.ditet = c.fazat.filter(function (f, k) { return k > 0 || c.fillim; }).map(function (f) { return v.l[f - 1]; });
      prev = c.fazat[c.fazat.length - 1];
    }
    return cells;
  };
  var nevojaMujore = function (v, eto, pe) {
    if (!v.l || !v.muaji || v.kc.some(function (k) { return k == null; })) return null;
    var etc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var neto = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cycleDays(v.l, v.kc, v.muaji).forEach(function (d) {
      var e = d.kc * eto[d.m];
      etc[d.m] += e;
      neto[d.m] += Math.max(0, e - (pe[d.m] || 0) / DIM[d.m]);
    });
    return { etc: etc.map(round1), neto: neto.map(round1) };
  };
  var level = function (x) {
    if (x <= 0) return 0;
    for (var i = 0; i < NIVELET.length; i++) if (x < NIVELET[i]) return i + 1;
    return NIVELET.length + 1;
  };

  var saveBtn = document.getElementById('pkSave');
  var saveN = document.getElementById('pkSaveN');
  var editBtn = document.getElementById('pkEdit');
  var cancelBtn = document.getElementById('pkCancel');
  var exportBtn = document.getElementById('pkExport');
  var viewCal = document.getElementById('pkViewCal');
  var viewEtc = document.getElementById('pkViewEtc');
  var viewNeto = document.getElementById('pkViewNeto');
  var zSel = document.getElementById('pkZ');
  var bSel = document.getElementById('pkB');
  var B_STORE = 'idms-pk-bashkia';

  var data = null;
  var edits = { p: {}, k: {}, r: {} };
  var bad = {};
  var editing = false;
  var saving = false;
  var view = 'cal';
  var reasonText = '';
  try { var sv = localStorage.getItem('idms-pk-view'); if (sv === 'etc' || sv === 'neto') view = sv; } catch (e) {}

  var valOf = function (p) { return edits.p[p.id] || { l: p.l, kc: p.kc, muaji: p.muaji }; };
  var needOf = function (p) {
    if (editing) return nevojaMujore(valOf(p), etoArr(), peArr());
    return p.etc ? { etc: p.etc, neto: p.neto } : null;
  };
  var calOf = function (p) {
    var v = valOf(p);
    return calendar(editing ? stagesByMonth(v) : p.kalendari, v);
  };
  var hasCal = function (p) { return calOf(p).some(Boolean); };
  var etoArr = function () {
    return data.klima.map(function (k) { return edits.k[k.muaji] != null ? edits.k[k.muaji] : k.eto; });
  };
  var peArr = function () {
    return data.klima.map(function (k) { return k.muaji in edits.r ? edits.r[k.muaji] : k.reshjet; });
  };
  var nChanges = function () { return Object.keys(edits.p).length + Object.keys(edits.k).length + Object.keys(edits.r).length; };
  var same = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
  var zone = function () { return data.zonat.filter(function (z) { return z.id === data.zona_id; })[0]; };
  var bashkia = function () { return data.bashkite.filter(function (b) { return b.id === data.bashkia_id; })[0]; };

  root.innerHTML =
    '<p class="zn-note" id="pkNote" hidden></p>' +
    '<div class="pk-reason" id="pkReason" hidden><label for="pkReasonIn" id="pkReasonLbl"></label>' +
      '<input type="text" id="pkReasonIn" maxlength="500" autocomplete="off"></div>' +
    '<section class="sk-sheet pk-sheet">' +
      '<div class="sk-xl-head"><h3 class="sk-xl-title" id="pkTitle"></h3><span class="ast-count" id="pkCount"></span></div>' +
      '<div class="pk-legend" id="pkLegend"></div>' +
      '<p class="pk-warn" id="pkWarn" hidden></p>' +
      '<div class="sk-scroll"><table class="sk-xl pk-xl" id="pkTable"><thead id="pkHead"></thead><tbody id="pkBody"></tbody></table></div>' +
      '<p class="pk-formula" id="pkFormula"></p>' +
      '<p class="zn-note" id="pkMissing" hidden></p>' +
    '</section>';

  var noteEl = document.getElementById('pkNote');
  var reasonBox = document.getElementById('pkReason');
  var reasonIn = document.getElementById('pkReasonIn');
  var headEl = document.getElementById('pkHead');
  var bodyEl = document.getElementById('pkBody');

  var renderTexts = function () {
    document.getElementById('pkEditLbl').textContent = t('edit');
    document.getElementById('pkCancelLbl').textContent = t('cancel');
    document.getElementById('pkSaveLbl').textContent = t('save');
    document.getElementById('pkExportLbl').textContent = t('exportCsv');
    document.getElementById('pkViewLbl').textContent = t('views');
    document.getElementById('pkZoneLbl').textContent = t('zone');
    document.getElementById('pkBashkiaLbl').textContent = t('bashkia');
    bSel.title = t('bashkia'); bSel.setAttribute('aria-label', t('bashkia'));
    document.getElementById('pkReasonLbl').textContent = t('reason');
    document.getElementById('pkFormula').textContent = t('formula');
    reasonIn.placeholder = t('reasonPh');
    zSel.title = t('zone'); zSel.setAttribute('aria-label', t('zone'));
    viewCal.textContent = t('viewCal');
    viewEtc.textContent = t('viewEtc');
    viewNeto.textContent = t('viewNeto');
    viewCal.setAttribute('aria-pressed', view === 'cal' ? 'true' : 'false');
    viewEtc.setAttribute('aria-pressed', view === 'etc' ? 'true' : 'false');
    viewNeto.setAttribute('aria-pressed', view === 'neto' ? 'true' : 'false');
    var key = function (cls, text) { return '<span class="pk-key"><span class="pk-sw ' + cls + '"></span>' + esc(text) + '</span>'; };
    var n = NIVELET.map(function (x) { return fmt(x); });
    document.getElementById('pkLegend').innerHTML = view === 'cal'
      ? [1, 2, 3, 4].map(function (k) { return key('pk-f' + k, 'L' + k + ' · ' + t('stage' + k)); }).join('')
      : '<span class="pk-lv-title">' + esc(t('lvTitle')) + '</span>' +
        (view === 'neto' ? key('pk-l0', t('lv0')) : '') +
        key('pk-l1', t('lv1', { a: n[0] })) + key('pk-l2', t('lv2', { a: n[0], b: n[1] })) +
        key('pk-l3', t('lv3', { a: n[1], b: n[2] })) + key('pk-l4', t('lv4', { a: n[2] }));
  };

  var renderWarn = function () {
    var warn = document.getElementById('pkWarn');
    var missing = data ? peArr().filter(function (x) { return x == null; }).length : 0;
    warn.hidden = view !== 'neto' || !missing;
    warn.textContent = warn.hidden ? '' : t('noRain', { n: fmt(missing) });
  };

  var renderBar = function () {
    var can = data && data.mundTeNdryshoje;
    editBtn.hidden = !can;
    editBtn.setAttribute('aria-pressed', editing ? 'true' : 'false');
    cancelBtn.hidden = !editing;
    var n = nChanges();
    saveBtn.hidden = !editing || !n;
    saveBtn.disabled = saving;
    saveN.textContent = n || '';
    noteEl.textContent = !data ? '' : !can ? t('readOnly') : editing ? t('editHint') : '';
    noteEl.hidden = !noteEl.textContent;
    reasonBox.hidden = !editing;
    zSel.disabled = editing;
    bSel.disabled = editing || !data || data.kufizim;
  };

  var renderZones = function () {
    zSel.innerHTML = data.zonat.map(function (z) {
      return '<option value="' + esc(z.kodi) + '"' + (z.id === data.zona_id ? ' selected' : '') + '>' + esc(z.kodi + ' · ' + z.emri) + '</option>';
    }).join('');
  };

  var renderBashkite = function () {
    bSel.innerHTML = data.bashkite.map(function (b) {
      return '<option value="' + b.id + '"' + (b.id === data.bashkia_id ? ' selected' : '') + '>' + esc(b.emri) + '</option>';
    }).join('');
  };

  var head = function () {
    var ms = COLS.map(function (m) { return '<th scope="col" class="pk-m">' + esc(t('mShort')[m - 1]) + '</th>'; }).join('');
    return '<tr><th rowspan="2" scope="col">' + esc(t('colNr')) + '</th>' +
      '<th rowspan="2" scope="col">' + esc(t('colKultura')) + '</th>' + (editing ? '<th rowspan="2" scope="col">' + esc(t('colTco')) + '</th>' : '') +
      (editing ? '<th colspan="4" scope="colgroup">' + esc(t('colFazat')) + '</th><th colspan="3" scope="colgroup">' + esc(t('colKc')) + '</th>' : '') +
      '<th rowspan="2" scope="col">' + esc(t('colMuaji')) + '</th><th rowspan="2" scope="col" class="pk-orient-h">' + esc(t('colOrient')) + '</th>' +
      '<th colspan="12" scope="colgroup">' + esc(t(view === 'cal' ? 'colCal' : view === 'etc' ? 'colEtcM' : 'colNetoM')) + '</th>' +
      '<th rowspan="2" scope="col">' + esc(t(view === 'neto' ? 'colNetoTot' : 'colEtcTot')) + '</th></tr>' +
      '<tr>' + (editing ? '<th scope="col">L1</th><th scope="col">L2</th><th scope="col">L3</th><th scope="col">L4</th>' +
      '<th scope="col">ini</th><th scope="col">mid</th><th scope="col">end</th>' : '') + ms + '</tr>';
  };

  var etoRowHtml = function () {
    var eto = etoArr();
    var year = eto.reduce(function (a, v, i) { return a + v * DIM[i]; }, 0);
    return '<tr class="pk-eto"><th colspan="' + (editing ? 12 : 4) + '" scope="row">' + esc(t('etoRow')) + ' · ' + esc(zone().emri) + '</th>' +
      COLS.map(function (m) {
        var v = eto[m - 1];
        var edited = edits.k[m] != null ? ' is-edited' : '';
        var invalid = bad['k' + m] ? ' is-invalid' : '';
        return editing
          ? '<td class="c pk-etoc' + edited + invalid + '"><input class="pk-in pk-in-eto" type="number" min="0" max="15" step="0.1" data-eto="' + m + '" value="' + v + '" aria-label="' + esc(t('etoRow') + ' ' + t('months')[m - 1]) + '"></td>'
          : '<td class="c pk-etoc">' + fmt(v, 1) + '</td>';
      }).join('') +
      '<td class="c pk-eto-year">' + esc(t('etoYear', { n: fmt(Math.round(year)) })) + '</td></tr>';
  };

  var peYearText = function () {
    var pe = peArr();
    if (pe.every(function (x) { return x == null; })) return t('peNone');
    return t('peYear', { n: fmt(Math.round(pe.reduce(function (a, x) { return a + (x || 0); }, 0))) });
  };
  var peRowHtml = function () {
    var pe = peArr();
    return '<tr class="pk-eto pk-pe"><th colspan="' + (editing ? 12 : 4) + '" scope="row">' + esc(t('peRow')) + '</th>' +
      COLS.map(function (m) {
        var v = pe[m - 1];
        var edited = m in edits.r ? ' is-edited' : '';
        var invalid = bad['r' + m] ? ' is-invalid' : '';
        return editing
          ? '<td class="c pk-etoc' + edited + invalid + '"><input class="pk-in pk-in-eto" type="number" min="0" max="500" step="0.1" data-pe="' + m + '" value="' + (v == null ? '' : v) + '" aria-label="' + esc(t('peRow') + ' ' + t('months')[m - 1]) + '"></td>'
          : '<td class="c pk-etoc' + (v == null ? ' pk-pe-none' : '') + '">' + (v == null ? '—' : fmt(v, 1)) + '</td>';
      }).join('') +
      '<td class="c pk-eto-year pk-pe-year">' + esc(peYearText()) + '</td></tr>';
  };

  var computedCells = function (p) {
    var v = valOf(p);
    var tco = v.l ? v.l[0] + v.l[1] + v.l[2] + v.l[3] : null;
    var need = needOf(p);
    var shown = need ? (view === 'neto' ? need.neto : need.etc) : null;
    var total = shown ? round1(shown.reduce(function (a, b) { return a + b; }, 0)) : null;
    var months = '';
    if (view === 'cal') {
      var cal = calOf(p);
      var has = cal.some(Boolean);
      if (!has && !editing) {
        var why = (editing ? !v.l : p.mungon === 'profili') ? t('noProfile') : t('noMonth');
        months = '<td colspan="12" class="pk-nocal">' + esc(p.mbjellja ? p.mbjellja : why) + (p.mbjellja ? ' <span class="pk-why">(' + esc(why) + ')</span>' : '') + '</td>';
      } else {
        months = cal.map(function (c, i) {
          var mix = c && c.fazat.length > 1;
          var cls = 'pk-c' + (c ? (mix ? ' pk-fmix' : ' pk-f' + c.fazat[0]) + (c.fillim ? ' is-start' : ' is-cont') : '') + (editing ? ' is-pick' : '');
          var style = mix ? ' style="background:linear-gradient(90deg,' + c.fazat.map(function (f, k) {
            var a = (100 * k / c.fazat.length).toFixed(1), b = (100 * (k + 1) / c.fazat.length).toFixed(1);
            return 'var(--pk-f' + f + ') ' + a + '% ' + b + '%';
          }).join(',') + ')"' : '';
          var tip = ' title="' + esc([editing ? t('months')[COLS[i] - 1] : '', c ? c.fazat.map(function (f) { return 'L' + f + ' ' + t('stage' + f); }).join(' → ') : '']
            .filter(Boolean).join(': ')) + '"';
          var days = editing && c && c.ditet && c.ditet.length ? c.ditet.join('·') : '';
          return '<td class="' + cls + '" data-col="' + i + '"' + style + (c || editing ? tip : '') + '>' + days + '</td>';
        }).join('');
      }
    } else {
      months = COLS.map(function (m) {
        var e = need ? need.etc[m - 1] : 0;
        if (!e) return '<td class="c pk-e"></td>';
        var x = shown[m - 1];
        var tip = view === 'neto'
          ? ' title="' + esc(t('cellTip', { e: fmt(e, 1), r: fmt(Math.max(0, round1(e - x)), 1), n: fmt(x, 1) })) + '"'
          : '';
        return '<td class="c pk-e pk-l' + level(x) + '"' + tip + '>' + fmt(x, 1) + '</td>';
      }).join('');
    }
    return {
      tco: tco == null ? '' : String(tco),
      months: months,
      total: total == null ? '' : fmt(total, 1)
    };
  };

  var rowHtml = function (p, i) {
    var v = valOf(p);
    var c = computedCells(p);
    var cls = (edits.p[p.id] ? ' is-edited' : '') + (bad[p.id] ? ' is-invalid' : '');
    var num = function (val, k, attrs) {
      return editing
        ? '<td class="c pk-ed"><input class="pk-in" type="number" ' + attrs + ' data-f="' + k + '" value="' + (val == null ? '' : val) + '" aria-label="' + esc(p.emri + ' ' + k) + '"></td>'
        : '<td class="c">' + (val == null ? '' : (k.indexOf('kc') === 0 ? fmt(val, 2) : val)) + '</td>';
    };
    var muaji = editing
      ? '<td class="c pk-ed"><select class="pk-in pk-in-m" data-f="muaji" aria-label="' + esc(p.emri + ' ' + t('colMuaji')) + '"><option value="">—</option>' +
        t('months').map(function (name, m) { return '<option value="' + (m + 1) + '"' + (v.muaji === m + 1 ? ' selected' : '') + '>' + esc(name) + '</option>'; }).join('') + '</select></td>'
      : '<td class="c">' + (v.muaji ? esc(t('months')[v.muaji - 1]) : '') + '</td>';
    return '<tr data-id="' + p.id + '" class="pk-row' + cls + '"><td class="c">' + (i + 1) + '</td>' +
      '<th scope="row" class="kb-crop">' + esc(p.emri) + (p.shenim ? ' <span class="pk-note" title="' + esc(p.shenim) + '">*</span>' : '') + '</th>' +
      (editing ? '<td class="c pk-tco">' + c.tco + '</td>' : '') +
      (editing ? [0, 1, 2, 3].map(function (k) { return num(v.l ? v.l[k] : null, 'l' + (k + 1), 'min="1" max="365" step="1"'); }).join('') +
        ['kc_ini', 'kc_mid', 'kc_end'].map(function (f, k) { return num(v.kc[k], f, 'min="0" max="2" step="0.05"'); }).join('') : '') +
      muaji +
      '<td class="pk-orient">' + esc(p.mbjellja || '') + '</td>' +
      c.months + '<td class="c pk-total">' + c.total + '</td></tr>';
  };

  var renderTable = function () {
    var z = zone();
    var withCal = data.profilet.filter(hasCal).length;
    var b = bashkia();
    document.getElementById('pkTitle').textContent = t('title', { z: b.emri + ' · ' + z.kodi + ' · ' + z.emri });
    document.getElementById('pkCount').textContent = t('count', { n: fmt(data.profilet.length), c: fmt(withCal) });
    document.getElementById('pkTable').classList.toggle('is-editing', editing);
    headEl.innerHTML = head();
    bodyEl.innerHTML = etoRowHtml() + peRowHtml() + (data.profilet.length
      ? data.profilet.map(rowHtml).join('')
      : '<tr><td colspan="' + (editing ? 25 : 17) + '" class="tbl-empty">' + emptyText() + '</td></tr>');
    var miss = document.getElementById('pkMissing');
    miss.hidden = !data.zgjedhur || !data.pa_profil.length;
    miss.innerHTML = miss.hidden ? '' : esc(t('missing', { n: fmt(data.pa_profil.length) })) + ' ' +
      data.pa_profil.map(function (k) { return '<strong>' + esc(k.emri) + '</strong>'; }).join(', ');
  };
  var emptyText = function () {
    var b = esc(bashkia().emri);
    if (data.zgjedhur) return esc(t('noneInZone')).replace('{b}', b);
    var link = '<a href="../perditesimi-i-te-dhenave/kulturat-e-bashkise.html">' + esc(t('chooseLink')) + '</a>';
    return esc(t('noneChosen')).replace('{b}', b).replace('{link}', link);
  };


  var refreshRow = function (p) {
    var tr = bodyEl.querySelector('tr[data-id="' + p.id + '"]');
    if (!tr) return;
    var c = computedCells(p);
    if (tr.querySelector('.pk-tco')) tr.querySelector('.pk-tco').textContent = c.tco;
    tr.querySelector('.pk-total').textContent = c.total;
    var first = tr.querySelector('.pk-c, .pk-e, .pk-nocal');
    var cells = tr.querySelectorAll('.pk-c, .pk-e, .pk-nocal');
    var tmp = document.createElement('tbody');
    tmp.innerHTML = '<tr>' + c.months + '</tr>';
    Array.prototype.slice.call(tmp.firstChild.children).forEach(function (td) { tr.insertBefore(td, first); });
    Array.prototype.forEach.call(cells, function (td) { td.remove(); });
    tr.classList.toggle('is-edited', !!edits.p[p.id]);
    tr.classList.toggle('is-invalid', !!bad[p.id]);
    var withCal = data.profilet.filter(hasCal).length;
    document.getElementById('pkCount').textContent = t('count', { n: fmt(data.profilet.length), c: fmt(withCal) });
  };

  var renderAll = function () {
    renderTexts();
    renderBar();
    if (!data) return;
    renderZones();
    renderBashkite();
    renderTable();
    renderWarn();
  };

  var profileById = function (id) { return data.profilet.filter(function (p) { return p.id === id; })[0]; };

  var readRow = function (tr) {
    var p = profileById(+tr.getAttribute('data-id'));
    var get = function (f) { var el = tr.querySelector('[data-f="' + f + '"]'); return el ? el.value.trim() : ''; };
    var ls = ['l1', 'l2', 'l3', 'l4'].map(get);
    var kcs = ['kc_ini', 'kc_mid', 'kc_end'].map(get);
    var ok = true;
    var l = null;
    if (ls.some(function (s) { return s !== ''; })) {
      l = ls.map(Number);
      if (!l.every(function (d) { return Number.isInteger(d) && d >= 1 && d <= 365; }) || l[0] + l[1] + l[2] + l[3] > 366) ok = false;
    }
    var kc = kcs.map(function (s) {
      if (s === '') return null;
      var n = Number(s);
      if (isNaN(n) || n < 0 || n > 2) ok = false;
      return Math.round(n * 100) / 100;
    });
    var m = get('muaji');
    var v = { l: ok ? l : null, kc: kc, muaji: m ? +m : null };
    if (!ok) { bad[p.id] = true; edits.p[p.id] = { l: p.l, kc: kc, muaji: v.muaji }; }
    else {
      delete bad[p.id];
      if (same(v, { l: p.l, kc: p.kc, muaji: p.muaji })) delete edits.p[p.id]; else edits.p[p.id] = v;
    }
    return p;
  };

  bodyEl.addEventListener('input', function (e) {
    var el = e.target;
    if (!editing) return;
    if (el.hasAttribute('data-eto')) {
      var m = +el.getAttribute('data-eto');
      var n = Number(el.value);
      var orig = data.klima[m - 1].eto;
      if (el.value.trim() === '' || isNaN(n) || n < 0 || n > 15) { bad['k' + m] = true; delete edits.k[m]; }
      else { delete bad['k' + m]; n = Math.round(n * 10) / 10; if (n === orig) delete edits.k[m]; else edits.k[m] = n; }
      el.closest('td').classList.toggle('is-edited', edits.k[m] != null);
      el.closest('td').classList.toggle('is-invalid', !!bad['k' + m]);
      data.profilet.forEach(refreshRow);
      var eto = etoArr();
      bodyEl.querySelector('.pk-eto-year').textContent = t('etoYear', { n: fmt(Math.round(eto.reduce(function (a, v, i) { return a + v * DIM[i]; }, 0))) });
    } else if (el.hasAttribute('data-pe')) {
      var mr = +el.getAttribute('data-pe');
      var s = el.value.trim();
      var r = Number(s);
      var origR = data.klima[mr - 1].reshjet;
      if (s !== '' && (isNaN(r) || r < 0 || r > 500)) { bad['r' + mr] = true; delete edits.r[mr]; }
      else {
        delete bad['r' + mr];
        r = s === '' ? null : Math.round(r * 10) / 10;
        if (r === origR) delete edits.r[mr]; else edits.r[mr] = r;
      }
      el.closest('td').classList.toggle('is-edited', mr in edits.r);
      el.closest('td').classList.toggle('is-invalid', !!bad['r' + mr]);
      data.profilet.forEach(refreshRow);
      bodyEl.querySelector('.pk-pe-year').textContent = peYearText();
      renderWarn();
    } else if (el.closest('tr.pk-row')) {
      refreshRow(readRow(el.closest('tr.pk-row')));
    } else return;
    renderBar();
  });
  bodyEl.addEventListener('change', function (e) {
    if (editing && e.target.matches('select[data-f="muaji"]')) { refreshRow(readRow(e.target.closest('tr.pk-row'))); renderBar(); }
  });

  bodyEl.addEventListener('click', function (e) {
    var td = e.target.closest('td.pk-c.is-pick');
    if (!td || !editing) return;
    var tr = td.closest('tr.pk-row');
    tr.querySelector('select[data-f="muaji"]').value = String(COLS[+td.getAttribute('data-col')]);
    refreshRow(readRow(tr));
    renderBar();
  });

  var setView = function (v) {
    view = v;
    try { localStorage.setItem('idms-pk-view', v); } catch (e) {}
    renderTexts();
    if (data) { renderTable(); renderWarn(); }
  };
  viewCal.addEventListener('click', function () { setView('cal'); });
  viewEtc.addEventListener('click', function () { setView('etc'); });
  viewNeto.addEventListener('click', function () { setView('neto'); });
  zSel.addEventListener('change', function () { loadAndRender(zSel.value, data.bashkia_id); });
  bSel.addEventListener('change', function () {
    try { localStorage.setItem(B_STORE, bSel.value); } catch (e) {}
    loadAndRender(null, +bSel.value);
  });
  reasonIn.addEventListener('input', function () { reasonText = reasonIn.value; });

  editBtn.addEventListener('click', function () {
    if (editing) return;
    editing = true;
    renderAll();
  });
  cancelBtn.addEventListener('click', function () {
    edits = { p: {}, k: {}, r: {} };
    bad = {};
    editing = false;
    reasonText = '';
    reasonIn.value = '';
    renderAll();
  });

  saveBtn.addEventListener('click', function () {
    if (!nChanges() || saving) return;
    if (Object.keys(bad).length) { toast('error', t('invalid')); return; }
    if (!reasonText.trim()) { toast('error', t('reasonNeed')); reasonIn.focus(); return; }
    saving = true;
    renderBar();
    fetch('/api/profilet', {
      method: 'PUT', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zona_id: data.zona_id,
        arsyeja: reasonText.trim(),
        profilet: Object.keys(edits.p).map(function (id) { var v = edits.p[id]; return { id: +id, l: v.l, kc: v.kc, muaji: v.muaji }; }),
        klima: Object.keys(Object.assign({}, edits.k, edits.r)).map(function (m) {
          var x = { muaji: +m };
          if (m in edits.k) x.eto = edits.k[m];
          if (m in edits.r) x.reshjet = edits.r[m];
          return x;
        })
      })
    }).then(function (r) {
      if (r.status === 401) { toLogin(); return null; }
      if (r.status === 403) throw new Error('perm');
      if (!r.ok) throw new Error('save');
      return r.json();
    }).then(function (res) {
      if (!res) return;
      edits = { p: {}, k: {}, r: {} };
      bad = {};
      editing = false;
      reasonText = '';
      reasonIn.value = '';
      toast('ok', t('saved', { p: res.profile, k: res.klima }));
      return load(zone().kodi, data.bashkia_id);
    }).catch(function (err) {
      toast('error', err.message === 'perm' ? t('errPerm') : t('errSave'));
    }).then(function () {
      saving = false;
      renderAll();
    });
  });

  exportBtn.addEventListener('click', function () {
    if (!data) return;
    var q = function (v) { v = String(v == null ? '' : v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var eto = etoArr();
    var pe = peArr();
    var months = function (label) { return COLS.map(function (m) { return label + ' ' + t('months')[m - 1] + ' (mm)'; }); };
    var head = [t('colKultura'), t('colMuaji'), t('colOrient')]
      .concat(months('ETc')).concat([t('colEtcTot')]).concat(months('Neto')).concat([t('colNetoTot')]);
    var blank = new Array(13).fill('');
    var lines = [head.map(q).join(';')];
    lines.push([t('etoRow'), '', ''].concat(COLS.map(function (m) { return eto[m - 1]; })).concat(['']).concat(blank).map(q).join(';'));
    lines.push([t('peRow'), '', ''].concat(COLS.map(function (m) { return pe[m - 1]; })).concat(['']).concat(blank).map(q).join(';'));
    var series = function (arr) {
      if (!arr) return blank;
      return COLS.map(function (m) { return arr[m - 1]; }).concat([round1(arr.reduce(function (a, b) { return a + b; }, 0))]);
    };
    data.profilet.forEach(function (p) {
      var v = valOf(p);
      var need = needOf(p);
      lines.push([p.emri]
        .concat([v.muaji ? t('months')[v.muaji - 1] : '', p.mbjellja])
        .concat(series(need && need.etc)).concat(series(need && need.neto)).map(q).join(';'));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'koeficientet-' + zone().kodi.toLowerCase() + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });

  window.addEventListener('beforeunload', function (e) {
    if (nChanges()) { e.preventDefault(); e.returnValue = t('leave'); }
  });
  document.addEventListener('idms:langchange', function (e) {
    lang = e.detail === 'en' ? 'en' : 'sq';
    renderAll();
  });

  var load = function (zona, bashkiaId) {
    var q = [];
    if (zona) q.push('zona=' + encodeURIComponent(zona));
    if (bashkiaId) q.push('bashkia=' + encodeURIComponent(bashkiaId));
    return fetch('/api/profilet' + (q.length ? '?' + q.join('&') : ''), { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) { toLogin(); return null; }
      if (r.status === 404 && bashkiaId) { try { localStorage.removeItem(B_STORE); } catch (e) {} return load(zona); }
      if (!r.ok) throw new Error('load');
      return r.json();
    }).then(function (d) { if (d && d.zonat) data = d; });
  };
  var loadAndRender = function (zona, bashkiaId) {
    loading(true);
    return load(zona, bashkiaId).catch(function () { toast('error', t('errLoad')); }).then(function () {
      renderAll();
      loading(false);
    });
  };

  renderTexts();
  var ruajtur = null;
  try { ruajtur = +localStorage.getItem(B_STORE) || null; } catch (e) {}
  loadAndRender(null, ruajtur);
})();
