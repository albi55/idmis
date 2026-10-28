(function () {
  'use strict';

  var root = document.getElementById('znRoot');
  if (!root) return;

  var T = {
    sq: {
      edit: 'Ndrysho zonat', cancel: 'Anulo', save: 'Ruaj', exportCsv: 'Eksporto CSV',
      allUnits: 'Të gjitha njësitë administrative', allQark: 'Të gjitha qarqet', allBashki: 'Të gjitha bashkitë',
      count: '{n} nga {t} njësi',
      colNjesia: 'Njësia administrative', colBashkia: 'Bashkia', colQarku: 'Qarku', colKodi: 'Kodi', colZona: 'Zona',
      colNr: 'Nr.', colZonaAgro: 'Zona agroklimatike', colEmertimi: 'Emërtimi',
      title: 'Njësitë administrative sipas zonës agroklimatike', total: 'Totali', units: '{n} njësi',
      readOnly: 'Zonat mund t’i ndryshojë vetëm administratori.',
      editHint: 'Zgjidhni zonën e re te njësitë që doni të ndryshoni, pastaj shtypni «Ruaj». Çdo ndryshim regjistrohet me emrin tuaj.',
      saved: 'U ruajtën {n} ndryshime.', savedOne: 'U ruajt 1 ndryshim.',
      noRows: 'Asnjë njësi nuk përputhet me filtrat.',
      errLoad: 'Zonat nuk u ngarkuan. Kontrolloni që serveri i IDMIS është i ndezur dhe rifreskoni faqen.',
      errPerm: 'Nuk keni leje të ndryshoni zonat e këtyre njësive. Operatori ndryshon vetëm njësitë e bashkisë së vet.',
      errSave: 'Ndryshimet nuk u ruajtën. Provoni përsëri.',
      leave: 'Keni ndryshime të paruajtura.'
    },
    en: {
      edit: 'Change zones', cancel: 'Cancel', save: 'Save', exportCsv: 'Export CSV',
      allUnits: 'All administrative units', allQark: 'All counties', allBashki: 'All municipalities',
      count: '{n} of {t} units',
      colNjesia: 'Administrative unit', colBashkia: 'Municipality', colQarku: 'County', colKodi: 'Code', colZona: 'Zone',
      colNr: 'No.', colZonaAgro: 'Agro-climatic zone', colEmertimi: 'Name',
      title: 'Administrative units by agro-climatic zone', total: 'Total', units: '{n} units',
      readOnly: 'Only an administrator can change zones.',
      editHint: 'Pick the new zone for the units you want to change, then press “Save”. Each change is recorded with your name.',
      saved: '{n} changes saved.', savedOne: '1 change saved.',
      noRows: 'No unit matches the filters.',
      errLoad: 'The zones could not be loaded. Check that the IDMIS server is running and reload the page.',
      errPerm: 'You are not allowed to change the zones of these units. An operator can change only the units of their own municipality.',
      errSave: 'The changes were not saved. Try again.',
      leave: 'You have unsaved changes.'
    }
  };
  var ZONE_EN = {
    Z1: 'Coastal zone and Western Lowlands', Z2: 'Central and hilly zone',
    Z3: 'Southern and south-western zone', Z4: 'North-eastern and mountain zone'
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
  var fmt = function (n) { return n.toLocaleString(lang === 'en' ? 'en-GB' : 'de-DE'); };

  var saveBtn = document.getElementById('znSave');
  var saveN = document.getElementById('znSaveN');
  var editBtn = document.getElementById('znEdit');
  var cancelBtn = document.getElementById('znCancel');
  var exportBtn = document.getElementById('znExport');

  var data = null;
  var zoneById = {};
  var changes = {};
  var editing = false;
  var saving = false;
  var filt = { q: '', b: '', n: '' };
  var toast = function (type, text) { if (window.idmsToast) window.idmsToast(type, text); };

  var zoneName = function (z) { return lang === 'en' && ZONE_EN[z.kodi] ? ZONE_EN[z.kodi] : z.emri; };
  var zoneOf = function (n) { return changes[n.id] != null ? changes[n.id] : n.zona_id; };
  var nChanges = function () { return Object.keys(changes).length; };

  root.innerHTML =
    '<p class="zn-note" id="znNote" hidden></p>' +
    '<section class="sk-sheet zn-sheet">' +
      '<div class="sk-xl-head"><h3 class="sk-xl-title" id="znTitle"></h3><span class="ast-count" id="znCount"></span></div>' +
      '<div class="sk-scroll"><table class="sk-xl zn-xl">' +
      '<colgroup><col style="width:5%"><col style="width:22%"><col style="width:15%"><col style="width:13%">' +
      '<col style="width:8%"><col style="width:7%"><col style="width:30%"></colgroup>' +
      '<thead><tr><th rowspan="2" scope="col" id="znH1"></th><th rowspan="2" scope="col" id="znH2"></th>' +
      '<th rowspan="2" scope="col" id="znH3"></th><th rowspan="2" scope="col" id="znH4"></th>' +
      '<th rowspan="2" scope="col" id="znH5"></th><th colspan="2" scope="colgroup" id="znH6"></th></tr>' +
      '<tr><th scope="col" id="znH7"></th><th scope="col" id="znH8"></th></tr></thead>' +
      '<tbody id="znBody"></tbody>' +
      '<tfoot><tr><td colspan="5" id="znTotLbl"></td><td colspan="2" id="znTot"></td></tr></tfoot>' +
      '</table></div></section>';

  var noteEl = document.getElementById('znNote');
  var qSel = document.getElementById('znQ');
  var bSel = document.getElementById('znB');
  var nSel = document.getElementById('znN');
  var countEl = document.getElementById('znCount');
  var bodyEl = document.getElementById('znBody');
  var titleEl = document.getElementById('znTitle');
  var totEl = document.getElementById('znTot');

  var visible = function () {
    return data.njesite.filter(function (n) {
      return (!filt.q || n.qarku === filt.q) && (!filt.b || n.bashkia === filt.b) &&
        (!filt.n || String(n.id) === filt.n);
    });
  };

  var renderTexts = function () {
    document.getElementById('znEditLbl').textContent = t('edit');
    document.getElementById('znCancelLbl').textContent = t('cancel');
    document.getElementById('znSaveLbl').textContent = t('save');
    document.getElementById('znExportLbl').textContent = t('exportCsv');
    [[qSel, 'colQarku'], [bSel, 'colBashkia'], [nSel, 'colNjesia']].forEach(function (x) {
      x[0].title = t(x[1]);
      x[0].setAttribute('aria-label', t(x[1]));
    });
    ['colNr', 'colNjesia', 'colBashkia', 'colQarku', 'colKodi', 'colZonaAgro', 'colKodi', 'colEmertimi'].forEach(function (k, i) {
      document.getElementById('znH' + (i + 1)).textContent = t(k);
    });
    document.getElementById('znTotLbl').textContent = t('total');
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
    noteEl.hidden = !data;
    noteEl.textContent = !can ? t('readOnly') : editing ? t('editHint') : '';
    noteEl.hidden = !noteEl.textContent;
  };


  var renderFilters = function () {
    var lock = data.kufizim;
    if (lock) { filt.q = lock.qarku; filt.b = lock.bashkia; }
    var uniq = function (a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); };
    var sortSq = function (a) { return a.sort(function (x, y) { return x.localeCompare(y, 'sq'); }); };
    var opt = function (v, label, sel) { return '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(label) + '</option>'; };
    var qs = sortSq(uniq(data.njesite.map(function (n) { return n.qarku; })));
    if (qs.indexOf(filt.q) < 0) filt.q = '';
    var bs = sortSq(uniq(data.njesite.filter(function (n) { return !filt.q || n.qarku === filt.q; }).map(function (n) { return n.bashkia; })));
    if (bs.indexOf(filt.b) < 0) filt.b = '';
    qSel.innerHTML = (lock ? '' : opt('', t('allQark'), !filt.q)) + qs.map(function (q) { return opt(q, q, q === filt.q); }).join('');
    bSel.innerHTML = (lock ? '' : opt('', t('allBashki'), !filt.b)) + bs.map(function (b) { return opt(b, b, b === filt.b); }).join('');
    qSel.disabled = !!lock;
    bSel.disabled = !!lock;
    var units = data.njesite.filter(function (n) { return (!filt.q || n.qarku === filt.q) && (!filt.b || n.bashkia === filt.b); })
      .slice().sort(function (x, y) { return x.emri.localeCompare(y.emri, 'sq') || x.bashkia.localeCompare(y.bashkia, 'sq'); });
    if (!units.some(function (n) { return String(n.id) === filt.n; })) filt.n = '';
    nSel.innerHTML = opt('', t('allUnits'), !filt.n) + units.map(function (n) {
      return opt(String(n.id), filt.b ? n.emri : n.emri + ' (' + n.bashkia + ')', String(n.id) === filt.n);
    }).join('');
  };

  var zoneCell = function (n) {
    var z = zoneById[zoneOf(n)];
    if (!editing) {
      return '<td class="c"><span class="zn-badge zn-' + esc(z.kodi.toLowerCase()) + '">' + esc(z.kodi) + '</span></td>' +
        '<td>' + esc(zoneName(z)) + '</td>';
    }
    return '<td colspan="2" class="zn-edit"><select class="zn-pick" data-id="' + n.id + '" aria-label="' + esc(t('colZona') + ': ' + n.emri + ', ' + n.bashkia) + '">' +
      data.zonat.map(function (o) {
        return '<option value="' + o.id + '"' + (o.id === z.id ? ' selected' : '') + '>' + esc(o.kodi + ' · ' + zoneName(o)) + '</option>';
      }).join('') + '</select></td>';
  };

  var renderRows = function () {
    var rows = visible();
    countEl.textContent = t('count', { n: fmt(rows.length), t: fmt(data.njesite.length) });
    titleEl.textContent = t('title') + (filt.b ? ' — ' + filt.b : filt.q ? ' — ' + filt.q : '');
    totEl.textContent = t('units', { n: fmt(rows.length) });
    if (!rows.length) {
      bodyEl.innerHTML = '<tr><td colspan="7" class="tbl-empty">' + esc(t('noRows')) + '</td></tr>';
      return;
    }
    bodyEl.innerHTML = rows.map(function (n, i) {
      return '<tr data-id="' + n.id + '"' + (changes[n.id] != null ? ' class="is-edited"' : '') + '>' +
        '<td class="c">' + (i + 1) + '</td>' +
        '<th scope="row" class="zn-unit">' + esc(n.emri) + '</th>' +
        '<td>' + esc(n.bashkia) + '</td>' +
        '<td>' + esc(n.qarku) + '</td>' +
        '<td class="c">' + n.kodi + '</td>' +
        zoneCell(n) + '</tr>';
    }).join('');
  };

  var renderAll = function () {
    renderTexts();
    renderBar();
    if (!data) return;
    renderFilters();
    renderRows();
  };

  qSel.addEventListener('change', function () { filt.q = qSel.value; filt.b = ''; filt.n = ''; renderFilters(); renderRows(); });
  bSel.addEventListener('change', function () { filt.b = bSel.value; filt.n = ''; renderFilters(); renderRows(); });
  nSel.addEventListener('change', function () { filt.n = nSel.value; renderRows(); });

  bodyEl.addEventListener('change', function (e) {
    var sel = e.target.closest('.zn-pick');
    if (!sel) return;
    var id = +sel.getAttribute('data-id');
    var n = data.njesite.filter(function (x) { return x.id === id; })[0];
    var v = +sel.value;
    if (v === n.zona_id) delete changes[id]; else changes[id] = v;
    sel.closest('tr').classList.toggle('is-edited', changes[id] != null);
    renderBar();
  });

  editBtn.addEventListener('click', function () {
    if (editing) return;
    editing = true;
    renderAll();
  });
  cancelBtn.addEventListener('click', function () {
    changes = {};
    editing = false;
    renderAll();
  });

  saveBtn.addEventListener('click', function () {
    var list = Object.keys(changes).map(function (id) { return { id: +id, zona_id: changes[id] }; });
    if (!list.length || saving) return;
    saving = true;
    renderBar();
    fetch('/api/zonat/njesite', {
      method: 'PUT', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ndryshimet: list })
    }).then(function (r) {
      if (r.status === 401) { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname)); return null; }
      if (r.status === 403) throw new Error('perm');
      if (!r.ok) throw new Error('save');
      return r.json();
    }).then(function (res) {
      if (!res) return;
      changes = {};
      editing = false;
      toast('ok', res.perditesuar === 1 ? t('savedOne') : t('saved', { n: res.perditesuar }));
      return load();
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
    var lines = [[t('colKodi'), t('colNjesia'), t('colBashkia'), t('colQarku'), t('colZona'), ''].map(q).join(';')];
    visible().forEach(function (n) {
      var z = zoneById[zoneOf(n)];
      lines.push([n.kodi, n.emri, n.bashkia, n.qarku, z.kodi, zoneName(z)].map(q).join(';'));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'zonat-agroklimatike.csv';
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

  var load = function () {
    return fetch('/api/zonat', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname)); return null; }
      if (!r.ok) throw new Error('load');
      return r.json();
    }).then(function (d) {
      if (!d) return;
      data = d;
      zoneById = {};
      d.zonat.forEach(function (z) { zoneById[z.id] = z; });
    });
  };

  renderTexts();
  if (window.idmsLoading) window.idmsLoading(root, true);
  load().catch(function () {
    toast('error', t('errLoad'));
  }).then(function () {
    renderAll();
    if (window.idmsLoading) window.idmsLoading(root, false);
  });
})();
