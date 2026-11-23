/* Jewlz World read-aloud (11/23/2026). Claude voice when available (tts capability), device voice as backup. Loaded by cc-skin.js on every class trainer.
   - A speaker button on every section heading reads JUST that section (up to the next heading of the same level).
   - Select any word or sentence and tap "Hear it".
   - Player bar: pause / resume, stop, speed, voice.
   - Pronunciation fixes for names and terms the built-in voice gets wrong (PRON below; add more any time).
   Uses the browser's own text-to-speech (speechSynthesis): free, no key, works offline once a voice is installed.
   Settings are saved in this browser only. */
(function () {
  'use strict';
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  if (window.__mtVoice) return; window.__mtVoice = true;
  var synth = window.speechSynthesis;

  /* ---------- pronunciation fixes: [written, spoken, caseSensitive] ---------- */
  var PRON = [
    // AI Ethics: philosophers and their words
    ['Antonio Gramsci', 'antonio grahm-shee'], ['Gramscian', 'grahm-shee-un'], ['Gramsci', 'grahm-shee'],
    ['Bruno Latour', 'brew-no lah-toor'], ['Latour', 'lah-toor'],
    ['Foucauldian', 'foo-koh-dee-un'], ['Michel Foucault', 'mee-shell foo-koh'], ['Foucault', 'foo-koh'],
    ['Ortega y Gasset', 'or-tay-gah ee gah-set'], ['Ortega', 'or-tay-gah'], ['José', 'ho-zay'],
    ['Simone de Beauvoir', 'see-mohn duh bohv-wahr'], ['Beauvoir', 'bohv-wahr'],
    ['Jean-Paul Sartre', 'zhahn-paul sar-truh'], ['Sartre', 'sar-truh'],
    ['Jean-Jacques Rousseau', 'zhahn-zhahk roo-soh'], ['Rousseau', 'roo-soh'],
    ['Friedrich Nietzsche', 'free-drick nee-chuh'], ['Nietzsche', 'nee-chuh'],
    ['Byung-Chul Han', 'byung-chool hahn'], ['Han', 'hahn', true],
    ['Immanuel Kant', 'ih-man-yoo-el kahnt'], ['Kantian', 'kahn-tee-un'], ['Kant', 'kahnt', true],
    ['Ayn Rand', 'ine rand'], ['Descartes', 'day-kart'], ['Aristotelian', 'air-iss-toe-tee-lee-un'],
    ['eudaimonia', 'yoo-dye-moh-nee-uh'], ['phronesis', 'froh-nee-sis'], ['akrasia', 'uh-kray-zhuh'], ['telos', 'tell-oss'],
    ['hegemonic', 'heh-juh-mon-ick'], ['hegemony', 'hih-jem-uh-nee'], ['hegemon', 'heh-juh-mon'],
    ['epistemes', 'ep-ih-steemz'], ['episteme', 'ep-ih-steem'],
    ['Übermensch', 'oo-ber-mensh'], ['Ubermensch', 'oo-ber-mensh'], ['amor fati', 'ah-mor fah-tee'],
    ['ressentiment', 'ruh-sahn-tee-mahn'], ['Zarathustra', 'zah-rah-toos-trah'],
    ['cui bono', 'kwee boh-noh'], ['Kuhn', 'koon'], ['Lanier', 'luh-neer'], ['Partovi', 'par-toh-vee'],
    ['Zhuangzi', 'jwahng-dzuh'], ['Luhmann', 'loo-mahn'], ['Heidegger', 'hye-deg-er'], ['Habermas', 'hah-ber-mahss'],
    ['Harari', 'hah-rah-ree'], ['Kundera', 'koon-deh-rah'], ['Oedipus', 'ed-ih-pus'], ['Vaihinger', 'vye-hing-er'],
    ['Vichy', 'vee-shee'], ['Juvenal', 'joo-vuh-nul'], ['Pasteur', 'pass-tur'], ['Gaia', 'guy-uh'],
    ['Königsberg', 'kur-nigs-berg'], ['Röcken', 'rur-ken'], ['agrégation', 'ah-gray-gah-syon'], ['Panthéon', 'pahn-tay-ohn'],
    ['Collège de France', 'koh-lezh duh frahnss'], ['Poitiers', 'pwah-tyay'], ['Les Mots et les choses', 'lay moh ay lay shohz'],
    ['Wyckoff', 'wy-koff'], ['Raschke', 'rash-kee'],
    // AI Business + FDE
    ['PostgreSQL', 'post-gress'], ['MySQL', 'my sequel'], ['SQLite', 'sequel light'], ['SQL', 'sequel', true],
    ['JSON', 'jay-son', true], ['YAML', 'yam-ul', true], ['SaaS', 'sass', true], ['PaaS', 'pass', true],
    ['B2B', 'B to B', true], ['B2C', 'B to C', true], ['FINRA', 'fin-ruh', true], ['OSHA', 'oh-shuh', true], ['IKEA', 'eye-kee-uh', true],
    ['Lütke', 'loot-kee'], ['nginx', 'engine x'], ['kubectl', 'cube control'], ['PyPI', 'pie p i'], ['regex', 'rej-ex'],
    // Python
    ['stdout', 'standard out'], ['stdin', 'standard in'], ['stderr', 'standard error'], ['elif', 'el-if', true],
    ['kwargs', 'keyword args'], ['__init__', 'dunder init'], ['__name__', 'dunder name'], ['__main__', 'dunder main'],
    ['repr', 'repper', true], ['str', 'string', true], ['dict', 'dict', true],
    // Writing
    ['et al.', 'et all'], ['e.g.', 'for example'], ['i.e.', 'that is'], ['etc.', 'etcetera'], ['vs.', 'versus'], ['Prof.', 'Professor', true]
  ];
  var SYMBOLS = [
    [/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ''],
    [/²/g, ' squared'], [/³/g, ' cubed'], [/√/g, ' square root of '], [/≤/g, ' less than or equal to '], [/≥/g, ' greater than or equal to '],
    [/≠/g, ' is not '], [/±/g, ' plus or minus '], [/÷/g, ' divided by '], [/×/g, ' times '], [/π/g, ' pi '], [/≈/g, ' about '],
    [/°F/g, ' degrees Fahrenheit'], [/°/g, ' degrees'], [/→/g, ', then, '], [/←/g, ', from, '], [/⇒/g, ', so, '],
    [/==/g, ' equals equals '], [/!=/g, ' not equal to '], [/<=/g, ' less than or equal to '], [/>=/g, ' greater than or equal to '],
    [/\+=/g, ' plus equals '], [/-=/g, ' minus equals '], [/\s&\s/g, ' and '], [/\s·\s/g, ', '], [/\bw\/\s/g, 'with '],
    [/(\d)\s?–\s?(\d)/g, '$1 to $2'], [/\s[–—]\s/g, ', ']
  ];
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var RULES = PRON.map(function (p) {
    return { re: new RegExp('(^|[^\\p{L}\\p{N}_])' + escRe(p[0]) + '(?=$|[^\\p{L}\\p{N}_])', p[2] ? 'gu' : 'giu'), to: p[1] };
  });
  function speakable(t) {
    SYMBOLS.forEach(function (s) { t = t.replace(s[0], s[1]); });
    RULES.forEach(function (r) { t = t.replace(r.re, function (m, pre) { return pre + r.to; }); });
    return t.replace(/\s+/g, ' ').replace(/\s+,/g, ',').replace(/,\s*([.!?])/g, '$1').replace(/,\s*,/g, ',').trim();
  }

  /* ---------- settings (this browser only) ---------- */
  var KEY = 'mt.voice';
  var S = { rate: 1, voice: '' };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || '{}'); if (saved && typeof saved === 'object') { if (saved.rate) S.rate = +saved.rate; if (saved.voice) S.voice = String(saved.voice); } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var RATES = [0.75, 1, 1.25, 1.5];
  var voices = [];
  function englishVoices() { return voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); }); }
  function pickVoice() {
    var en = englishVoices();
    if (S.voice && !/^(claude|device):/.test(S.voice)) { var m = voices.filter(function (v) { return v.name === S.voice; })[0]; if (m) return m; }
    var pref = [/natural/i, /google us english/i, /samantha/i, /enhanced|premium/i, /en-us/i];
    for (var i = 0; i < pref.length; i++) { var hit = en.filter(function (v) { return pref[i].test(v.name) || pref[i].test(v.lang); })[0]; if (hit) return hit; }
    return en[0] || null;
  }
  function loadVoices() { voices = synth.getVoices() || []; if (typeof fillVoices === 'function' && voiceSel) fillVoices(); }

  /* ---------- styles ---------- */
  var css = '' +
    '.mtv-btn{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;margin-left:10px;vertical-align:middle;flex:none;' +
      'border-radius:50%;border:1.5px solid var(--cc-main,#FF4FB0);color:var(--cc-main,#FF4FB0);background:rgba(11,8,34,.55);cursor:pointer;box-shadow:0 0 10px color-mix(in srgb,var(--cc-main,#FF4FB0) 30%,transparent);' +
      'font-size:0;line-height:0;letter-spacing:0;text-transform:none;transition:background .15s,color .15s,box-shadow .15s}' +
    '.mtv-btn svg{width:16px;height:16px}' +
    '.mtv-btn:hover,.mtv-btn:focus-visible{background:color-mix(in srgb,var(--cc-main,#FF4FB0) 22%,rgba(11,8,34,.6))}' +
    '.mtv-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.mtv-btn[aria-pressed="true"]{background:var(--cc-main,#FF4FB0);color:#0B0822;box-shadow:0 0 16px var(--cc-main,#FF4FB0)}' +
    '.mtv-host{position:relative}' +
    '.mtv-btn.mtv-corner{position:absolute;top:8px;right:8px;margin:0;z-index:3;width:28px;height:28px}' +
    '.mtv-reading{outline:2px dashed var(--cc-main,#FF4FB0)!important;outline-offset:5px;border-radius:10px}' +
    '.mtv-player{position:fixed;z-index:60;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));width:min(600px,calc(100% - 24px));' +
      'display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;' +
      'background:linear-gradient(180deg,rgba(29,22,68,.97),rgba(21,16,51,.97));border:1.5px solid var(--cc-main,#FF4FB0);color:#F8F4FF;' +
      'box-shadow:0 0 26px color-mix(in srgb,var(--cc-main,#FF4FB0) 40%,transparent),0 10px 30px rgba(5,3,20,.6);font:500 14px/1.3 var(--cc-ui,"Exo 2",system-ui,sans-serif)}' +
    '.mtv-player[hidden],.mtv-voices[hidden],.mtv-sel[hidden]{display:none!important}' +
    '.mtv-eq{display:flex;align-items:flex-end;gap:3px;height:22px;width:22px;color:var(--cc-main,#FF4FB0)}' +
    '.mtv-eq i{flex:1;background:currentColor;border-radius:2px;height:30%;box-shadow:0 0 6px currentColor;animation:mtv-eq 0.9s ease-in-out infinite}' +
    '.mtv-eq i:nth-child(2){animation-delay:.2s}.mtv-eq i:nth-child(3){animation-delay:.4s}' +
    '.mtv-player.paused .mtv-eq i{animation-play-state:paused}' +
    '@keyframes mtv-eq{0%,100%{height:25%}50%{height:100%}}' +
    '.mtv-what{min-width:0}' +
    '.mtv-what small{display:block;font:700 9.5px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:var(--cc-alt2,#2FE6C8)}' +
    '.mtv-what b{display:block;margin-top:4px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.mtv-note{display:block;margin-top:3px;font-style:normal;font-size:12px;color:var(--cc-alt1,#FFD25A)}.mtv-note[hidden]{display:none}' +
    '.mtv-ctl{display:flex;align-items:center;gap:6px}' +
    '.mtv-c{all:unset;box-sizing:border-box;cursor:pointer;height:36px;min-width:36px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;gap:5px;border-radius:9px;' +
      'border:1px solid #3A2F6B;background:rgba(11,8,34,.7);color:#F8F4FF;font:700 12px/1 var(--cc-mono,"JetBrains Mono",ui-monospace,monospace)}' +
    '.mtv-c svg{width:16px;height:16px}' +
    '.mtv-c:hover,.mtv-c:focus-visible{border-color:var(--cc-main,#FF4FB0);color:var(--cc-main,#FF4FB0)}' +
    '.mtv-c:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.mtv-c.play{background:var(--cc-main,#FF4FB0);border-color:var(--cc-main,#FF4FB0);color:#0B0822}' +
    '.mtv-voices{grid-column:1/-1;display:grid;gap:6px;padding-top:8px;border-top:1px dashed #3A2F6B}' +
    '.mtv-voices label{font:700 9.5px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:#C4BDE6}' +
    '.mtv-voices select{font:500 15px/1.2 var(--cc-ui,system-ui,sans-serif);color:#F8F4FF;background:#0B0822;border:1px solid #3A2F6B;border-radius:8px;padding:8px;max-width:100%}' +
    '.mtv-voices p{margin:0;font-size:12.5px;color:#C4BDE6}' +
    '.mtv-sel{all:unset;box-sizing:border-box;position:fixed;z-index:61;display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:999px;cursor:pointer;' +
      'background:var(--cc-main,#FF4FB0);color:#0B0822;font:800 12px/1 var(--cc-head,"Orbitron",system-ui,sans-serif);letter-spacing:.08em;text-transform:uppercase;' +
      'box-shadow:0 0 18px color-mix(in srgb,var(--cc-main,#FF4FB0) 60%,transparent),0 6px 18px rgba(5,3,20,.6)}' +
    '.mtv-sel svg{width:15px;height:15px}' +
    '.mtv-sel:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '@media (max-width:680px){.mtv-player{bottom:calc(124px + env(safe-area-inset-bottom,0px));grid-template-columns:auto minmax(0,1fr);}.mtv-ctl{grid-column:1/-1;justify-content:space-between}.mtv-c{flex:1}}' +
    '@media (prefers-reduced-motion:reduce){.mtv-eq i{animation:none;height:60%}}' +
    '@media print{.mtv-btn,.mtv-player,.mtv-sel{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var SVG = {
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="11 7 6 12 11 17"/><polyline points="18 7 13 12 18 17"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>'
  };

  /* ---------- Claude voice (the same voices as the Claude app's read-aloud) ----------
     Works where the page is opened on claude.ai in Chrome/Edge or the Claude desktop app's main window.
     Anywhere else (the phone app copy, Safari, the Claude mobile app) it falls back to the device voices. */
  var CT = null, ctOff = false, ctNote = '';
  var CT_VOICES = [['buttery', 'Buttery (default)'], ['airy', 'Airy'], ['glassy', 'Glassy'], ['rounded', 'Rounded']];
  function useClaude() { return !!CT && !ctOff && (!S.voice || S.voice.indexOf('claude:') === 0); }
  function ctVoice() { var v = (S.voice || '').split(':')[1]; return CT_VOICES.some(function (x) { return x[0] === v; }) ? v : 'buttery'; }
  if (window.claude && typeof window.claude.use === 'function') {
    Promise.resolve(window.claude.use('tts')).then(function (t) {
      if (!t) return;
      CT = t;
      try { t.onState(onCtState); } catch (e) {}
      try { t.onLine(function (e) { if (state.engine === 'claude') state.i = state.base + e.line; }); } catch (e) {}
      if (t.setRate) t.setRate(S.rate).catch(function () {});
      fillVoices(); paintEngine();
    }).catch(function () {});
  }

  /* ---------- player bar ---------- */
  var bar = document.createElement('div');
  bar.className = 'mtv-player mtv-ui'; bar.hidden = true;
  bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Read aloud');
  bar.innerHTML =
    '<span class="mtv-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span class="mtv-what"><small>Reading aloud</small><b></b><em class="mtv-note" hidden></em></span>' +
    '<span class="mtv-ctl">' +
      '<button type="button" class="mtv-c" data-a="back" aria-label="Back one part">' + SVG.back + '</button>' +
      '<button type="button" class="mtv-c play" data-a="pause" aria-label="Pause">' + SVG.pause + '</button>' +
      '<button type="button" class="mtv-c" data-a="stop" aria-label="Stop">' + SVG.stop + '</button>' +
      '<button type="button" class="mtv-c" data-a="rate" aria-label="Speed"></button>' +
      '<button type="button" class="mtv-c" data-a="voice" aria-label="Choose voice" aria-expanded="false">' + SVG.gear + '</button>' +
    '</span>' +
    '<div class="mtv-voices" hidden><label for="mtv-voice">Voice</label><select id="mtv-voice"></select>' +
      '<p class="mtv-vhelp"></p></div>';
  document.body.appendChild(bar);
  var whatEl = bar.querySelector('.mtv-what b'), engEl = bar.querySelector('.mtv-what small'), noteEl = bar.querySelector('.mtv-note');
  var pauseBtn = bar.querySelector('[data-a="pause"]'), rateBtn = bar.querySelector('[data-a="rate"]');
  var voicePanel = bar.querySelector('.mtv-voices'), voiceSel = bar.querySelector('#mtv-voice'), voiceBtn = bar.querySelector('[data-a="voice"]'), vhelp = bar.querySelector('.mtv-vhelp');
  function paintRate() { rateBtn.textContent = S.rate + 'x'; rateBtn.setAttribute('aria-label', 'Speed ' + S.rate + 'x. Tap to change'); }
  paintRate();
  function paintEngine() {
    engEl.textContent = useClaude() ? 'Reading aloud · Claude voice' : 'Reading aloud · device voice';
    vhelp.textContent = CT && !ctOff
      ? 'Claude voices sound the most natural. Device voices come from your phone or computer.'
      : 'Claude voices work when this page is open on claude.ai in Chrome or Edge, or in the Claude desktop app. Here you get your device’s voices.';
  }
  function note(t) { noteEl.textContent = t || ''; noteEl.hidden = !t; }
  function opt(v, label, sel) { return '<option value="' + v.replace(/"/g, '&quot;') + '"' + (sel ? ' selected' : '') + '>' + label.replace(/</g, '&lt;') + '</option>'; }
  function fillVoices() {
    var en = englishVoices(), cur = pickVoice(), html = '';
    if (CT && !ctOff) html += '<optgroup label="Claude voices">' + CT_VOICES.map(function (x) { return opt('claude:' + x[0], x[1], useClaude() && ctVoice() === x[0]); }).join('') + '</optgroup>';
    html += '<optgroup label="This device">' + (en.length ? en.map(function (v) { return opt(v.name, v.name + ' (' + v.lang + ')', !useClaude() && cur && v.name === cur.name); }).join('') : opt('device:', 'Default voice', !useClaude())) + '</optgroup>';
    voiceSel.innerHTML = html;
  }
  voiceSel.addEventListener('change', function () {
    S.voice = voiceSel.value === 'device:' ? '' : voiceSel.value; if (voiceSel.value === 'device:') S.voice = 'device:'; save(); paintEngine();
    if (state.on && state.engine === 'device' && !useClaude()) restartChunk();
    else if (state.on) note('New voice starts with the next section.');
  });

  /* ---------- the reader ---------- */
  var state = { on: false, paused: false, chunks: [], i: 0, base: 0, token: 0, btn: null, scope: null, engine: 'device' };
  function chunk(text, max) {
    max = max || 240;
    var parts = text.split(/(?<=[.!?;:])\s+/), out = [], cur = '';
    parts.forEach(function (p) {
      while (p.length > max) { var cut = p.lastIndexOf(',', max - 20); if (cut < max / 3) cut = p.lastIndexOf(' ', max - 20); if (cut < 40) cut = max - 20; out.push((cur + ' ' + p.slice(0, cut + 1)).trim()); cur = ''; p = p.slice(cut + 1).trim(); }
      if ((cur + ' ' + p).length > max) { if (cur) out.push(cur.trim()); cur = p; } else cur = (cur + ' ' + p).trim();
    });
    if (cur.trim()) out.push(cur.trim());
    return out.filter(function (c) { return /[\p{L}\p{N}]/u.test(c); });
  }
  function speakChunk() {
    if (!state.on || state.paused || state.engine !== 'device') return;
    if (state.i >= state.chunks.length) { stop(); return; }
    var my = state.token, u = new SpeechSynthesisUtterance(state.chunks[state.i]);
    var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
    u.rate = S.rate; u.pitch = 1;
    u.onend = function () { if (my !== state.token) return; state.i++; speakChunk(); };
    u.onerror = function (e) { if (my !== state.token) return; if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; state.i++; speakChunk(); };
    synth.speak(u);
  }
  function restartChunk() { state.token++; synth.cancel(); setTimeout(speakChunk, 60); }
  /* Claude voice: one paragraph per line, up to 100 lines; must start straight from the tap */
  function ctSpeakFrom(i) {
    state.base = i; state.i = i;
    var lines = state.chunks.slice(i).map(function (t, k) { return { text: t, id: 'p' + (i + k) }; });
    CT.speak(lines, { voice: ctVoice(), rate: S.rate, language: 'en' }).catch(ctError);
  }
  function toDevice(why) {
    // keep going from the same spot with the device voice
    var rest = state.chunks.slice(state.i).join(' ');
    state.engine = 'device'; state.chunks = chunk(rest); state.i = 0; state.token++;
    note(why); paintEngine(); engEl.textContent = 'Reading aloud · device voice';
    setTimeout(speakChunk, 60);
  }
  function ctError(e) {
    var c = e && e.code;
    if (!state.on || state.engine !== 'claude') return;
    if (c === 'stopped') return;                     // handled by onState
    if (c === 'not_granted') { ctOff = true; finish(); return; }  // the viewer turned it off: respect that, don't switch voices on our own
    if (c === 'no_gesture') { note('Tap the speaker again to start.'); finish(true); return; }
    if (c === 'busy') { note('Finish dictating first, then tap again.'); finish(true); return; }
    if (c === 'rate_limited') { toDevice('Claude voice needs a short break, so this one uses your device voice.'); return; }
    toDevice('Claude voice had a hiccup, so this one uses your device voice.');
  }
  function onCtState(e) {
    if (state.engine !== 'claude' || !state.on) return;
    if (e.state === 'paused') { state.paused = true; paintPause(); return; }
    if (e.state === 'speaking' || e.state === 'starting') { state.paused = false; paintPause(); return; }
    if (e.state !== 'idle') return;
    var r = e.reason;
    if (r === 'replaced' || r === 'stopped') return;
    if (r === 'not_granted') { ctOff = true; finish(); return; }
    if (r === 'unavailable' || r === 'upstream_error') { if (r === 'unavailable') ctOff = true; toDevice('Claude voice dropped out, so the rest uses your device voice.'); return; }
    if (r === 'rate_limited') { toDevice('Claude voice needs a short break, so the rest uses your device voice.'); return; }
    finish();
  }
  function finish(keepBar) {
    if (state.btn) state.btn.setAttribute('aria-pressed', 'false');
    if (state.scope) state.scope.classList.remove('mtv-reading');
    state.on = false; state.paused = false; state.btn = null; state.scope = null;
    if (!keepBar) { bar.hidden = true; voicePanel.hidden = true; voiceBtn.setAttribute('aria-expanded', 'false'); note(''); }
    paintEngine();
  }
  function start(text, title, btn, scope) {
    var said = speakable(text);
    var claude = useClaude();
    var parts = claude ? chunk(said, 900).slice(0, 100) : chunk(said);
    if (!parts.length) return;
    if (state.on && state.engine === 'device') { state.token++; synth.cancel(); }
    if (state.on && state.engine === 'claude' && !claude && CT) CT.stop().catch(function () {});
    if (state.btn) state.btn.setAttribute('aria-pressed', 'false');
    if (state.scope) state.scope.classList.remove('mtv-reading');
    state = { on: true, paused: false, chunks: parts, i: 0, base: 0, token: state.token + 1, btn: btn || null, scope: scope || null, engine: claude ? 'claude' : 'device' };
    if (btn) btn.setAttribute('aria-pressed', 'true');
    if (scope) scope.classList.add('mtv-reading');
    whatEl.textContent = title || 'Selected text';
    note(''); paintEngine();
    bar.hidden = false; bar.classList.remove('paused'); paintPause();
    if (claude) ctSpeakFrom(0);                      // straight from the tap, as the Claude voice requires
    else { synth.cancel(); setTimeout(speakChunk, 60); }
  }
  function stop(quiet) {
    if (state.engine === 'claude' && CT && state.on) CT.stop().catch(function () {});
    state.token++; synth.cancel();
    if (quiet) { if (state.btn) state.btn.setAttribute('aria-pressed', 'false'); if (state.scope) state.scope.classList.remove('mtv-reading'); state.on = false; return; }
    finish();
  }
  function paintPause() {
    pauseBtn.innerHTML = state.paused ? SVG.play : SVG.pause;
    pauseBtn.setAttribute('aria-label', state.paused ? 'Resume' : 'Pause');
    bar.classList.toggle('paused', state.paused);
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('.mtv-c'); if (!b) return;
    var a = b.dataset.a;
    if (a === 'stop') stop();
    else if (a === 'pause') {
      if (!state.on) return;
      if (state.engine === 'claude') {
        if (state.paused) CT.resume().catch(ctError); else CT.pause().catch(ctError);
        state.paused = !state.paused; paintPause(); return;
      }
      // device voice: pause = cancel and remember the spot (speechSynthesis.pause is unreliable on phones)
      state.paused = !state.paused; paintPause();
      if (state.paused) { state.token++; synth.cancel(); } else { state.token++; speakChunk(); }
    }
    else if (a === 'back') {
      if (!state.on) return;
      state.paused = false; paintPause();
      if (state.engine === 'claude') { ctSpeakFrom(Math.max(0, state.i - 1)); return; }
      state.i = Math.max(0, state.i - 1); restartChunk();
    }
    else if (a === 'rate') {
      S.rate = RATES[(RATES.indexOf(S.rate) + 1) % RATES.length] || 1; save(); paintRate();
      if (CT && CT.setRate) CT.setRate(S.rate).catch(function () {});
      if (state.on && state.engine === 'device' && !state.paused) restartChunk();
    }
    else if (a === 'voice') { voicePanel.hidden = !voicePanel.hidden; b.setAttribute('aria-expanded', String(!voicePanel.hidden)); if (!voicePanel.hidden) { loadVoices(); voiceSel.focus(); } }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.on && state.engine === 'device') stop(); });
  addEventListener('pagehide', function () { synth.cancel(); });
  addEventListener('hashchange', function () { if (state.scope && !state.scope.isConnected) stop(); });

  /* ---------- reading one section ---------- */
  var SKIP = '.cc-top,.cc-bottom,.mt-strip,.mt-sheet,.mt-fab,script,style,noscript,template,svg,canvas,input,textarea,select,button.mtv-btn,.mtv-ui,[aria-hidden="true"],.cc-orb,.sr-only,.sr,.visually-hidden,[role="tablist"],nav';
  var BLOCK = /^(P|LI|DIV|SECTION|ARTICLE|TR|TD|TH|DT|DD|BLOCKQUOTE|H[1-6]|UL|OL|DL|TABLE|HEADER|FOOTER|FIGCAPTION|SUMMARY|DETAILS|BR|HR|LABEL|ASIDE|NAV|FORM|FIELDSET)$/;
  function visible(el) {
    if (el.checkVisibility) return el.checkVisibility({ visibilityProperty: true, opacityProperty: false });
    var cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
  }
  function level(h) { return +h.tagName.charAt(1); }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function headText(h) {
    var c = h.cloneNode(true); c.querySelectorAll(SKIP).forEach(function (x) { x.remove(); });
    return clean(c.textContent);
  }
  /* A heading's section = everything after it up to the next heading of the same or bigger size,
     inside the smallest box that also holds its sibling sections (so it never spills into another part of the page). */
  function scopeOf(h) {
    var L = level(h);
    if (L === 1) return h.closest('header,section,article') || h.parentElement || document.body;
    var sel = []; for (var i = 1; i <= L; i++) sel.push('h' + i);
    sel = sel.join(',');
    for (var el = h.parentElement; el && el !== document.body; el = el.parentElement) {
      if (el.querySelectorAll(sel).length > 1) return el;
    }
    return document.body;
  }
  function sectionText(h) { return walkText(scopeOf(h), h); }
  function blockText(el) { return walkText(el, null); }
  function walkText(scope, h) {
    var L = h ? level(h) : 0, out = h ? [headText(h) + '.'] : [];
    var w = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    function skipSubtree() { while (!w.nextSibling()) { if (!w.parentNode()) return false; } return true; }
    var ok;
    if (h) { w.currentNode = h; ok = skipSubtree(); } else ok = !!w.nextNode();
    while (ok) {
      var n = w.currentNode;
      if (n.nodeType === 3) { if (n.nodeValue.trim()) out.push(n.nodeValue); ok = !!w.nextNode(); continue; }
      if (h && /^H[1-6]$/.test(n.tagName) && level(n) <= L && n !== h) break;
      if (n.matches(SKIP) || !visible(n)) { ok = skipSubtree(); continue; }
      if (n.tagName === 'PRE') { out.push('\n', 'There\'s a code example here on screen.', '\n'); ok = skipSubtree(); continue; }
      if (BLOCK.test(n.tagName) || n.tagName === 'BUTTON' || !/^(inline|contents)$/.test(getComputedStyle(n).display)) out.push('\n');
      ok = !!w.nextNode();
    }
    var text = '', last = '';
    out.forEach(function (p) {
      if (p === '\n') { if (text.trim() && !/[.!?:;,]\s*$/.test(text)) text += '.'; text += ' '; return; }
      text += p; last = p;
    });
    return { text: clean(text).replace(/\s+([.,;:!?])/g, '$1').replace(/,\s*\./g, '.').replace(/([.!?])\.+/g, '$1'), scope: scope };
  }

  /* ---------- speaker buttons on every heading ---------- */
  var NOT_IN = '.cc-top,.cc-bottom,.mt-strip,.mt-sheet,.mtv-ui,a,button,label,[aria-hidden="true"]';
  function addButtons(root) {
    (root || document).querySelectorAll('h1,h2,h3,h4').forEach(function (h) {
      if (h.dataset.mtv || h.closest(NOT_IN)) return;
      var title = headText(h); if (!title) return;
      h.dataset.mtv = '1';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mtv-btn'; b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Read "' + title.slice(0, 60) + '" aloud'); b.title = 'Read this section aloud';
      b.innerHTML = SVG.spk;
      h.appendChild(b);
    });
  }
  /* blocks with no heading of their own (quiz questions, cards, collapsible boxes) get a corner button */
  var BLOCKS = 'section,article,details,.card,.chunk,.q,.qcard,.card-sec,.idea';
  function qualifies(el) {
    if (el.closest(NOT_IN) || el.querySelector('h1,h2,h3,h4') || !visible(el)) return false;
    var t = clean(el.innerText); if (t.length < 120) return false;
    var bt = 0; el.querySelectorAll('button,[role="tab"]').forEach(function (b) { if (!b.querySelector('.ct,.q,p')) bt += clean(b.innerText).length; });
    return bt / t.length < 0.5;
  }
  function addCorners() {
    document.querySelectorAll(BLOCKS).forEach(function (el) {
      if (el.dataset.mtvb) return;
      if (!qualifies(el)) return;
      for (var a = el.parentElement && el.parentElement.closest(BLOCKS); a; a = a.parentElement && a.parentElement.closest(BLOCKS)) { if (a.dataset.mtvb === '1') return; }
      el.dataset.mtvb = '1';
      if (getComputedStyle(el).position === 'static') el.classList.add('mtv-host');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mtv-btn mtv-corner'; b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Read this box aloud'); b.title = 'Read this box aloud';
      b.innerHTML = SVG.spk;
      el.insertBefore(b, el.firstChild);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.mtv-btn'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    if (state.on && state.btn === b) { stop(); return; }
    if (b.classList.contains('mtv-corner')) {
      var box = b.parentElement; if (box.tagName === 'DETAILS') box.open = true;
      var t = blockText(box).text, first = t.split(/[.!?]\s/)[0];
      start(t, first.length > 60 ? first.slice(0, 57) + '…' : first, b, box);
      return;
    }
    var h = b.closest('h1,h2,h3,h4'); if (!h) return;
    var d = h.closest('summary') && h.closest('details'); if (d && !d.open) d.open = true;
    var r = sectionText(h), box = h;
    while (box.parentElement && box.parentElement !== r.scope) box = box.parentElement;
    if (!box.parentElement) box = h;
    start(r.text, headText(h), b, box);
  }, true);
  var pending = 0;
  function scan() { addButtons(); addCorners(); }
  var mo = new MutationObserver(function () { if (pending) return; pending = setTimeout(function () { pending = 0; scan(); }, 200); });
  function boot() { loadVoices(); scan(); mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open', 'aria-expanded', 'aria-selected'] }); }
  if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices); else synth.onvoiceschanged = loadVoices;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  /* ---------- select any text, tap "Hear it" ---------- */
  var chip = document.createElement('button');
  chip.type = 'button'; chip.className = 'mtv-sel mtv-ui'; chip.hidden = true;
  chip.innerHTML = SVG.spk + 'Hear it';
  document.body.appendChild(chip);
  var selText = '';
  function placeChip() {
    var sel = getSelection(), t = sel && sel.rangeCount ? clean(sel.toString()) : '';
    var node = sel && sel.anchorNode, el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (!t || t.length > 1500 || !/[\p{L}\p{N}]/u.test(t) || (el && el.closest('input,textarea,select,.mtv-ui,[contenteditable="true"]'))) { chip.hidden = true; selText = ''; return; }
    var r = sel.getRangeAt(0).getBoundingClientRect(); if (!r || (!r.width && !r.height)) { chip.hidden = true; return; }
    selText = t; chip.hidden = false;
    var cw = chip.offsetWidth || 110, ch = chip.offsetHeight || 36;
    var top = r.bottom + 10; if (top + ch > innerHeight - 140) top = Math.max(8, r.top - ch - 10);
    var left = Math.min(Math.max(8, r.left + r.width / 2 - cw / 2), innerWidth - cw - 8);
    chip.style.top = top + 'px'; chip.style.left = left + 'px';
  }
  var selT = 0;
  document.addEventListener('selectionchange', function () { clearTimeout(selT); selT = setTimeout(placeChip, 220); });
  addEventListener('scroll', function () { if (!chip.hidden) placeChip(); }, { passive: true });
  chip.addEventListener('pointerdown', function (e) { e.preventDefault(); });
  chip.addEventListener('mousedown', function (e) { e.preventDefault(); });
  chip.addEventListener('click', function () {
    if (!selText) return;
    var t = selText; chip.hidden = true;
    start(t, t.length > 60 ? t.slice(0, 57) + '…' : t, null, null);
  });

  window.MTVoice = { speak: function (t, title) { start(String(t), title); }, stop: function () { stop(); }, speakable: speakable };
})();
