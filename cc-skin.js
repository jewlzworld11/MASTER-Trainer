/* Command-center frame for a class trainer: top bar, hero layout, bottom status bar.
   Load it at the end of <body> with data attributes:
     data-id     class id used by mt-progress.js (python, math, business, ethics, english, fde)
     data-title  trainer name, e.g. "Python Output Trainer"
     data-short  word shown in the hero orb, e.g. "PYTHON"
     data-hero   CSS selector of the trainer's own header block
     data-tabs   JSON list of tabs: [{"t":"Levels","sel":"#levels","do":"scroll"}, {"t":"Daily review","sel":".x","do":"click"}]
   It only adds a frame around the trainer. The trainer's content and saved progress are untouched. */
(function () {
  'use strict';
  var me = document.currentScript, D = (me && me.dataset) || {};
  var M = window.MASTER || null;
  var cls = M ? [M.GOAL].concat(M.CLASSES).filter(function (c) { return c.id === D.id; })[0] : null;
  var accent = (cls && cls.color) || '#3fd2ff';
  var num = M && cls && cls.id !== 'fde' ? M.CLASSES.indexOf(cls) + 1 : 0;
  document.documentElement.classList.add('cc');
  document.documentElement.style.setProperty('--cc-accent', accent);
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function prog() { try { var p = JSON.parse(localStorage.getItem('mt.progress') || '{}'); return p && p[D.id]; } catch (e) { return null; } }
  function pct() { var r = prog(); return r && r.total ? Math.round(r.done / r.total * 100) : null; }

  var MARK = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><radialGradient id="ccmg" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#8be9ff"/><stop offset=".7" stop-color="#1f7bff"/><stop offset="1" stop-color="#062a6e"/></radialGradient></defs>' +
    '<circle cx="24" cy="24" r="22" fill="none" stroke="#3fd2ff" stroke-width="1.5" opacity=".7"/><circle cx="24" cy="24" r="17" fill="none" stroke="#3fd2ff" stroke-width="2.5" stroke-dasharray="10 5"/>' +
    '<path d="M24 9 L37 30 L24 39 L11 30 Z" fill="url(#ccmg)" stroke="#bff4ff" stroke-width="1"/><path d="M24 9 L24 39 M11 30 L37 30" stroke="#04204e" stroke-width="1.2"/></svg>';
  var tabs = []; try { tabs = JSON.parse(D.tabs || '[]'); } catch (e) { tabs = []; }

  /* ---------- top bar ---------- */
  var top = document.createElement('header');
  top.className = 'cc-top';
  top.innerHTML =
    '<a class="cc-brand" href="index.html" aria-label="Back to the command center"><span>' + MARK + '</span><span><b>JEWLZ OS</b><small>' + esc(D.title || '') + '</small></span></a>' +
    '<div class="cc-clock"><small id="cc-date"></small><b id="cc-time">--:--</b></div>' +
    '<nav class="cc-tabs" aria-label="Trainer sections"><a class="cc-tab" href="index.html">Command center</a>' +
      tabs.map(function (t, i) { return '<button class="cc-tab" type="button" data-t="' + i + '"' + (i === 0 ? ' aria-current="page"' : '') + '>' + esc(t.t) + '</button>'; }).join('') + '</nav>' +
    '<div class="cc-stat"><i></i><span><small>Module status</small><b id="cc-pct">Online</b></span></div>' +
    '<div class="cc-who"><span class="cc-av" aria-hidden="true">JP</span></div>';
  document.body.insertBefore(top, document.body.firstChild);
  top.querySelector('.cc-tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-t]'); if (!b) return;
    var t = tabs[+b.dataset.t], el = t && document.querySelector(t.sel);
    top.querySelectorAll('.cc-tab[aria-current]').forEach(function (x) { x.removeAttribute('aria-current'); });
    b.setAttribute('aria-current', 'page');
    if (!el) return;
    if (t.do === 'click') el.click();
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- hero ---------- */
  var hero = D.hero ? document.querySelector(D.hero) : null;
  if (hero) {
    hero.classList.add('cc-hero');
    var kick = document.createElement('div');
    kick.className = 'cc-kick';
    kick.innerHTML = '<span class="cc-pill"><i></i>Online</span>' +
      (cls ? '<span class="cc-pill acc">' + (num ? 'Class ' + String(num).padStart(2, '0') + ' · ' : 'End goal · ') + esc(cls.code) + '</span>' : '') +
      '<span class="cc-pill" id="cc-hero-pct" hidden></span>';
    var sub = document.createElement('div');
    sub.className = 'cc-sub'; sub.textContent = 'Jewlz OS · training module';
    hero.insertBefore(sub, hero.firstChild);
    hero.insertBefore(kick, hero.firstChild);
    var orb = document.createElement('div');
    orb.className = 'cc-orb'; orb.setAttribute('aria-hidden', 'true');
    orb.innerHTML = '<span class="r"></span><span class="r r2"></span><span class="r3"></span><b>' + esc(D.short || '') + '<small>' + (num ? 'MODULE ' + String(num).padStart(2, '0') : 'CORE') + '</small></b>';
    hero.appendChild(orb);
  }

  /* ---------- bottom status bar ---------- */
  var bot = document.createElement('footer');
  bot.className = 'cc-bottom';
  bot.innerHTML =
    '<div class="cc-sb"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3 L20 16 L12 21 L4 16 Z"/></svg><span><small>Jewlz OS</small><b>v2.0</b></span></div>' +
    '<div class="cc-sb cc-sm cc-md"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/></svg><span><small>Progress</small><b>Saved on this device</b></span></div>' +
    '<a class="cc-home" href="index.html"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 L12 4 L21 11"/><path d="M5 10v10h14V10"/></svg>Command center</a>' +
    '<div class="cc-sb cc-sm"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1"/></svg><span><small>Network</small><b id="cc-net">Online</b></span></div>' +
    '<div class="cc-sb"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg><span><small>Module</small><b id="cc-mod">' + esc(D.short || '') + '</b></span></div>';
  document.body.appendChild(bot);

  /* ---------- live bits ---------- */
  function tick() {
    var d = new Date();
    var t = document.getElementById('cc-time'), dd = document.getElementById('cc-date');
    if (t) t.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (dd) dd.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function paint() {
    var p = pct(), r = prog();
    var el = document.getElementById('cc-pct'); if (el) el.textContent = p == null ? 'Online' : p + '% complete';
    var hp = document.getElementById('cc-hero-pct');
    if (hp && r) { hp.hidden = false; hp.textContent = r.done + ' of ' + r.total + ' ' + r.unit; }
    var n = document.getElementById('cc-net'); if (n) n.textContent = navigator.onLine ? 'Online' : 'Offline';
  }
  tick(); paint();
  setInterval(tick, 15000); setInterval(paint, 5000);
  addEventListener('online', paint); addEventListener('offline', paint);
})();
