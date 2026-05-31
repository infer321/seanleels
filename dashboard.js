/* ── Sean Lee · Life Dashboard · Shared JS ──────────────────────────────── */

const NAV_PAGES = [
  { href: 'dashboard.html', label: 'Home' },
  { href: 'study.html',     label: 'Study' },
  { href: 'research.html',  label: 'Research' },
  { href: 'gym.html',       label: 'Gym' },
  { href: 'piano.html',     label: 'Piano' },
];

function buildNav(activePage) {
  const logo = document.querySelector('.nav-logo');
  const links = document.querySelector('.nav-links');
  if (!links) return;
  links.innerHTML = '';
  NAV_PAGES.forEach(p => {
    const a = document.createElement('a');
    a.href = p.href;
    a.className = 'nav-link' + (p.href === activePage ? ' active' : '');
    a.textContent = p.label;
    links.appendChild(a);
  });
}

function today() { return new Date().toISOString().slice(0, 10); }

function getLevelIdx(xp, levels) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i][0]) return i;
  }
  return 0;
}

function updateStreak(S) {
  const t = today();
  if (S.lastDate === t) return;
  const yday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  S.streak = S.lastDate === yday ? S.streak + 1 : 1;
  S.lastDate = t;
}

function showToast(msg) {
  let wrap = document.getElementById('toasts');
  if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toasts'; wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}

function floatXP(amount) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = '+' + amount + ' xp';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function popEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function renderXPBar(S, levels, prefix) {
  const li = getLevelIdx(S.xp, levels);
  const lv = levels[li];
  document.getElementById(prefix + 'lv-num').textContent = li + 1;
  document.getElementById(prefix + 'lv-rank').textContent = lv[2];
  document.getElementById(prefix + 'xp-total').textContent = S.xp.toLocaleString();
  popEl(prefix + 'xp-total');
  const cur = S.xp - lv[0];
  const nxt = lv[1] === Infinity ? Infinity : lv[1] - lv[0];
  document.getElementById(prefix + 'xp-cur').textContent = cur.toLocaleString();
  document.getElementById(prefix + 'xp-nxt').textContent = nxt === Infinity ? '∞' : nxt.toLocaleString();
  const pct = nxt === Infinity ? 100 : Math.round((cur / nxt) * 100);
  document.getElementById(prefix + 'xp-fill').style.width = pct + '%';
}

function renderHmap(history, containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = '';
  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const v = history[d] || 0;
    const el = document.createElement('div');
    el.className = 'hd' + (v >= 400 ? ' h3' : v >= 150 ? ' h2' : v > 0 ? ' h1' : '');
    el.title = d.slice(5) + (v > 0 ? ' · ' + v + ' xp' : ' · no activity');
    g.appendChild(el);
  }
}

function renderAchs(S, achs, containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = '';
  achs.forEach(a => {
    const unlocked = S.unlocked.includes(a.id) || a.check(S);
    const el = document.createElement('div');
    el.className = 'ach' + (unlocked ? ' unlocked' : '');
    el.title = a.desc || '';
    el.textContent = a.label;
    g.appendChild(el);
  });
}

function checkAchs(S, achs, containerId) {
  achs.forEach((a, idx) => {
    if (!S.unlocked.includes(a.id) && a.check(S)) {
      S.unlocked.push(a.id);
      setTimeout(() => showToast(a.label + ' — unlocked'), idx * 500);
      renderAchs(S, achs, containerId);
    }
  });
}

function exportData(S, filename) {
  const date = today();
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename + '-' + date + '.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded');
}

function importData(e, onSuccess) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (typeof parsed.xp !== 'number') throw new Error();
      onSuccess(parsed);
      showToast('Data restored');
    } catch { showToast('Invalid backup file'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function showLvlUp(rank, quote, accentVar) {
  document.getElementById('lu-rank').textContent = rank;
  document.getElementById('lu-quote').textContent = quote;
  document.getElementById('lvlup').classList.add('show');
}
function closeLvlUp() { document.getElementById('lvlup').classList.remove('show'); }

/* Global summary for homepage */
function getAllXP() {
  const keys = { study: 'sls_study', research: 'sls_research', gym: 'sls_gym', piano: 'sls_piano' };
  const result = {};
  Object.entries(keys).forEach(([k, key]) => {
    const raw = localStorage.getItem(key);
    result[k] = raw ? (JSON.parse(raw).xp || 0) : 0;
  });
  return result;
}
