(function () {
  'use strict';

  var root = document.getElementById('kbRoot');
  if (!root) return;

  var T = {
    sq: {
      edit: 'Ndrysho kulturat', cancel: 'Anulo', save: 'Ruaj', exportCsv: 'Eksporto CSV',
      allQark: 'Të gjitha qarqet',
      colQarku: 'Qarku', colBashkia: 'Bashkia',
      colNr: 'Nr.', colKodi: 'Kodi', colKultura: 'Kultura', colBotanik: 'Emri botanik', colGrupi: 'Grupi',
      colTipi: 'Tipi', colShtuar: 'Shtuar nga', colData: 'Data', colZgjidh: 'Zgjidh',
      title: 'Kulturat e bashkisë', count: '{n} nga {t} kultura të katalogut',
      total: 'Totali', crops: '{n} kultura',
      groupSel: '{n} nga {t} të zgjedhura', selectGroup: 'Zgjidh të gjitha kulturat e grupit {g}',
      none: 'Kjo bashki nuk ka zgjedhur ende asnjë kulturë.', noneCan: 'Shtypni «Ndrysho kulturat» për t’i zgjedhur nga katalogu.',
      inactive: 'jo aktive në katalog',
      readOnly: 'Kulturat e bashkisë mund t’i ndryshojë administratori ose operatori i bashkisë.',
      editHint: 'Shënoni kulturat që kultivohen në bashki dhe hiqni shenjën te ato që nuk kultivohen, pastaj shtypni «Ruaj». Çdo ndryshim regjistrohet me emrin tuaj.',
      saved: 'U ruajtën ndryshimet: {a} kultura u shtuan, {h} u hoqën.',
      errLoad: 'Kulturat nuk u ngarkuan. Kontrolloni që serveri i IDMIS është i ndezur dhe rifreskoni faqen.',
      errPerm: 'Nuk keni leje të ndryshoni kulturat e kësaj bashkie. Operatori ndryshon vetëm bashkinë e vet.',
      errSave: 'Ndryshimet nuk u ruajtën. Provoni përsëri.',
      leave: 'Keni ndryshime të paruajtura.'
    },
    en: {
      edit: 'Change crops', cancel: 'Cancel', save: 'Save', exportCsv: 'Export CSV',
      allQark: 'All counties',
      colQarku: 'County', colBashkia: 'Municipality',
      colNr: 'No.', colKodi: 'Code', colKultura: 'Crop', colBotanik: 'Botanical name', colGrupi: 'Group',
      colTipi: 'Type', colShtuar: 'Added by', colData: 'Date', colZgjidh: 'Select',
      title: 'Crops of the municipality', count: '{n} of {t} catalogue crops',
      total: 'Total', crops: '{n} crops',
      groupSel: '{n} of {t} selected', selectGroup: 'Select every crop of the group {g}',
      none: 'This municipality has not chosen any crop yet.', noneCan: 'Press “Change crops” to choose them from the catalogue.',
      inactive: 'inactive in the catalogue',
      readOnly: 'The crops of a municipality can be changed by an administrator or the municipality operator.',
      editHint: 'Tick the crops grown in the municipality and untick those that are not, then press “Save”. Each change is recorded with your name.',
      saved: 'Changes saved: {a} crops added, {h} removed.',
      errLoad: 'The crops could not be loaded. Check that the IDMIS server is running and reload the page.',
      errPerm: 'You are not allowed to change the crops of this municipality. An operator can change only their own municipality.',
      errSave: 'The changes were not saved. Try again.',
      leave: 'You have unsaved changes.'
    }
  };
  var LLOJI_EN = {
    'Njëvjeçare': 'Annual', 'Shumëvjeçare': 'Perennial', 'Një/Shumëvjeçare': 'Annual/perennial',
    'E përhershme': 'Permanent', 'E ndryshueshme': 'Variable'
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
  var dateOf = function (iso) {
    var d = new Date(iso);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear();
  };
  var llojiOf = function (k) { return !k.lloji ? '' : lang === 'en' && LLOJI_EN[k.lloji] ? LLOJI_EN[k.lloji] : k.lloji; };
  var toast = function (type, text) { if (window.idmsToast) window.idmsToast(type, text); };
  var toLogin = function () { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname)); };

  var saveBtn = document.getElementById('kbSave');
  var saveN = document.getElementById('kbSaveN');
  var editBtn = document.getElementById('kbEdit');
  var cancelBtn = document.getElementById('kbCancel');
  var exportBtn = document.getElementById('kbExport');
  var qSel = document.getElementById('kbQ');
  var bSel = document.getElementById('kbB');

  var data = null;
  var chosen = {};
  var changes = {};
  var editing = false;
  var saving = false;
  var filtQ = '';

  var isOn = function (id) { return changes[id] != null ? changes[id] : !!chosen[id]; };
  var nChanges = function () { return Object.keys(changes).length; };
  var bashkia = function () { return data && data.bashkite.filter(function (b) { return b.id === data.bashkia_id; })[0]; };

  root.innerHTML =
    '<p class="zn-note" id="kbNote" hidden></p>' +
    '<section class="sk-sheet kb-sheet">' +
      '<div class="sk-xl-head"><h3 class="sk-xl-title" id="kbTitle"></h3><span class="ast-count" id="kbCount"></span></div>' +
      '<div class="sk-scroll"><table class="sk-xl kb-xl">' +
      '<thead id="kbHead"></thead><tbody id="kbBody"></tbody>' +
      '<tfoot><tr><td id="kbTotLbl"></td><td id="kbTot"></td></tr></tfoot>' +
      '</table></div></section>';

  var noteEl = document.getElementById('kbNote');
  var titleEl = document.getElementById('kbTitle');
  var countEl = document.getElementById('kbCount');
  var headEl = document.getElementById('kbHead');
  var bodyEl = document.getElementById('kbBody');
  var totLbl = document.getElementById('kbTotLbl');
  var totEl = document.getElementById('kbTot');

  var renderTexts = function () {
    document.getElementById('kbEditLbl').textContent = t('edit');
    document.getElementById('kbCancelLbl').textContent = t('cancel');
    document.getElementById('kbSaveLbl').textContent = t('save');
    document.getElementById('kbExportLbl').textContent = t('exportCsv');
    [[qSel, 'colQarku'], [bSel, 'colBashkia']].forEach(function (x) {
      x[0].title = t(x[1]);
      x[0].setAttribute('aria-label', t(x[1]));
    });
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
  };

  var renderFilters = function () {
    var opt = function (v, label, sel) { return '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(label) + '</option>'; };
    var cur = bashkia();
    var lock = !!data.kufizim;
    var qs = data.bashkite.map(function (b) { return b.qarku; }).filter(function (q, i, a) { return a.indexOf(q) === i; });
    if (lock || qs.indexOf(filtQ) < 0) filtQ = cur ? cur.qarku : '';
    qSel.innerHTML = (lock ? '' : opt('', t('allQark'), !filtQ)) + qs.map(function (q) { return opt(q, q, q === filtQ); }).join('');
    var bs = data.bashkite.filter(function (b) { return !filtQ || b.qarku === filtQ; });
    if (cur && !bs.some(function (b) { return b.id === cur.id; })) bs.unshift(cur);
    bSel.innerHTML = bs.map(function (b) { return opt(b.id, b.emri, b.id === data.bashkia_id); }).join('');
    qSel.disabled = lock || editing;
    bSel.disabled = lock || editing;
  };

  var cropsOf = function (g) {
    return data.kulturat.filter(function (k) {
      return k.grupi_id === g.id && (editing ? (k.statusi !== 'jo_aktiv' || chosen[k.id]) : isOn(k.id));
    });
  };

  var renderRows = function () {
    var cur = bashkia();
    var nOn = data.kulturat.filter(function (k) { return isOn(k.id); }).length;
    titleEl.textContent = t('title') + (cur ? ' — ' + cur.emri : '');
    countEl.textContent = t('count', { n: fmt(nOn), t: fmt(data.kulturat.length) });
    totLbl.textContent = t('total');
    totEl.textContent = t('crops', { n: fmt(nOn) });

    var cols = editing
      ? ['colZgjidh', 'colKodi', 'colKultura', 'colBotanik', 'colTipi']
      : ['colNr', 'colKodi', 'colKultura', 'colBotanik', 'colTipi', 'colShtuar', 'colData'];
    headEl.innerHTML = '<tr>' + cols.map(function (k) { return '<th scope="col">' + esc(t(k)) + '</th>'; }).join('') + '</tr>';
    totLbl.colSpan = cols.length - 1;

    if (!editing && !nOn) {
      bodyEl.innerHTML = '<tr><td colspan="' + cols.length + '" class="tbl-empty">' + esc(t('none')) +
        (data.mundTeNdryshoje ? ' ' + esc(t('noneCan')) : '') + '</td></tr>';
      return;
    }

    var nr = 0;
    bodyEl.innerHTML = data.grupet.map(function (g) {
      var list = cropsOf(g);
      if (!list.length) return '';
      var on = list.filter(function (k) { return isOn(k.id); }).length;
      var head = '<tr class="kb-grp"><th colspan="' + cols.length + '" scope="colgroup">' +
        (editing
          ? '<label class="kb-grp-lbl"><input type="checkbox" data-grp="' + g.id + '"' + (on === list.length ? ' checked' : '') +
            ' aria-label="' + esc(t('selectGroup', { g: g.emri })) + '"><span>' + esc(g.emri) + '</span></label>'
          : '<span>' + esc(g.emri) + '</span>') +
        '<span class="kb-grp-n">' + esc(editing ? t('groupSel', { n: on, t: list.length }) : t('crops', { n: list.length })) + '</span>' +
        '</th></tr>';
      return head + list.map(function (k) {
        var inactive = k.statusi === 'jo_aktiv' ? ' <span class="kb-inactive">(' + esc(t('inactive')) + ')</span>' : '';
        var cells = '<td>' + esc(k.kodi) + '</td>' +
          '<th scope="row" class="kb-crop">' + esc(k.emri) + inactive + '</th>' +
          '<td class="kb-sci">' + esc(k.emri_shkencor || '') + '</td>' +
          '<td>' + esc(llojiOf(k)) + '</td>';
        if (editing) {
          return '<tr data-id="' + k.id + '"' + (changes[k.id] != null ? ' class="is-edited"' : '') + '>' +
            '<td class="c kb-chk"><input type="checkbox" data-id="' + k.id + '"' + (isOn(k.id) ? ' checked' : '') +
            (k.statusi === 'jo_aktiv' && !isOn(k.id) ? ' disabled' : '') +
            ' aria-label="' + esc(k.emri) + '"></td>' + cells + '</tr>';
        }
        nr += 1;
        var c = chosen[k.id];
        return '<tr><td class="c">' + nr + '</td>' + cells +
          '<td>' + esc(c ? c.perdoruesi : '') + '</td><td class="c">' + esc(c ? dateOf(c.krijuar_me) : '') + '</td></tr>';
      }).join('');
    }).join('');

    if (editing) {
      bodyEl.querySelectorAll('input[data-grp]').forEach(function (box) {
        var g = data.grupet.filter(function (x) { return x.id === +box.getAttribute('data-grp'); })[0];
        var list = cropsOf(g);
        var on = list.filter(function (k) { return isOn(k.id); }).length;
        box.indeterminate = on > 0 && on < list.length;
      });
    }
  };

  var renderAll = function () {
    renderTexts();
    renderBar();
    if (!data) return;
    renderFilters();
    renderRows();
  };

  var setOn = function (id, on) {
    if (on === !!chosen[id]) delete changes[id]; else changes[id] = on;
  };

  bodyEl.addEventListener('change', function (e) {
    var box = e.target;
    if (box.matches('input[data-id]')) {
      setOn(+box.getAttribute('data-id'), box.checked);
    } else if (box.matches('input[data-grp]')) {
      var g = data.grupet.filter(function (x) { return x.id === +box.getAttribute('data-grp'); })[0];
      cropsOf(g).forEach(function (k) {
        if (box.checked && k.statusi === 'jo_aktiv' && !chosen[k.id]) return;
        setOn(k.id, box.checked);
      });
    } else return;
    var y = window.scrollY;
    renderRows();
    renderBar();
    window.scrollTo(0, y);
  });

  qSel.addEventListener('change', function () {
    filtQ = qSel.value;
    var first = data.bashkite.filter(function (b) { return !filtQ || b.qarku === filtQ; })[0];
    if (first && first.id !== data.bashkia_id) loadAndRender(first.id);
    else renderFilters();
  });
  bSel.addEventListener('change', function () { loadAndRender(+bSel.value); });

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
    var ids = Object.keys(changes).map(Number);
    if (!ids.length || saving) return;
    var shto = ids.filter(function (id) { return changes[id]; });
    var hiq = ids.filter(function (id) { return !changes[id]; });
    saving = true;
    renderBar();
    fetch('/api/kulturat/bashkia', {
      method: 'PUT', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bashkia_id: data.bashkia_id, shto: shto, hiq: hiq })
    }).then(function (r) {
      if (r.status === 401) { toLogin(); return null; }
      if (r.status === 403) throw new Error('perm');
      if (!r.ok) throw new Error('save');
      return r.json();
    }).then(function (res) {
      if (!res) return;
      changes = {};
      editing = false;
      toast('ok', t('saved', { a: res.shtuar, h: res.hequr }));
      return load(data.bashkia_id);
    }).catch(function (err) {
      toast('error', err.message === 'perm' ? t('errPerm') : t('errSave'));
    }).then(function () {
      saving = false;
      renderAll();
    });
  });

  exportBtn.addEventListener('click', function () {
    if (!data) return;
    var cur = bashkia();
    var q = function (v) { v = String(v == null ? '' : v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var groupName = {};
    data.grupet.forEach(function (g) { groupName[g.id] = g.emri; });
    var lines = [[t('colKodi'), t('colKultura'), t('colBotanik'), t('colGrupi'), t('colTipi'), t('colBashkia'), t('colQarku'), t('colShtuar'), t('colData')].map(q).join(';')];
    data.kulturat.filter(function (k) { return chosen[k.id]; }).forEach(function (k) {
      var c = chosen[k.id];
      lines.push([k.kodi, k.emri, k.emri_shkencor, groupName[k.grupi_id], llojiOf(k), cur.emri, cur.qarku, c.perdoruesi, dateOf(c.krijuar_me)].map(q).join(';'));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kulturat-' + cur.emri.toLowerCase().replace(/\s+/g, '-') + '.csv';
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

  var load = function (bashkiaId) {
    var url = '/api/kulturat/bashkia' + (bashkiaId ? '?bashkia=' + encodeURIComponent(bashkiaId) : '');
    return fetch(url, { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) { toLogin(); return null; }
      if (!r.ok) throw new Error('load');
      return r.json();
    }).then(function (d) {
      if (!d) return;
      data = d;
      chosen = {};
      d.zgjedhur.forEach(function (z) { chosen[z.kultura_id] = z; });
    });
  };
  var loading = function (on) { if (window.idmsLoading) window.idmsLoading(root, on); };
  var loadAndRender = function (bashkiaId) {
    loading(true);
    return load(bashkiaId).catch(function () { toast('error', t('errLoad')); }).then(function () {
      renderAll();
      loading(false);
    });
  };

  renderTexts();
  loadAndRender();
})();
