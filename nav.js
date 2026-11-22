/* Master Trainer: shared list of pages + the switcher bar.
   GOAL is the end goal (FDE Lab). CLASSES are the classes that train you for it.
   To add a class: drop its page next to this file and add one entry to CLASSES. */
(function () {
  'use strict';

  var GOAL = {
    id: 'fde', file: 'fde-lab.html', title: 'FDE Lab', code: 'Forward Deployed Engineer',
    color: '#FFD25A', icon: 'flask',
    blurb: 'Where every class comes together. Hands-on drills in the four lanes of the job: read the code, trace it, write it, teach it back.',
    lanes: ['Software', 'AI engineering', 'Infrastructure', 'Liaison'],
    photo: 'card-fde.jpg',
    old: 'D9bZHRHAJyk2NJHNRMc1eg'
  };

  var CLASSES = [
    { id: 'python', photo: 'card-python.jpg', file: 'python-output.html', title: 'Python Output Trainer', code: 'Intro to Python',
      color: '#FF4FB0', icon: 'code',
      blurb: 'Read code and say what it prints, then write code that prints the right thing. Real Python runs right in the page.',
      feeds: 'Software lane: the code an FDE writes',
      old: 'HePpKipEA5k1q8HB9PkWQA' },
    { id: 'math', photo: 'card-math.jpg', file: 'math-placement.html', title: 'Math Placement Trainer', code: 'Placement test prep',
      color: '#FF9E45', icon: 'calc',
      blurb: 'Study plan, mock test, mixed practice and a cheat sheet to score into College Algebra.',
      feeds: 'The math base for data and AI work',
      old: 'Pc6rLKooeL9LT334W6txSZ' },
    { id: 'business', photo: 'card-business.jpg', file: 'ai-business.html', title: 'AI Business Trainer', code: 'GEB 1432',
      color: '#2FE6C8', icon: 'chart',
      blurb: 'Each chapter in short chunks, memory hooks and flashcards, plus an FDE lens on every chapter.',
      feeds: 'Liaison lane: talking business with clients',
      old: 'Fn2XRT6e2JY39ntV1ERcRz' },
    { id: 'ethics', photo: 'card-ethics.jpg', file: 'ethics-octagon.html', title: 'Ethics Octagon', code: 'PHI 2680 · AI Ethics',
      color: '#6FC3FF', icon: 'scale',
      blurb: 'Every philosopher as a fighter card: signature move, weak spots, and how they fight over AI. Study, then spar.',
      feeds: 'Judgment on responsible AI for client work',
      old: 'ESwqyLzEaLASGgpW4vKMuu' },
    { id: 'english', file: 'english-writing.html', title: 'Writing Room', code: 'ENC 1101 · English Comp',
      color: '#B48CFF', icon: 'pen',
      blurb: 'Thesis, sources, summaries, clean sentences, audience, and MLA. Learn it, drill it, teach it back.',
      feeds: 'Liaison lane: writing clients trust' }
  ];
  var ALL = [GOAL].concat(CLASSES);

  var ICONS = {
    code: '<polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/><line x1="14" y1="4" x2="10" y2="20"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx="1"/><circle cx="9" cy="13.5" r=".6"/><circle cx="12" cy="13.5" r=".6"/><circle cx="15" cy="13.5" r=".6"/><circle cx="9" cy="17.5" r=".6"/><circle cx="12" cy="17.5" r=".6"/><circle cx="15" cy="17.5" r=".6"/>',
    chart: '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/><line x1="3" y1="21" x2="21" y2="21"/>',
    scale: '<line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7 2 14a3.5 3.5 0 0 0 6 0Z"/><path d="M19 7l-3 7a3.5 3.5 0 0 0 6 0Z"/><line x1="8" y1="21" x2="16" y2="21"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><line x1="7.5" y1="14" x2="16.5" y2="14"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'
  };
  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  window.MASTER = { GOAL: GOAL, CLASSES: CLASSES, icon: icon, esc: esc };

  var here = (location.pathname.split('/').pop() || 'index.html');
  var isHub = !ALL.some(function (c) { return c.file === here; });

  /* Links that point at a page in here (its file, or its old standalone link) open in this same artifact. */
  function pageFor(href) {
    if (!href) return null;
    for (var i = 0; i < ALL.length; i++) {
      var c = ALL[i];
      if (href.indexOf(c.old) !== -1) return c;
      var tail = href.split('#')[0].split('?')[0].split('/').pop();
      if (tail === c.file) return c;
    }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.hasAttribute('data-mt-ext')) return;
    var raw = a.getAttribute('href');
    if (raw && raw.charAt(0) === '#') return;
    var c = raw === 'index.html' ? { file: 'index.html' } : pageFor(raw);
    if (!c) return;
    e.preventDefault();
    location.href = c.file;
  }, true);

  if (isHub) return;

  /* ---------- switcher on every trainer page ---------- */
  var css = '' +
    '.mt-strip{position:relative;z-index:40;background:rgba(11,8,34,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid #3A2F6B;' +
      'font:600 13px/1.2 "Atkinson Hyperlegible",system-ui,sans-serif;color:#F8F4FF}' +
    '.mt-row{display:flex;align-items:center;gap:8px;padding:8px max(12px,env(safe-area-inset-left,0px))}' +
    '.mt-row + .mt-row{border-top:1px solid rgba(58,47,107,.7);padding-top:7px;padding-bottom:7px}' +
    '.mt-strip a{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;' +
      'border:1.5px solid #3A2F6B;color:#B9B2DC;white-space:nowrap;transition:border-color .15s,color .15s,box-shadow .15s}' +
    '.mt-strip a:hover,.mt-strip a:focus-visible{color:var(--mt-c,#F8F4FF);border-color:var(--mt-c,#F8F4FF)}' +
    '.mt-strip .mt-home{color:#FF4FB0;border-color:#FF4FB0;box-shadow:0 0 10px rgba(255,79,176,.25);font-family:Archivo,"Arial Black",sans-serif;font-weight:800;letter-spacing:.04em;text-transform:uppercase;font-size:12px}' +
    '.mt-strip .mt-goal{margin-left:auto;color:#FFD25A;border-color:#FFD25A;box-shadow:0 0 12px rgba(255,210,90,.3);font-family:Archivo,"Arial Black",sans-serif;font-weight:800;letter-spacing:.04em;text-transform:uppercase;font-size:12px}' +
    '.mt-strip .mt-goal small{font:600 10px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.12em;color:#0B0822;background:#FFD25A;border-radius:4px;padding:3px 5px}' +
    '.mt-strip .mt-goal.mt-on{background:#FFD25A;color:#0B0822;box-shadow:0 0 18px rgba(255,210,90,.55)}' +
    '.mt-strip .mt-goal.mt-on small{background:#0B0822;color:#FFD25A}' +
    '.mt-strip .mt-on{color:var(--mt-c);border-color:var(--mt-c);box-shadow:0 0 12px color-mix(in srgb,var(--mt-c) 35%,transparent)}' +
    '.mt-strip .mt-lab{font:600 10px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8A80B4;white-space:nowrap}' +
    '.mt-strip .mt-pills{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}' +
    '.mt-strip .mt-pills::-webkit-scrollbar{display:none}' +
    '.mt-fab{all:unset;box-sizing:border-box;position:fixed;z-index:45;left:max(14px,env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));' +
      'display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:999px;background:#151033;border:1.5px solid #FF4FB0;color:#FF4FB0;cursor:pointer;' +
      'font:800 12px/1 Archivo,"Arial Black",sans-serif;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 0 14px rgba(255,79,176,.3);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .2s,transform .2s}' +
    '.mt-fab.mt-show{opacity:1;transform:none;pointer-events:auto}' +
    '.mt-sheet{position:fixed;inset:0;z-index:50;display:none;align-items:flex-end;justify-content:flex-start;background:rgba(11,8,34,.66);padding:14px;padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}' +
    '.mt-sheet.mt-open{display:flex}' +
    '.mt-menu{width:min(340px,100%);max-height:100%;overflow:auto;background:#151033;border:1.5px solid #FF4FB0;border-radius:14px;padding:8px;box-shadow:0 0 22px rgba(255,79,176,.22);font:600 14px/1.25 "Atkinson Hyperlegible",system-ui,sans-serif}' +
    '.mt-menu a{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;color:#F8F4FF;text-decoration:none}' +
    '.mt-menu a:hover,.mt-menu a:focus-visible{background:#1D1644;outline:none}' +
    '.mt-menu a .mt-i{color:var(--mt-c);display:inline-flex}' +
    '.mt-menu a small{display:block;color:#B9B2DC;font-weight:400;font-size:12px}' +
    '.mt-menu a.mt-on{background:#1D1644;box-shadow:inset 3px 0 0 var(--mt-c)}' +
    '.mt-menu .mt-h{font:600 10px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8A80B4;padding:10px 10px 4px}' +
    '@media print{.mt-strip,.mt-fab,.mt-sheet{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var onGoal = GOAL.file === here;
  var strip = document.createElement('nav');
  strip.className = 'mt-strip';
  strip.setAttribute('aria-label', 'Master Trainer');
  strip.innerHTML =
    '<div class="mt-row"><a class="mt-home" href="index.html">' + icon('grid', 15) + 'Master Trainer</a>' +
      '<a class="mt-goal' + (onGoal ? ' mt-on' : '') + '" href="' + GOAL.file + '"' + (onGoal ? ' aria-current="page"' : '') + '><small>End goal</small>' + icon(GOAL.icon, 15) + esc(GOAL.title) + '</a></div>' +
    '<div class="mt-row"><span class="mt-lab">Classes</span><div class="mt-pills">' +
    CLASSES.map(function (c) {
      var on = c.file === here;
      return '<a href="' + c.file + '" style="--mt-c:' + c.color + '"' + (on ? ' class="mt-on" aria-current="page"' : '') + '>' + icon(c.icon, 15) + esc(c.title) + '</a>';
    }).join('') + '</div></div>';
  document.body.insertBefore(strip, document.body.firstChild);
  var pills = strip.querySelector('.mt-pills'), onPill = strip.querySelector('.mt-pills .mt-on');
  if (pills && onPill) pills.scrollLeft = Math.max(0, onPill.offsetLeft - pills.offsetLeft - 8);

  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'mt-fab'; fab.setAttribute('aria-haspopup', 'dialog');
  fab.innerHTML = icon('grid', 15) + 'Menu';
  var sheet = document.createElement('div');
  sheet.className = 'mt-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Switch trainer');
  function item(c, sub) {
    var on = c.file === here;
    return '<a href="' + c.file + '" style="--mt-c:' + c.color + '"' + (on ? ' class="mt-on" aria-current="page"' : '') + '><span class="mt-i">' + icon(c.icon, 20) + '</span><span>' + esc(c.title) + '<small>' + esc(sub) + '</small></span></a>';
  }
  sheet.innerHTML = '<div class="mt-menu"><a href="index.html" style="--mt-c:#FF4FB0"><span class="mt-i">' + icon('home', 20) + '</span><span>Home<small>Back to the Master Trainer home</small></span></a>' +
    '<div class="mt-h">End goal</div>' + item(GOAL, GOAL.code) +
    '<div class="mt-h">Classes that train you for it</div>' + CLASSES.map(function (c) { return item(c, c.code); }).join('') + '</div>';
  document.body.appendChild(fab);
  document.body.appendChild(sheet);
  function closeSheet() { sheet.classList.remove('mt-open'); }
  fab.addEventListener('click', function () { sheet.classList.add('mt-open'); var f = sheet.querySelector('a.mt-on') || sheet.querySelector('a'); if (f) f.focus(); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  function onScroll() { fab.classList.toggle('mt-show', strip.getBoundingClientRect().bottom < 0); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
