/* Look Here · eye exam phrase card. Plain JS, no build step.
   The phrases live in index.html, so the page still reads with this script off.
   Nothing is sent anywhere. Only the language, script and starred phrases are kept, in localStorage. See DESIGN.md. */
(function(){
"use strict";

const root = document.documentElement, main = document.getElementById("main");
const NAMES = {es:"Spanish", cmn:"Mandarin", yue:"Cantonese"};
const $ = id => document.getElementById(id);
const get = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
const put = (k, v) => { try { localStorage.setItem(k, v); } catch(e){} };

let lang = NAMES[get("lh-lang")] ? get("lh-lang") : "es";
let script = get("lh-script") === "hant" ? "hant" : "hans";
let stars; try { stars = new Set(JSON.parse(get("lh-stars") || "[]")); } catch(e){ stars = new Set(); }
let starOnly = false, cur = -1;

const rows = Array.from(document.querySelectorAll(".ph"));
const audioLangs = (main.dataset.audio || "").split(" ").filter(Boolean);
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/></svg>';

/* What a row says in the chosen language */
function read(row){
  const tr = row.querySelector('.tr[data-l="' + lang + '"]');
  const s = tr.querySelector('[data-s="' + script + '"]');
  const rd = row.querySelector('.rd[data-l="' + lang + '"]');
  return {
    id: row.id.slice(2),
    en: row.querySelector(".en").textContent,
    tr: (s || tr).textContent,
    rd: rd ? rd.textContent : "",
    code: lang === "es" ? "es" : lang === "yue" ? "yue" : script === "hant" ? "zh-Hant" : "zh-Hans",
    cjk: lang !== "es"
  };
}

/* Each row becomes a button that opens the large view, plus a star */
rows.forEach(row => {
  const t = row.querySelector(".ph-t");
  t.setAttribute("role", "button"); t.tabIndex = 0;
  const b = document.createElement("button");
  b.type = "button"; b.className = "star"; b.innerHTML = STAR;
  b.setAttribute("aria-label", "Star: " + row.querySelector(".en").textContent);
  b.setAttribute("aria-pressed", stars.has(row.id));
  row.appendChild(b);
});

const STATUS = {
  draft: n => n + ": draft translation that a native speaker has not checked yet. Don’t use it with patients.",
  checked: n => n + ": checked by a fluent speaker. A second review is still pending.",
  reviewed: n => n + ": checked and reviewed."
};

function filter(){
  const q = $("q").value.trim().toLowerCase();
  let shown = 0;
  rows.forEach(row => {
    const hide = (q && !row.querySelector(".en").textContent.toLowerCase().includes(q)) || (starOnly && !stars.has(row.id));
    row.hidden = hide; if (!hide) shown++;
  });
  document.querySelectorAll(".sec:not(.replies)").forEach(s => { s.hidden = !s.querySelector(".ph:not([hidden])"); });
  $("none").hidden = shown > 0;
}

function apply(){
  root.dataset.lang = lang; root.dataset.script = script;
  document.querySelectorAll("#langSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  document.querySelectorAll("#scriptSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.script === script));
  $("scriptSeg").hidden = lang !== "cmn";
  const st = main.getAttribute("data-status-" + lang) || "draft", note = $("statusNote");
  note.textContent = (STATUS[st] || STATUS.draft)(NAMES[lang]);
  note.classList.toggle("ok", st === "reviewed");
  filter();
}

/* ---------- show-the-patient view ---------- */
const show = $("show"), player = new Audio();
const visible = () => rows.filter(r => !r.hidden);
function fill(){
  const list = visible(), p = read(list[cur]);
  const tr = $("showTr"); tr.textContent = p.tr; tr.lang = p.code; tr.classList.toggle("cjk", p.cjk);
  $("showRd").textContent = p.rd; $("showRd").hidden = !p.rd;
  $("showEn").textContent = p.en;
  $("showPrev").disabled = cur <= 0; $("showNext").disabled = cur >= list.length - 1;
  const play = $("showPlay"); play.hidden = !audioLangs.includes(lang);
  if (!play.hidden) player.src = "audio/" + lang + "/" + p.id + ".m4a";
}
function open(row){ cur = visible().indexOf(row); if (cur < 0) return; fill(); show.showModal(); $("showClose").focus(); }
function step(d){ const n = cur + d; if (n < 0 || n >= visible().length) return; cur = n; player.pause(); fill(); }
player.addEventListener("error", () => { $("showPlay").hidden = true; });
$("showPlay").addEventListener("click", () => { player.currentTime = 0; const p = player.play(); if (p && p.catch) p.catch(() => {}); });
$("showPrev").addEventListener("click", () => step(-1));
$("showNext").addEventListener("click", () => step(1));
$("showClose").addEventListener("click", () => show.close());
show.addEventListener("close", () => player.pause());
show.addEventListener("keydown", e => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });

/* ---------- patient reply card ---------- */
const reply = $("reply"), tiles = $("tiles");
function tile(big, en, o){
  const b = document.createElement("button");
  b.type = "button"; b.className = "tile" + (o && o.num ? " num" : ""); b.dataset.en = en; b.setAttribute("aria-pressed", "false");
  const s = document.createElement("b"); s.textContent = big;
  if (o && o.code){ s.lang = o.code; if (o.cjk) s.className = "cjk"; }
  b.appendChild(s);
  if (!(o && o.num)){ const e = document.createElement("span"); e.textContent = en; b.appendChild(e); }
  else b.setAttribute("aria-label", en);
  return b;
}
function head(text){ const h = document.createElement("h3"); h.textContent = text; return h; }
function buildReply(){
  tiles.textContent = "";
  document.querySelectorAll(".rp").forEach(r => { const p = read(r); tiles.appendChild(tile(p.tr, p.en, p)); });
  tiles.appendChild(head("Which way the E points"));
  [["↑","Up"],["→","Right"],["↓","Down"],["←","Left"]].forEach(a => tiles.appendChild(tile(a[0], a[1])));
  tiles.appendChild(head("Pain, 0 to 10"));
  const nums = document.createElement("div"); nums.className = "nums";
  for (let i = 0; i <= 10; i++) nums.appendChild(tile(String(i), "Pain " + i + " out of 10", {num:true}));
  tiles.appendChild(nums);
  $("heard").textContent = "Hand the screen to the patient. Their answer shows here in English.";
}
tiles.addEventListener("click", e => {
  const t = e.target.closest(".tile"); if (!t) return;
  tiles.querySelectorAll(".tile").forEach(x => x.setAttribute("aria-pressed", x === t));
  const h = $("heard"); h.textContent = "Patient pointed to: ";
  const b = document.createElement("b"); b.textContent = t.dataset.en; h.appendChild(b);
});
$("replyBtn").addEventListener("click", () => { buildReply(); reply.showModal(); $("replyClose").focus(); });
$("replyClose").addEventListener("click", () => reply.close());

/* ---------- controls ---------- */
$("langSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; lang = b.dataset.lang; put("lh-lang", lang); apply(); });
$("scriptSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; script = b.dataset.script; put("lh-script", script); apply(); });
$("q").addEventListener("input", filter);
$("starOnly").addEventListener("click", e => { starOnly = !starOnly; e.currentTarget.setAttribute("aria-pressed", starOnly); filter(); });
main.addEventListener("click", e => {
  const s = e.target.closest(".star");
  if (s){
    const id = s.parentElement.id, on = !stars.has(id);
    if (on) stars.add(id); else stars.delete(id);
    s.setAttribute("aria-pressed", on); put("lh-stars", JSON.stringify(Array.from(stars)));
    if (starOnly) filter();
    return;
  }
  const t = e.target.closest(".ph .ph-t"); if (t) open(t.parentElement);
});
main.addEventListener("keydown", e => {
  const t = e.target.closest && e.target.closest(".ph .ph-t");
  if (t && e.target === t && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); open(t.parentElement); }
});

apply();
})();
