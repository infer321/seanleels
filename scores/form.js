/* Scores · "form" score type: mixed radio groups, checkboxes and number inputs.
   items: {kind:'radio', key, legend, opts:[{label, pts}]}
          {kind:'checks', legend, items:[{key, label, pts}]}
          {kind:'numbers', legend, fields:[{key, label, placeholder}]}
   A score either sums points (interpret(total, v)) or computes its own result (compute(v) → {total, result} or null). */
window.SC_FORM_HTML = function (sc, h) {
  var html = '';
  sc.items.forEach(function (it) {
    if (it.kind === 'radio') {
      html += '<fieldset><legend>' + h.esc(it.legend) + '</legend>';
      it.opts.forEach(function (o, i) {
        html += it.noPts
          ? '<label class="opt" for="f_' + it.key + '_' + i + '"><input type="radio" name="f_' + it.key + '" id="f_' + it.key + '_' + i + '"><span class="opt-label">' + h.esc(o.label) + '</span><span class="opt-pts"></span></label>'
          : h.radio('f_' + it.key, 'f_' + it.key + '_' + i, o.label, o.pts);
      });
      html += '</fieldset>';
    } else if (it.kind === 'checks') {
      html += '<fieldset><legend>' + h.esc(it.legend) + '</legend>';
      it.items.forEach(function (c) {
        html += c.pts === undefined
          ? '<label class="opt" for="f_' + c.key + '"><input type="checkbox" id="f_' + c.key + '"><span class="opt-label">' + h.esc(c.label) + '</span><span class="opt-pts"></span></label>'
          : h.check('f_' + c.key, c.label, c.pts);
      });
      html += '</fieldset>';
    } else if (it.kind === 'numbers') {
      html += '<fieldset><legend>' + h.esc(it.legend) + '</legend><div class="nums">';
      it.fields.forEach(function (f) {
        html += '<label class="num" for="f_' + f.key + '"><span>' + h.esc(f.label) + '</span><input type="number" step="any" inputmode="decimal" id="f_' + f.key + '" placeholder="' + h.esc(f.placeholder || '') + '"></label>';
      });
      html += '</div></fieldset>';
    }
  });
  if (sc.note) html += '<p class="note calc-note">' + h.esc(sc.note) + '</p>';
  return html;
};

window.SC_FORM_CALC = function (sc, $) {
  var v = {}, total = 0, answered = 0, needed = 0;
  sc.items.forEach(function (it) {
    if (it.kind === 'radio') {
      needed++;
      it.opts.forEach(function (o, i) {
        var el = $('f_' + it.key + '_' + i);
        if (el && el.checked) { v[it.key] = { index: i, pts: o.pts || 0 }; total += o.pts || 0; answered++; }
      });
    } else if (it.kind === 'checks') {
      it.items.forEach(function (c) {
        var el = $('f_' + c.key);
        v[c.key] = !!(el && el.checked);
        if (v[c.key] && c.pts) total += c.pts;
      });
    } else if (it.kind === 'numbers') {
      it.fields.forEach(function (f) {
        var raw = $('f_' + f.key).value;
        v[f.key] = raw === '' ? NaN : parseFloat(raw);
      });
    }
  });
  if (sc.compute) {
    var out = sc.compute(v);
    if (!out) return null;
    return { total: out.total, result: out.result, answered: answered, needed: sc.requireAll ? needed : 0 };
  }
  return { total: total, result: sc.interpret(total, v), answered: answered, needed: needed };
};
