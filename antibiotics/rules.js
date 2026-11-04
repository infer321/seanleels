/* Antibiotics · clinical rules: which risk factors exist and how they change what is shown. Content last checked Nov 2026. */
window.ABX_RISKS = [
  { key: 'pcn', label: 'Penicillin allergy' },
  { key: 'mrsa', label: 'MRSA risk' },
  { key: 'pseudo', label: 'Pseudomonas risk' },
  { key: 'renal', label: 'Renal impairment' },
  { key: 'preg', label: 'Pregnancy' },
  { key: 'immuno', label: 'Immunocompromised' },
  { key: 'abx90', label: 'Antibiotics in last 90 days' }
];

/* Notes shown for risk factors that don't swap a regimen. Sources: 2022 AAAAI/ACAAI drug allergy practice parameter (penicillin);
   ASHP/IDSA 2020 vancomycin consensus and package labeling (renal); IDSA/ATS pneumonia and cUTI guidelines (prior antibiotics). */
window.ABX_RISK_NOTES = {
  pcn: 'Most patients labeled penicillin-allergic can safely receive a cephalosporin with a dissimilar side chain (such as cefazolin, ceftriaxone or cefepime), even without testing unless the reaction was severe and delayed (such as SJS/TEN). Refer for allergy evaluation; most labels can be removed.',
  pseudo: 'Pseudomonas risk: choose an anti-pseudomonal agent (piperacillin-tazobactam, cefepime or meropenem), guided by prior cultures and the local antibiogram.',
  renal: 'Renal impairment: dose to creatinine clearance, and use AUC-guided vancomycin. Avoid nitrofurantoin if CrCl is under 30.',
  preg: 'Pregnancy: avoid doxycycline and fluoroquinolones; avoid TMP-SMX in the first trimester and near term, and nitrofurantoin near term. Check each agent.',
  immuno: 'Immunocompromised: consider broader empiric coverage and atypical, fungal and viral causes, and involve infectious diseases early.',
  abx90: 'Antibiotics in the last 90 days raise the risk of resistant organisms: avoid the class used most recently and cover more broadly until cultures return.'
};

window.ABX_RENDER = function (data, risks, row, esc) {
  var hasPCN = risks.has('pcn'), hasMRSA = risks.has('mrsa');
  var html = '<h3 class="list-h">Recommended regimen</h3><ul class="rows">';
  if (hasPCN && data.al) {
    html += row(data.al, 'If penicillin allergy');
    data.fl.forEach(function (d) { html += row(d, 'First line, if the allergy history allows'); });
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
  window.ABX_RISKS.forEach(function (r) {
    if (risks.has(r.key) && window.ABX_RISK_NOTES[r.key]) html += '<li><span class="row-role">' + esc(r.label) + '</span>' + esc(window.ABX_RISK_NOTES[r.key]) + '</li>';
  });
  html += '</ul>';
  html += '<p class="note after">Always check your local antibiogram, adjust for renal and hepatic function, and use clinical judgment.</p>';
  return html;
};
