/* Jewlz World "motion board" layer for every class trainer (11/25/2026). Loaded by cc-skin.js.
   - Section Board: a full-screen grid of numbered neon tiles, one per section on the current screen (plus the trainer's main areas).
     Open it with the floating SECTIONS button; tap a tile to jump there.
   - Every section heading gets a matching number badge in its own neon.
   - Motion: sections glide in as you scroll, cards tilt toward the pointer,
     a neon beam at the top shows how far down the page you are, and soft particles drift in the background.
   It only adds things on top. Trainer content and saved progress are untouched. Reduced-motion settings turn the motion off. */
(function () {
  'use strict';
  if (window.__mtBoard) return; window.__mtBoard = true;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skin = document.querySelector('script[src$="cc-skin.js"]'), D = (skin && skin.dataset) || {};
  var tabs = []; try { tabs = JSON.parse(D.tabs || '[]'); } catch (e) { tabs = []; }
  var NEON = ['#2FE6C8', '#FF9E45', '#B48CFF', '#FF4FB0', '#6FC3FF', '#FFD25A', '#9AF2C8'];

  var css = '' +
    /* scroll beam */
    '.mb-beam{position:fixed;z-index:80;left:0;top:0;height:3px;width:100%;transform-origin:0 50%;transform:scaleX(0);pointer-events:none;' +
      'background:linear-gradient(90deg,#2FE6C8,#6FC3FF,#B48CFF,#FF4FB0,#FF9E45,#FFD25A);box-shadow:0 0 12px rgba(180,140,255,.9)}' +
    /* particles */
    '.mb-dust{position:fixed;inset:0;z-index:1;pointer-events:none;width:100%;height:100%;mix-blend-mode:screen;opacity:.55}' +
    /* heading number badges */
    '.mb-n{display:inline-grid;place-items:center;min-width:1.7em;height:1.7em;padding:0 .3em;margin-right:.55em;vertical-align:.12em;border-radius:.4em;' +
      'font:900 .62em/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:0;text-transform:none;color:#0B0822;background:var(--mb-c,currentColor);' +
      'box-shadow:0 0 12px var(--mb-c,currentColor),inset 0 0 0 1px rgba(255,255,255,.35);-webkit-text-fill-color:#0B0822;text-shadow:none}' +
    /* reveal */
    '.mb-rv{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}' +
    '.mb-rv.mb-in{opacity:1;transform:none}' +
    '.mb-rv.mb-in::after{content:none}' +
    /* tilt */
    '.mb-tilt{transition:transform .2s ease;transform-style:preserve-3d}' +
    /* floating button */
    '.mb-fab{all:unset;box-sizing:border-box;position:fixed;z-index:62;right:16px;bottom:calc(96px + env(safe-area-inset-bottom,0px));display:inline-flex;align-items:center;gap:8px;' +
      'padding:11px 16px;border-radius:999px;cursor:pointer;color:#0B0822;font:900 11.5px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.12em;text-transform:uppercase;' +
      'background:linear-gradient(90deg,var(--cc-main,#FF4FB0),var(--cc-alt2,#2FE6C8));box-shadow:0 0 20px color-mix(in srgb,var(--cc-main,#FF4FB0) 70%,transparent),0 8px 22px rgba(5,3,20,.6)}' +
    '.mb-fab svg{width:16px;height:16px}' +
    '.mb-fab b{display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#0B0822;color:#fff;font-size:10.5px}' +
    '.mb-fab:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '@media (max-width:760px){.mb-fab{bottom:calc(150px + env(safe-area-inset-bottom,0px));right:12px;padding:10px 13px}}' +
    /* board overlay */
    '.mb-board{position:fixed;inset:0;z-index:90;overflow:auto;padding:max(18px,env(safe-area-inset-top)) 18px 40px;background:radial-gradient(70% 50% at 50% 0%,rgba(180,140,255,.18),transparent 70%),rgba(5,3,22,.96);' +
      'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#F8F4FF;font-family:var(--cc-ui,"Exo 2",system-ui,sans-serif)}' +
    '.mb-board[hidden]{display:none}' +
    '.mb-in2{max-width:1180px;margin:0 auto}' +
    '.mb-hd{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px}' +
    '.mb-hd h2{margin:0;font:900 clamp(24px,4.5vw,46px)/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.01em;text-transform:uppercase;' +
      'background:linear-gradient(180deg,#fff,#D9C8FF 55%,var(--cc-main,#FF4FB0));-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 14px color-mix(in srgb,var(--cc-main,#FF4FB0) 60%,transparent))}' +
    '.mb-hd p{margin:8px 0 0;color:#C4BDE6;font-size:14px}' +
    '.mb-hd p b{color:var(--cc-main,#FF4FB0)}' +
    '.mb-x{all:unset;cursor:pointer;margin-left:auto;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;border:1.5px solid #3A2F6B;color:#fff;font:700 18px/1}' +
    '.mb-x:focus-visible{outline:2px solid #fff}' +
    '.mb-cmd{display:inline-flex;align-items:center;gap:10px;margin:0 0 18px;padding:9px 14px;border-radius:10px;border:1px solid #3A2F6B;background:#0B0822;font:600 13px/1 var(--cc-mono,"JetBrains Mono",monospace);color:#2FE6C8}' +
    '.mb-cmd i{font-style:normal;color:#8A80B4}' +
    '.mb-sec{margin:0 0 12px;display:flex;align-items:center;gap:10px;font:800 12px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:#C4BDE6}' +
    '.mb-sec::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#3A2F6B,transparent)}' +
    '.mb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-bottom:26px}' +
    '.mb-areas{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}' +
    '.mb-t{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:10px;min-height:132px;padding:14px;border-radius:14px;' +
      'border:1.6px solid var(--c);background:linear-gradient(160deg,color-mix(in srgb,var(--c) 14%,#0E0A2C),#0A0724 70%);box-shadow:0 0 16px color-mix(in srgb,var(--c) 35%,transparent),inset 0 0 22px color-mix(in srgb,var(--c) 10%,transparent);' +
      'transition:transform .2s ease,box-shadow .2s ease;transform-style:preserve-3d;opacity:0;animation:mb-pop .45s ease forwards}' +
    '.mb-t:hover{box-shadow:0 0 28px color-mix(in srgb,var(--c) 65%,transparent),inset 0 0 26px color-mix(in srgb,var(--c) 16%,transparent)}' +
    '.mb-t:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '@keyframes mb-pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}' +
    '.mb-t .n{display:flex;align-items:center;gap:10px}' +
    '.mb-t .n b{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:var(--c);color:#0B0822;font:900 16px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);box-shadow:0 0 14px var(--c)}' +
    '.mb-t .n span{font:800 13.5px/1.2 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.04em;text-transform:uppercase;color:#fff}' +
    '.mb-t .art{display:grid;place-items:center;border-radius:10px;min-height:56px;color:var(--c);background:repeating-linear-gradient(90deg,color-mix(in srgb,var(--c) 10%,transparent) 0 1px,transparent 1px 14px),' +
      'repeating-linear-gradient(0deg,color-mix(in srgb,var(--c) 10%,transparent) 0 1px,transparent 1px 14px),rgba(5,3,22,.6);border:1px solid color-mix(in srgb,var(--c) 35%,transparent)}' +
    '.mb-t .art svg{width:30px;height:30px;filter:drop-shadow(0 0 8px var(--c))}' +
    '.mb-t small{font-size:12px;line-height:1.35;color:#C4BDE6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '.mb-t.big{min-height:118px;grid-template-columns:auto 1fr;grid-template-rows:auto auto;align-items:center}' +
    '.mb-t.big .art{grid-row:span 2;width:70px;height:70px;min-height:0}' +
    '.mb-empty{color:#8A80B4;font-size:13.5px;margin:-6px 0 24px}' +
    '.mb-foot{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}' +
    '.mb-foot span{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:999px;border:1px solid #3A2F6B;font:600 11.5px/1 var(--cc-ui,system-ui);color:#C4BDE6}' +
    '.mb-foot span i{width:8px;height:8px;border-radius:50%;background:#2FE6C8;box-shadow:0 0 8px #2FE6C8}' +
    '.mb-flash{animation:mb-flash 1.4s ease}' +
    '@keyframes mb-flash{0%,100%{text-shadow:inherit}25%{text-shadow:0 0 18px var(--mb-c,#fff),0 0 36px var(--mb-c,#fff)}}' +
    '@media (prefers-reduced-motion:reduce){.mb-rv{opacity:1;transform:none;transition:none}.mb-t{animation:none;opacity:1}.mb-flash{animation:none}}' +
    '@media (max-width:600px){.mb-areas{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mb-t.big{min-height:0;grid-template-columns:1fr;grid-template-rows:auto auto auto;padding:12px}.mb-t.big .art{grid-row:auto;width:100%;height:48px}.mb-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mb-t{min-height:0;padding:11px}.mb-t .n b{width:28px;height:28px;font-size:14px}.mb-t .n span{font-size:11.5px}.mb-t .art{min-height:44px}.mb-t .art svg{width:24px;height:24px}}' +
    '@media print{.mb-fab,.mb-board,.mb-beam,.mb-dust,.mb-n{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- line icons picked from the section name ---------- */
  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var IC = [
    [/start|begin|intro|welcome|overview/i, P('<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5z"/><circle cx="15" cy="9" r="1.5"/>')],
    [/short|summary|tl;?dr|recap|big idea|remember|hook/i, P('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>')],
    [/word|term|vocab|glossary|lexicon|define|dictionary/i, P('<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 8h8M8 12h6"/>')],
    [/example|code|write|build|run|trace|step/i, P('<polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/>')],
    [/practice|quiz|test|exam|drill|check|spar|mock|question/i, P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>')],
    [/trap|mistake|wrong|watch|warning|careful/i, P('<path d="M12 3L22 20H2z"/><path d="M12 10v4M12 17h.01"/>')],
    [/analog|picture|imagine|like|story|world/i, P('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>')],
    [/teach|explain|say it|out loud|voice/i, P('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>')],
    [/job|client|career|interview|fde|work/i, P('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>')],
    [/note|idea|concept|key|main|learn|lesson|chapter|unit|level/i, P('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>')],
    [/progress|score|stat|journal|history|missed/i, P('<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>')],
    [/plan|path|route|map|roadmap|schedule/i, P('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>')]
  ];
  var DEF = P('<path d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/><circle cx="12" cy="12" r="3"/>');
  function iconFor(t) { for (var i = 0; i < IC.length; i++) if (IC[i][0].test(t)) return IC[i][1]; return DEF; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

  /* ---------- find the sections on screen ---------- */
  var OUT = '.cc-top,.cc-bottom,.mt-strip,.mt-sheet,.mt-fab,.mtv-ui,.mb-board,nav,dialog:not([open]),[hidden],[aria-hidden="true"],template';
  function visible(el) {
    if (el.checkVisibility) return el.checkVisibility({ visibilityProperty: true });
    var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  }
  function ownNum(h) {   // the trainer already numbers this heading itself (like AI Business chunks)
    var f = h.firstElementChild; if (f && f.classList.contains('mb-n')) f = f.nextElementSibling;
    return f && /^\s*\d{1,2}\s*$/.test(f.textContent) ? f : null;
  }
  function headText(h) {
    var c = h.cloneNode(true); c.querySelectorAll('.mb-n,.mtv-btn,svg,button').forEach(function (x) { x.remove(); });
    var f = c.firstElementChild; if (f && /^\s*\d{1,2}\s*$/.test(f.textContent)) f.remove();
    return clean(c.textContent);
  }
  function blurbOf(h) {
    for (var el = h.nextElementSibling, k = 0; el && k < 4; el = el.nextElementSibling, k++) {
      if (/^H[1-6]$/.test(el.tagName)) break;
      var t = clean(el.innerText || el.textContent); if (t.length > 12) return t.slice(0, 140);
    }
    var p = h.parentElement; if (p) { var t2 = clean((p.innerText || '').replace(headText(h), '')); if (t2.length > 12) return t2.slice(0, 140); }
    return '';
  }
  function colorOf(h) {
    var c = getComputedStyle(h).color;
    var m = c.match(/\d+(\.\d+)?/g);
    if (!m) return NEON[0];
    var r = +m[0], g = +m[1], b = +m[2];
    var sat = Math.max(r, g, b) - Math.min(r, g, b);
    return sat < 40 ? null : c;   // white or grey headings get a palette neon instead
  }
  var list = [], sig = '';
  function scan() {
    var hs = [].slice.call(document.querySelectorAll('h2,h3')).filter(function (h) {
      if (h.closest(OUT) || h.closest('.cc-hero')) return false;
      if (!visible(h)) return false;
      var t = headText(h); return t.length > 1 && t.length < 90;
    }).slice(0, 48);
    var s = hs.map(headText).join('|');
    if (s === sig && hs.every(function (h) { return ownNum(h) || h.querySelector(':scope > .mb-n'); })) return;
    sig = s;
    list = hs.map(function (h, i) {
      var c = colorOf(h) || NEON[i % NEON.length];
      h.style.setProperty('--mb-c', c);
      var b = h.querySelector(':scope > .mb-n');
      if (ownNum(h)) { if (b) b.remove(); }
      else {
        if (!b) { b = document.createElement('span'); b.className = 'mb-n'; b.setAttribute('aria-hidden', 'true'); h.insertBefore(b, h.firstChild); }
        b.textContent = i + 1;
      }
      if (!h.id) h.id = 'mb-s' + (i + 1);
      reveal(h.parentElement && h.parentElement !== document.body ? h.parentElement : h);
      return { h: h, t: headText(h), c: c };
    });
    paintFab();
  }

  /* ---------- reveal on scroll ---------- */
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var io = !RM && 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('mb-in'); io.unobserve(x.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -30px 0px' }) : null;
  function reveal(el) {
    if (!io || !el || (seen && seen.has(el))) return;
    if (seen) seen.add(el);
    var r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;          // already on screen: leave it alone
    el.classList.add('mb-rv'); io.observe(el);
  }

  /* ---------- floating button + board ---------- */
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'mb-fab mtv-ui'; fab.setAttribute('aria-haspopup', 'dialog');
  fab.innerHTML = P('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>') + 'Sections <b>0</b>';
  function paintFab() { fab.querySelector('b').textContent = list.length; fab.setAttribute('aria-label', 'Open the section board, ' + list.length + ' sections'); }
  var board = document.createElement('div');
  board.className = 'mb-board mtv-ui'; board.hidden = true;
  board.setAttribute('role', 'dialog'); board.setAttribute('aria-modal', 'true'); board.setAttribute('aria-label', 'Section board');
  var last = null;
  function openBoard() {
    scan();
    var title = D.title || document.title;
    var areas = tabs.map(function (t, i) { return { t: t.t, i: i }; });
    var h = '<div class="mb-in2"><div class="mb-hd"><div><h2>' + esc(title) + '</h2><p><b>' + list.length + ' sections</b> on this screen' + (areas.length ? ' · ' + areas.length + ' main areas' : '') + '. Tap a tile to jump there.</p></div>' +
      '<button class="mb-x" type="button" data-x aria-label="Close the section board">✕</button></div>' +
      '<div class="mb-cmd"><i>&gt;_</i> jewlz world · ' + esc((D.short || '').toLowerCase()) + ' · section board</div>';
    if (areas.length) {
      h += '<div class="mb-sec">Main areas</div><div class="mb-grid mb-areas">' + areas.map(function (a, k) {
        var c = NEON[(k + 3) % NEON.length];
        return '<button class="mb-t big" type="button" data-a="' + a.i + '" style="--c:' + c + ';animation-delay:' + (k * 45) + 'ms"><span class="art">' + iconFor(a.t) + '</span>' +
          '<span class="n"><span>' + esc(a.t) + '</span></span><small>Open ' + esc(a.t.toLowerCase()) + '</small></button>';
      }).join('') + '</div>';
    }
    h += '<div class="mb-sec">On this screen</div>';
    h += list.length ? '<div class="mb-grid">' + list.map(function (s, k) {
      return '<button class="mb-t" type="button" data-s="' + k + '" style="--c:' + s.c + ';animation-delay:' + (Math.min(k, 16) * 35) + 'ms">' +
        '<span class="n"><b>' + (k + 1) + '</b><span>' + esc(s.t) + '</span></span><span class="art">' + iconFor(s.t) + '</span><small>' + esc(blurbOf(s.h)) + '</small></button>';
    }).join('') + '</div>' : '<p class="mb-empty">Open a lesson or chapter and its sections show up here.</p>';
    h += '<div class="mb-foot"><span><i></i>' + list.length + (list.length === 1 ? ' section' : ' sections') + ' mapped</span><span><i></i>Progress saved on this device</span><span><i></i>Tap Esc or ✕ to close</span></div></div>';
    board.innerHTML = h;
    last = document.activeElement;
    board.hidden = false; document.documentElement.style.overflow = 'hidden';
    var f = board.querySelector('[data-x]'); if (f) f.focus();
  }
  function closeBoard() { board.hidden = true; document.documentElement.style.overflow = ''; if (last && last.focus) last.focus({ preventScroll: true }); }
  fab.addEventListener('click', openBoard);
  board.addEventListener('click', function (e) {
    if (e.target.closest('[data-x]')) { closeBoard(); return; }
    var a = e.target.closest('[data-a]');
    if (a) {
      closeBoard();
      var t = tabs[+a.dataset.a], el = t && document.querySelector(t.sel);
      var tb = document.querySelector('.cc-tabs [data-t="' + a.dataset.a + '"]');
      if (tb) tb.click(); else if (el) { if (t.do === 'click') el.click(); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }
      setTimeout(scan, 400);
      return;
    }
    var s = e.target.closest('[data-s]');
    if (s) {
      var it = list[+s.dataset.s]; closeBoard(); if (!it) return;
      var hd = it.h, d = hd.closest('details'); if (d && !d.open) d.open = true;
      var y = hd.getBoundingClientRect().top + scrollY - 86;
      scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
      hd.classList.remove('mb-flash'); void hd.offsetWidth; hd.classList.add('mb-flash');
    }
  });
  board.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBoard(); return; }
    if (e.key === 'Tab') {
      var f = board.querySelectorAll('button'); if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  if (!RM) board.addEventListener('pointermove', function (e) {
    var t = e.target.closest('.mb-t'); if (!t || e.pointerType === 'touch') return;
    var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    t.style.transform = 'perspective(700px) rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg) translateZ(4px)';
  });
  board.addEventListener('pointerout', function (e) { var t = e.target.closest('.mb-t'); if (t && !t.contains(e.relatedTarget)) t.style.transform = ''; });

  /* ---------- decode effect on the trainer title ---------- */
  function decode() {
    if (RM) return;
    var hero = document.querySelector('.cc-hero'); if (!hero) return;
    var h1 = hero.querySelector('h1'); if (!h1 || h1.children.length || h1.dataset.mbDone) return;
    var target = h1.textContent; if (!target || target.length > 60) return;
    h1.dataset.mbDone = '1';
    var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/', t0 = performance.now(), dur = 900;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), n = Math.floor(target.length * k), out = target.slice(0, n);
      for (var i = n; i < target.length; i++) out += target[i] === ' ' ? ' ' : CH[(Math.random() * CH.length) | 0];
      h1.textContent = out;
      if (k < 1) requestAnimationFrame(step); else h1.textContent = target;
    })(t0);
  }

  /* ---------- tilt for big clickable cards ---------- */
  if (!RM) {
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var el = e.target.closest && e.target.closest('a,button,[role="button"],[role="link"]');
      if (!el || el.closest('.cc-top,.cc-bottom,.mb-board,.mb-fab,.mtv-ui,.mt-strip,nav')) return;
      if (el.offsetWidth < 150 || el.offsetHeight < 70 || el.offsetWidth > 700) return;
      el.classList.add('mb-tilt');
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'perspective(800px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest && e.target.closest('.mb-tilt');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    }, { passive: true });
  }

  /* ---------- scroll beam + particles ---------- */
  var beam = document.createElement('div'); beam.className = 'mb-beam'; beam.setAttribute('aria-hidden', 'true');
  function onScroll() { var m = document.documentElement.scrollHeight - innerHeight; beam.style.transform = 'scaleX(' + (m > 0 ? Math.min(1, scrollY / m) : 0) + ')'; }
  addEventListener('scroll', onScroll, { passive: true });
  function dust() {
    if (RM) return;
    var cv = document.createElement('canvas'); cv.className = 'mb-dust'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W, H, pts;
    function size() { var r = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
      pts = Array.from({ length: Math.round(W * H / 26000) }, function () { return { x: Math.random() * W, y: Math.random() * H, v: .08 + Math.random() * .28, s: Math.random() * 1.4 + .3, c: NEON[(Math.random() * NEON.length) | 0], p: Math.random() * 6 }; }); }
    size(); addEventListener('resize', size);
    (function loop(t) {
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) { var p = pts[i]; p.y -= p.v; if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
          ctx.globalAlpha = .3 + .4 * Math.abs(Math.sin(t * .0015 + p.p)); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill(); }
      }
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- boot ---------- */
  var pend = 0;
  var mo = new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) { var n = ms[i].target; if (n.closest && n.closest('.mb-board,.mb-fab,.mtv-ui')) continue; break; }
    if (i === ms.length) return;
    if (pend) return; pend = setTimeout(function () { pend = 0; scan(); }, 350);
  });
  function boot() {
    document.body.appendChild(beam); document.body.appendChild(fab); document.body.appendChild(board);
    dust(); scan(); onScroll();   // (title decode removed 11/26: it looked like a glitch on every open)
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open', 'class', 'aria-selected', 'aria-expanded'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.MTBoard = { open: openBoard, close: closeBoard, rescan: scan };
})();
