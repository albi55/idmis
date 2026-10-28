(function () {
  'use strict';

  var root = document.getElementById('opRoot');
  if (!root) return;

  var T = {
    sq: {
      add: 'Shto', edit: 'Përditëso', save: 'Ruaj', exportCsv: 'Eksporto CSV',
      allQark: 'Të gjitha qarqet', colQarku: 'Qarku', colBashkia: 'Bashkia',
      title: 'Mjeshtri i ujit', count: '{a} aktivë nga {n}', count1: '1 aktiv nga {n}',
      colNr: 'Nr.', colEmri: 'Emri i Operatorit', colKodi: 'Kodi i Operatorit', colStatusi: 'Statusi',
      colNga: 'Përditësuar nga', colData: 'Data',
      aktiv: 'Aktiv', joAktiv: 'Jo Aktiv', namePh: 'Emër Mbiemër',
      addRow: 'Shto rresht', remove: 'Hiq rreshtin',
      addHint: 'Shkruani emrat e operatorëve të rinj dhe shtypni «Ruaj» lart djathtas. Kodi jepet vetë.',
      editHint: 'Ndryshoni emrin ose statusin dhe shtypni «Ruaj» lart djathtas. Operatori nuk fshihet: kalon «Jo Aktiv».',
      total: 'Totali', ops: '{n} operatorë', op1: '1 operator',
      none: 'Kjo bashki nuk ka ende operatorë.', noneCan: 'Shtypni «Shto» për të shtuar të parin.',
      readOnly: 'Operatorët mund t’i ndryshojë administratori ose operatori i bashkisë.',
      added: 'U shtuan {n} operatorë.', added1: 'Operatori {e} u shtua me kodin {k}.', saved: 'Ndryshimet u ruajtën.',
      errRows: 'Kontrolloni rreshtat e shënuar me të kuqe: emri duhet të ketë të paktën 2 shkronja dhe të mos përsëritet.',
      errDup: 'Emri {e} ekziston tashmë te operatorët e bashkisë.',
      errLoad: 'Operatorët nuk u ngarkuan. Kontrolloni që serveri i IDMIS është i ndezur dhe rifreskoni faqen.',
      errPerm: 'Nuk keni leje të ndryshoni operatorët e kësaj bashkie. Operatori ndryshon vetëm bashkinë e vet.',
      errSave: 'Ndryshimet nuk u ruajtën. Provoni përsëri.',
      leave: 'Keni ndryshime të paruajtura.'
    },
    en: {
      add: 'Add', edit: 'Update', save: 'Save', exportCsv: 'Export CSV',
      allQark: 'All counties', colQarku: 'County', colBashkia: 'Municipality',
      title: 'Water master', count: '{a} active of {n}', count1: '1 active of {n}',
      colNr: 'No.', colEmri: 'Operator name', colKodi: 'Operator code', colStatusi: 'Status',
      colNga: 'Updated by', colData: 'Date',
      aktiv: 'Active', joAktiv: 'Inactive', namePh: 'First Last name',
      addRow: 'Add row', remove: 'Remove row',
      addHint: 'Type the names of the new operators and press “Save” at the top right. The code is given automatically.',
      editHint: 'Change the name or the status and press “Save” at the top right. Operators are not deleted: they become “Inactive”.',
      total: 'Total', ops: '{n} operators', op1: '1 operator',
      none: 'This municipality has no operators yet.', noneCan: 'Press “Add” to add the first one.',
      readOnly: 'Operators can be changed by an administrator or the municipality operator.',
      added: '{n} operators were added.', added1: 'Operator {e} was added with code {k}.', saved: 'Changes saved.',
      errRows: 'Check the rows marked in red: the name needs at least 2 letters and must not repeat.',
      errDup: 'The name {e} already exists among the municipality’s operators.',
      errLoad: 'The operators could not be loaded. Check that the IDMIS server is running and reload the page.',
      errPerm: 'You are not allowed to change the operators of this municipality. An operator can change only their own municipality.',
      errSave: 'The changes were not saved. Try again.',
      leave: 'You have unsaved changes.'
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
  var when = function (iso) {
    var d = new Date(iso);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  };
  var clean = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var toast = function (type, text) { if (window.idmsToast) window.idmsToast(type, text); };
  var toLogin = function () { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname)); };

  var addBtn = document.getElementById('opAddMode');
  var editBtn = document.getElementById('opEditMode');
  var saveBtn = document.getElementById('opSave');
  var exportBtn = document.getElementById('opExport');
  var qSel = document.getElementById('opQ');
  var bSel = document.getElementById('opB');

  var data = null;
  var mode = 'view';
  var fresh = [];
  var draft = {};
  var bad = {};
  var seq = 0;
  var busy = false;
  var filtQ = '';

  var bashkia = function () { return data && data.bashkite.filter(function (b) { return b.id === data.bashkia_id; })[0]; };
  var can = function () { return !!(data && data.mundTeNdryshoje); };
  var codeAt = function (i) {
    var b = bashkia();
    if (!b) return '';
    var n = data.operatoret.reduce(function (m, o) { return Math.max(m, parseInt(o.kodi.slice(2), 10) || 0); }, 0) + 1 + i;
    return b.prefiksi + ('00' + n).slice(-Math.max(3, String(n).length));
  };
  var isChanged = function (o) {
    var d = draft[o.id];
    return !!d && (clean(d.emri) !== o.emri || d.aktiv !== o.aktiv);
  };
  var changed = function () { return data ? data.operatoret.filter(isChanged) : []; };
  var filled = function () { return fresh.filter(function (r) { return clean(r.emri); }); };
  var pending = function () { return mode === 'add' ? filled().length : mode === 'edit' ? changed().length : 0; };

  root.innerHTML =
    '<p class="zn-note" id="opNote" hidden></p>' +
    '<section class="sk-sheet op-sheet">' +
      '<div class="sk-xl-head"><h3 class="sk-xl-title" id="opTitle"></h3><span id="opHint"></span><span class="ast-count" id="opCount"></span></div>' +
      '<div class="sk-scroll"><table class="sk-xl op-xl" id="opTable">' +
      '<colgroup id="opCols"></colgroup>' +
      '<thead id="opHead"></thead><tbody id="opBody"></tbody>' +
      '<tfoot id="opFoot"></tfoot>' +
      '</table></div><div id="opMoreBox"></div></section>';

  var noteEl = document.getElementById('opNote');
  var titleEl = document.getElementById('opTitle');
  var hintEl = document.getElementById('opHint');
  var countEl = document.getElementById('opCount');
  var tableEl = document.getElementById('opTable');
  var headEl = document.getElementById('opHead');
  var bodyEl = document.getElementById('opBody');
  var footEl = document.getElementById('opFoot');
  var moreEl = document.getElementById('opMoreBox');

  var renderTexts = function () {
    document.getElementById('opAddLbl').textContent = t('add');
    document.getElementById('opEditLbl').textContent = t('edit');
    document.getElementById('opSaveLbl').textContent = t('save');
    document.getElementById('opExportLbl').textContent = t('exportCsv');
    [[qSel, 'colQarku'], [bSel, 'colBashkia']].forEach(function (x) {
      x[0].title = t(x[1]);
      x[0].setAttribute('aria-label', t(x[1]));
    });
  };

  var renderBar = function () {
    addBtn.hidden = editBtn.hidden = !can();
    addBtn.setAttribute('aria-pressed', mode === 'add' ? 'true' : 'false');
    editBtn.setAttribute('aria-pressed', mode === 'edit' ? 'true' : 'false');
    editBtn.disabled = !data || !data.operatoret.length;
    var n = pending();
    saveBtn.hidden = !n;
    saveBtn.disabled = busy;
    document.getElementById('opSaveN').textContent = n || '';
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
    qSel.disabled = bSel.disabled = lock || mode !== 'view';
  };

  var statusBadge = function (on) {
    return '<span class="op-st ' + (on ? 'is-on' : 'is-off') + '">' + esc(t(on ? 'aktiv' : 'joAktiv')) + '</span>';
  };
  var nameInput = function (attr, value, label) {
    return '<input type="text" class="sk-in" maxlength="150" ' + attr + ' value="' + esc(value) + '" placeholder="' + esc(t('namePh')) +
      '" aria-label="' + esc(t('colEmri') + ' — ' + label) + '">';
  };

  var renderFoot = function () {
    var lead = mode === 'add';
    var total = data.operatoret.length + (lead ? filled().length : 0);
    footEl.innerHTML = '<tr><td colspan="' + (lead ? 3 : 2) + '">' + esc(t('total')) + '</td>' +
      '<td colspan="4">' + esc(total === 1 ? t('op1') : t('ops', { n: total })) + '</td></tr>';
  };

  var renderRows = function () {
    var cur = bashkia();
    var ops = data.operatoret;
    var nOn = ops.filter(function (o) { return o.aktiv; }).length;
    var lead = mode === 'add';
    titleEl.textContent = t('title') + (cur ? ' — ' + cur.emri + ' (' + cur.prefiksi + ')' : '');
    countEl.textContent = ops.length && mode === 'view' ? t(nOn === 1 ? 'count1' : 'count', { a: nOn, n: ops.length }) : '';
    hintEl.innerHTML = mode === 'view' ? '' : '<p class="sk-edit-hint">' + esc(t(mode === 'add' ? 'addHint' : 'editHint')) + '</p>';
    noteEl.textContent = can() ? '' : t('readOnly');
    noteEl.hidden = !noteEl.textContent;
    tableEl.classList.toggle('is-editing', mode !== 'view');

    document.getElementById('opCols').innerHTML = (lead ? '<col style="width:44px">' : '') +
      [6, 30, 14, 12, 22, 16].map(function (w) { return '<col style="width:' + w + '%">'; }).join('');
    var cols = ['colNr', 'colEmri', 'colKodi', 'colStatusi', 'colNga', 'colData'];
    headEl.innerHTML = '<tr>' + (lead ? '<th class="sk-chk" scope="col"></th>' : '') +
      cols.map(function (k) { return '<th scope="col">' + esc(t(k)) + '</th>'; }).join('') + '</tr>';
    renderFoot();

    var rows = ops.map(function (o, i) {
      var d = draft[o.id];
      var ed = mode === 'edit';
      var cls = [ed ? 'is-sel' : '', ed && isChanged(o) ? 'is-edited' : '', bad[o.id] ? 'is-invalid' : '', !ed && !o.aktiv ? 'op-off' : '']
        .join(' ').trim();
      var on = d ? d.aktiv : o.aktiv;
      var name = ed ? nameInput('data-id="' + o.id + '" data-f="emri"', d ? d.emri : o.emri, o.kodi) : esc(o.emri);
      var st = ed
        ? '<select class="sk-in" data-id="' + o.id + '" data-f="aktiv" aria-label="' + esc(t('colStatusi') + ' — ' + o.kodi) + '">' +
          '<option value="1"' + (on ? ' selected' : '') + '>' + esc(t('aktiv')) + '</option>' +
          '<option value="0"' + (on ? '' : ' selected') + '>' + esc(t('joAktiv')) + '</option></select>'
        : statusBadge(o.aktiv);
      return '<tr' + (cls ? ' class="' + cls + '"' : '') + '>' + (lead ? '<td class="sk-chk"></td>' : '') +
        '<td class="c">' + (i + 1) + '</td><td>' + name + '</td><td class="c op-kodi">' + esc(o.kodi) + '</td>' +
        '<td class="c">' + st + '</td><td>' + esc(o.perdoruesi) + '</td><td class="c op-when">' + esc(when(o.perditesuar_me)) + '</td></tr>';
    });
    if (lead) {
      fresh.forEach(function (r, i) {
        rows.push('<tr class="is-sel' + (bad[r.key] ? ' is-invalid' : '') + '">' +
          '<td class="c sk-chk"><button type="button" class="xl-del" data-del="' + r.key + '" aria-label="' + esc(t('remove')) +
          '" title="' + esc(t('remove')) + '">×</button></td>' +
          '<td class="c">' + (ops.length + i + 1) + '</td><td>' + nameInput('data-key="' + r.key + '"', r.emri, codeAt(i)) + '</td>' +
          '<td class="c op-kodi op-new">' + esc(codeAt(i)) + '</td><td class="c">' + statusBadge(true) + '</td><td></td><td></td></tr>');
      });
    }
    bodyEl.innerHTML = rows.length ? rows.join('')
      : '<tr><td colspan="' + (cols.length + (lead ? 1 : 0)) + '" class="tbl-empty">' + esc(t('none')) + (can() ? ' ' + esc(t('noneCan')) : '') + '</td></tr>';
    moreEl.innerHTML = lead ? '<button type="button" class="xl-add" id="opMore">' + esc(t('addRow')) + '</button>' : '';
  };

  var renderAll = function () {
    renderTexts();
    if (data) { renderFilters(); renderRows(); }
    renderBar();
  };

  var focusLastInput = function () {
    var ins = bodyEl.querySelectorAll('input.sk-in');
    if (ins.length) ins[mode === 'add' ? ins.length - 1 : 0].focus();
  };
  var setMode = function (m) {
    mode = m;
    fresh = []; draft = {}; bad = {};
    if (m === 'add') fresh.push({ key: 'n' + (seq++), emri: '' });
    renderAll();
    if (m !== 'view') focusLastInput();
  };

  var send = function (method, body) {
    return fetch('/api/operatoret', {
      method: method, credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (r.status === 401) { toLogin(); throw new Error('login'); }
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 403) throw new Error('errPerm');
        if (r.status === 409) throw new Error('errDup');
        if (!r.ok) throw new Error('errSave');
        return j.operatori;
      });
    });
  };

  var validate = function () {
    bad = {};
    var names = data.operatoret.map(function (o) {
      return { k: o.id, emri: mode === 'edit' && draft[o.id] ? draft[o.id].emri : o.emri, check: mode === 'edit' && isChanged(o) };
    });
    if (mode === 'add') filled().forEach(function (r) { names.push({ k: r.key, emri: r.emri, check: true }); });
    var seen = {};
    names.forEach(function (x) { var n = clean(x.emri).toLowerCase(); seen[n] = (seen[n] || 0) + 1; });
    names.forEach(function (x) {
      if (x.check && (clean(x.emri).length < 2 || seen[clean(x.emri).toLowerCase()] > 1)) bad[x.k] = true;
    });
    return !Object.keys(bad).length;
  };

  var saveNow = function () {
    if (busy || !pending()) return;
    if (!validate()) { renderRows(); toast('error', t('errRows')); return; }
    busy = true;
    renderBar();
    var jobs = mode === 'add'
      ? filled().map(function (r) {
        return { k: r.key, emri: clean(r.emri), run: function () { return send('POST', { bashkia_id: data.bashkia_id, emri: clean(r.emri) }); } };
      })
      : changed().map(function (o) {
        var d = draft[o.id];
        return { k: o.id, emri: clean(d.emri), run: function () { return send('PUT', { id: o.id, emri: clean(d.emri), aktiv: d.aktiv }); } };
      });
    var done = [];
    var step = function (i) {
      if (i >= jobs.length) return Promise.resolve();
      return jobs[i].run().then(function (o) {
        done.push(o);
        if (mode === 'add') {
          data.operatoret.push(o);
          fresh = fresh.filter(function (r) { return r.key !== jobs[i].k; });
        } else {
          data.operatoret = data.operatoret.map(function (x) { return x.id === o.id ? o : x; });
          delete draft[o.id];
        }
        return step(i + 1);
      }, function (err) {
        if (err.message !== 'login') bad[jobs[i].k] = true;
        throw new Error(err.message === 'errDup' ? 'errDup:' + jobs[i].emri : err.message);
      });
    };
    var byCode = function () { data.operatoret.sort(function (a, b) { return a.kodi < b.kodi ? -1 : 1; }); };
    step(0).then(function () {
      byCode();
      toast('ok', mode === 'edit' ? t('saved')
        : done.length === 1 ? t('added1', { e: done[0].emri, k: done[0].kodi }) : t('added', { n: done.length }));
      busy = false;
      setMode('view');
    }).catch(function (err) {
      busy = false;
      byCode();
      if (err.message !== 'login') {
        var m = /^errDup:(.*)$/.exec(err.message);
        toast('error', m ? t('errDup', { e: m[1] }) : t(/^err/.test(err.message) ? err.message : 'errSave'));
      }
      renderAll();
    });
  };

  addBtn.addEventListener('click', function () { setMode(mode === 'add' ? 'view' : 'add'); });
  editBtn.addEventListener('click', function () { setMode(mode === 'edit' ? 'view' : 'edit'); });
  saveBtn.addEventListener('click', saveNow);

  bodyEl.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.matches('.sk-in')) return;
    var tr = el.closest('tr');
    if (el.hasAttribute('data-key')) {
      var key = el.getAttribute('data-key');
      fresh.forEach(function (r) { if (r.key === key) r.emri = el.value; });
      delete bad[key];
    } else {
      var id = +el.getAttribute('data-id');
      var o = data.operatoret.filter(function (x) { return x.id === id; })[0];
      var d = draft[id] = draft[id] || { emri: o.emri, aktiv: o.aktiv };
      if (el.getAttribute('data-f') === 'emri') d.emri = el.value; else d.aktiv = el.value === '1';
      delete bad[id];
      tr.classList.toggle('is-edited', isChanged(o));
    }
    tr.classList.remove('is-invalid');
    renderFoot();
    renderBar();
  });
  bodyEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('input.sk-in')) { e.preventDefault(); saveNow(); }
  });
  bodyEl.addEventListener('click', function (e) {
    var del = e.target.closest('[data-del]');
    if (!del) return;
    fresh = fresh.filter(function (r) { return r.key !== del.getAttribute('data-del'); });
    renderRows();
    renderBar();
  });
  moreEl.addEventListener('click', function (e) {
    if (!e.target.closest('#opMore')) return;
    fresh.push({ key: 'n' + (seq++), emri: '' });
    renderRows();
    renderBar();
    focusLastInput();
  });

  qSel.addEventListener('change', function () {
    filtQ = qSel.value;
    var first = data.bashkite.filter(function (b) { return !filtQ || b.qarku === filtQ; })[0];
    if (first && first.id !== data.bashkia_id) loadAndRender(first.id);
    else renderFilters();
  });
  bSel.addEventListener('change', function () { loadAndRender(+bSel.value); });

  exportBtn.addEventListener('click', function () {
    if (!data) return;
    var cur = bashkia();
    var q = function (v) { v = String(v == null ? '' : v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [[t('colEmri'), t('colKodi'), t('colStatusi'), t('colBashkia'), t('colQarku'), t('colNga'), t('colData')].map(q).join(';')];
    data.operatoret.forEach(function (o) {
      lines.push([o.emri, o.kodi, t(o.aktiv ? 'aktiv' : 'joAktiv'), cur.emri, cur.qarku, o.perdoruesi, when(o.perditesuar_me)].map(q).join(';'));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mjeshtri-i-ujit-' + cur.emri.toLowerCase().replace(/\s+/g, '-') + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });

  window.addEventListener('beforeunload', function (e) {
    if (pending()) { e.preventDefault(); e.returnValue = t('leave'); }
  });
  document.addEventListener('idms:langchange', function (e) {
    lang = e.detail === 'en' ? 'en' : 'sq';
    renderAll();
  });

  var loading = function (on) { if (window.idmsLoading) window.idmsLoading(root, on); };
  var loadAndRender = function (bashkiaId) {
    loading(true);
    var url = '/api/operatoret' + (bashkiaId ? '?bashkia=' + encodeURIComponent(bashkiaId) : '');
    return fetch(url, { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) { toLogin(); return null; }
      if (!r.ok) throw new Error('load');
      return r.json();
    }).then(function (d) {
      if (d) { data = d; mode = 'view'; fresh = []; draft = {}; bad = {}; }
    }).catch(function () { toast('error', t('errLoad')); }).then(function () {
      renderAll();
      loading(false);
    });
  };

  renderTexts();
  loadAndRender();
})();
