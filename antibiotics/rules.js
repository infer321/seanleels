/* Antibiotics · clinical rules: which risk factors exist and how they change what is shown. */
window.ABX_RISKS = [
  { key: 'pcn', label: 'Penicillin allergy' },
  { key: 'mrsa', label: 'MRSA risk' },
  { key: 'pseudo', label: 'Pseudomonas risk' },
  { key: 'renal', label: 'Renal impairment' },
  { key: 'preg', label: 'Pregnancy' },
  { key: 'immuno', label: 'Immunocompromised' },
  { key: 'abx90', label: 'Antibiotics in last 90 days' }
];

window.ABX_RENDER = function (data, risks, row, esc) {
  var hasPCN = risks.has('pcn'), hasMRSA = risks.has('mrsa');
  var html = '<h3 class="list-h">Recommended regimen</h3><ul class="rows">';
  if (hasPCN && data.al) {
    html += row(data.al, 'If penicillin allergy');
  } else {
    data.fl.forEach(function (d) { html += row(d, 'First line'); });
  }
  html += '</ul>';

  var sl = (data.sl || []).filter(function (d) {
    var isMRSA = d.cov.toLowerCase().indexOf('mrsa') !== -1;
    return !isMRSA || hasMRSA;
  });
  if (sl.length) {
    html += '<h3 class="list-h">Alternative or escalation</h3><ul class="rows">';
    sl.forEach(function (d) {
      var isMRSA = d.cov.toLowerCase().indexOf('mrsa') !== -1;
      html += row(d, isMRSA && hasMRSA ? 'Add for MRSA risk' : 'Second line');
    });
    html += '</ul>';
  }

  html += '<ul class="rows facts">';
  if (data.dur) html += '<li><span class="row-role">Duration</span>' + esc(data.dur) + '</li>';
  if (data.esc) html += '<li><span class="row-role">Stewardship note</span>' + esc(data.esc) + '</li>';
  html += '</ul>';
  html += '<p class="note after">Always check your local antibiogram, adjust for renal and hepatic function, and use clinical judgment.</p>';
  return html;
};
