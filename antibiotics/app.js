/* Antibiotics · interface. Data lives in data.js. Nothing is stored or sent. */
(function () {
  var SYSTEMS = window.ABX_SYSTEMS, DB = window.ABX_DB;
  var state = { system: null, infection: null, setting: 'inpatient', risks: new Set() };

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function chip(label, pressed, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(!!pressed));
    b.addEventListener('click', onClick);
    return b;
  }

  function renderSystems() {
    var box = $('systems'); box.innerHTML = '';
    Object.keys(SYSTEMS).forEach(function (sys) {
      box.appendChild(chip(sys, sys === state.system, function () {
        state.system = sys; state.infection = null;
        renderSystems(); renderInfections(); clearResults(); updateStatus();
      }));
    });
  }

  function renderInfections() {
    var step = $('step-infection'), box = $('infections');
    box.innerHTML = '';
    if (!state.system) { step.hidden = true; return; }
    step.hidden = false;
    SYSTEMS[state.system].forEach(function (inf) {
      box.appendChild(chip(inf, inf === state.infection, function () {
        state.infection = inf; renderInfections(); clearResults(); updateStatus();
      }));
    });
  }

  function renderSettings() {
    var box = $('settings'); box.innerHTML = '';
    [['outpatient', 'Outpatient'], ['inpatient', 'Inpatient (floor)'], ['icu', 'ICU']].forEach(function (s) {
      box.appendChild(chip(s[1], s[0] === state.setting, function () {
        state.setting = s[0]; renderSettings(); clearResults();
      }));
    });
  }

  function renderRisks() {
    var box = $('risks'); box.innerHTML = '';
    window.ABX_RISKS.forEach(function (r) {
      box.appendChild(chip(r.label, state.risks.has(r.key), function () {
        state.risks.has(r.key) ? state.risks.delete(r.key) : state.risks.add(r.key);
        renderRisks(); clearResults();
      }));
    });
  }

  function updateStatus() {
    var go = $('go');
    go.disabled = !state.infection;
    $('go-hint').textContent = state.infection ? state.infection : 'Choose a body system and an infection first.';
  }

  function clearResults() { $('results').innerHTML = ''; }

  function row(d, role) {
    return '<li><span class="row-role">' + esc(role) + '</span>' +
      '<div class="row-name">' + esc(d.name) + '</div>' +
      '<div class="row-dose">' + esc(d.dose) + '</div>' +
      '<div class="row-detail">' + esc(d.cov) + (d.note ? '. ' + esc(d.note) : '') + '</div></li>';
  }

  function show() {
    if (!state.infection) return;
    var data = DB[state.infection] && DB[state.infection][state.setting];
    var out = $('results');
    var settingName = { outpatient: 'Outpatient', inpatient: 'Inpatient (floor)', icu: 'ICU' }[state.setting];
    var html = '<h2 id="results-h" tabindex="-1">' + esc(state.infection) + ' <span class="h2-meta">· ' + settingName + '</span></h2>';
    if (!data || (!data.fl.length && !data.esc)) {
      html += '<p class="note">No regimen listed for this combination.</p>';
    } else if (!data.fl.length) {
      html += '<p class="note">' + esc(data.esc) + '</p>';
    } else {
      html += window.ABX_RENDER(data, state.risks, row, esc);
    }
    out.innerHTML = html;
    var h = $('results-h'); if (h) h.focus();
  }

  document.documentElement.classList.add('js');
  renderSystems(); renderInfections(); renderSettings(); renderRisks(); updateStatus();
  $('go').addEventListener('click', show);
  $('tool').hidden = false;
})();
