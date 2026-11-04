/* Scores · interface. Definitions live in data.js. Nothing is stored or sent. */
(function () {
  var CATS = window.SC_CATEGORIES, SCORES = window.SC_SCORES;
  var TIER = { low: 'ok', mod: 'warn', high: 'risk', info: 'info' };
  var state = { cat: Object.keys(CATS)[0], score: null };

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function slug(s) { return s.toLowerCase().replace(/[₂]/g, '2').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function pts(n) { return (n > 0 ? '+' : '') + n + (Math.abs(n) === 1 ? ' pt' : ' pts'); }

  function chip(label, pressed, onClick) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.setAttribute('aria-pressed', String(!!pressed));
    b.addEventListener('click', onClick);
    return b;
  }

  function renderCats() {
    var box = $('cats'); box.innerHTML = '';
    Object.keys(CATS).forEach(function (c) {
      box.appendChild(chip(c, c === state.cat, function () { state.cat = c; renderCats(); renderList(); }));
    });
  }

  function renderList() {
    var box = $('list'); box.innerHTML = '';
    CATS[state.cat].forEach(function (name) {
      box.appendChild(chip(name, name === state.score, function () { open(name, true); }));
    });
  }

  function findCat(name) {
    return Object.keys(CATS).filter(function (c) { return CATS[c].indexOf(name) !== -1; })[0];
  }

  function open(name, focus) {
    state.score = name; state.cat = findCat(name) || state.cat;
    renderCats(); renderList(); renderCalc(SCORES[name], name);
    try { history.replaceState(null, '', '#' + slug(name)); } catch (e) {}
    if (focus) $('calc-h').focus();
  }

  function check(id, label, p) {
    return '<label class="opt" for="' + id + '"><input type="checkbox" id="' + id + '"><span class="opt-label">' + esc(label) + '</span><span class="opt-pts">' + pts(p) + '</span></label>';
  }
  function radio(name, id, label, p) {
    return '<label class="opt" for="' + id + '"><input type="radio" name="' + name + '" id="' + id + '"><span class="opt-label">' + esc(label) + '</span><span class="opt-pts">' + pts(p) + '</span></label>';
  }

  function renderCalc(sc, name) {
    var html = '<h2 id="calc-h" tabindex="-1">' + esc(name) + '</h2><p class="note calc-desc">' + esc(sc.desc) + '</p><form id="calc-form" class="calc-form" novalidate>';
    if (sc.type === 'checklist') {
      html += '<fieldset><legend>Criteria</legend>';
      sc.criteria.forEach(function (c, i) { html += check('c' + i, c.label, c.pts); });
      html += '</fieldset>';
    } else if (sc.type === 'checklist-multi') {
      sc.sections.forEach(function (sec, si) {
        html += '<fieldset><legend>' + esc(sec.name) + '</legend>';
        sec.opts.forEach(function (o, oi) { html += radio('s' + si, 's' + si + '_' + oi, o.label, o.pts); });
        html += '</fieldset>';
      });
    } else if (sc.type === 'checklist-grouped') {
      sc.groups.forEach(function (g, gi) {
        html += '<fieldset><legend>' + esc(g.name) + '</legend>';
        g.items.forEach(function (c, i) { html += check('g' + gi + '_' + i, c.label, c.pts); });
        html += '</fieldset>';
      });
    } else if (sc.type === 'numeric') {
      html += '<fieldset><legend>Values</legend><div class="nums">';
      sc.fields.forEach(function (f) {
        html += '<label class="num" for="n_' + f.key + '"><span>' + esc(f.label) + '</span><input type="number" step="any" inputmode="decimal" id="n_' + f.key + '" placeholder="' + esc(f.placeholder) + '"></label>';
      });
      html += '</div></fieldset>';
      if (sc.note) html += '<p class="note calc-note">' + esc(sc.note) + '</p>';
    } else if (sc.type === 'form') {
      html += window.SC_FORM_HTML(sc, { check: check, radio: radio, esc: esc, pts: pts });
    }
    html += '</form><div id="result" class="result" aria-live="polite"></div><button type="button" class="btn-quiet" id="reset">Reset</button>';
    $('calc').innerHTML = html;
    $('calc').hidden = false;
    $('calc-form').addEventListener('input', calc);
    $('calc-form').addEventListener('change', calc);
    $('reset').addEventListener('click', function () { $('calc-form').reset(); calc(); });
    calc();
  }

  function calc() {
    var sc = SCORES[state.score], total = 0, answered = 0, needed = 0, r;
    var on = function (id) { var el = $(id); return el && el.checked; };
    if (sc.type === 'checklist') {
      sc.criteria.forEach(function (c, i) { if (on('c' + i)) total += c.pts; });
      r = sc.interpret(total);
    } else if (sc.type === 'checklist-multi') {
      needed = sc.sections.length;
      sc.sections.forEach(function (sec, si) {
        sec.opts.forEach(function (o, oi) { if (on('s' + si + '_' + oi)) { total += o.pts; answered++; } });
      });
      r = sc.interpret(total);
    } else if (sc.type === 'checklist-grouped') {
      sc.groups.forEach(function (g, gi) { g.items.forEach(function (c, i) { if (on('g' + gi + '_' + i)) total += c.pts; }); });
      r = sc.interpret(total);
    } else if (sc.type === 'numeric') {
      var f = {}, ok = true;
      sc.fields.forEach(function (fl) { var v = $('n_' + fl.key).value; f[fl.key] = v; if (v === '') ok = false; });
      if (!ok) { $('result').innerHTML = '<p class="note">Enter every value to see the result.</p>'; return; }
      r = sc.interpret(f); total = null;
    } else if (sc.type === 'form') {
      var out = window.SC_FORM_CALC(sc, $);
      if (!out) { $('result').innerHTML = '<p class="note">Enter every value to see the result.</p>'; return; }
      r = out.result; total = out.total; answered = out.answered; needed = out.needed;
    }
    var t = TIER[r.tier] || 'info';
    var score = total === null || total === undefined ? '' : '<div class="score">' + (Number.isInteger(total) ? total : total.toFixed(1)) + (r.unit ? '<small>' + esc(r.unit) + '</small>' : '') + '</div>';
    var partial = needed && answered < needed ? '<p class="note">Answered ' + answered + ' of ' + needed + ' items. The total counts only answered items.</p>' : '';
    $('result').innerHTML = '<div class="panel ' + t + '"><div class="tier ' + t + '">' + esc(r.label) + '</div>' + score + '<p>' + esc(r.detail) + '</p>' + partial + (sc.basis ? '<p class="based-on">Based on ' + esc(sc.basis) + '</p>' : '') + '</div>';
  }

  renderCats(); renderList();
  var hash = location.hash.slice(1);
  var match = hash && Object.keys(SCORES).filter(function (n) { return slug(n) === hash; })[0];
  if (match) open(match, false);
  $('tool').hidden = false;
})();
