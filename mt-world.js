/* Jewlz World · planet worlds for the class trainers (11/27/2026).
   Loaded by cc-skin.js. Each trainer lands on its own world, drawn in code (no images):
     fde      Throneworld Aurex (gold + royal purple capital)   python   Tidehold (teal sea, green cliffs, castle)
     math     Emberdune (amber dunes, spice-blue shimmer)      business Waypoint Prime (ice-blue landing fields)
     ethics   Forgefall (industrial arena, molten orange)      english  Veilhaven (violet vortex, amber desert, the keep)
   Original worlds built on the palettes and moods in the user's theme pack (no franchise names or designs).
   Adds: the world behind the page, a live world panel with clickable lesson markers, an arrival
   sequence when you land from the galaxy, a planet in the hero orb, and Continue / Orbit buttons.
   It only reads each trainer's own saved progress. Trainer content and logic are untouched. */
(function () {
  'use strict';
  var host = document.querySelector('script[src$="cc-skin.js"][data-id]');
  var ID = host && host.dataset.id;
  var WORLDS = {
    fde:      { scene: 'throne', planet: 'sun',    color: '#FFD25A', place: 'Throneworld Aurex', where: 'Capital world · FDE Lab', unitWord: 'Stop', verb: 'Lit', kind: 'sun' },
    python:   { scene: 'tide',   planet: 'ocean',  color: '#FF4FB0', place: 'Tidehold', where: 'Ocean home world · Python Output', unitWord: 'Step', verb: 'Climbed', kind: 'planet' },
    math:     { scene: 'desert', planet: 'desert', color: '#FF9E45', place: 'Emberdune', where: 'Desert world · Math Placement', unitWord: 'Waypoint', verb: 'Reached', kind: 'planet' },
    business: { scene: 'hub',    planet: 'hub',    color: '#2FE6C8', place: 'Waypoint Prime', where: 'Navigator hub · AI Business', unitWord: 'Landing pad', verb: 'Cleared', kind: 'planet' },
    ethics:   { scene: 'forge',  planet: 'forge',  color: '#6FC3FF', place: 'Forgefall', where: 'Arena world · Ethics Octagon', unitWord: 'Bout', verb: 'Won', kind: 'planet' },
    english:  { scene: 'veil',   planet: 'veil',   color: '#B48CFF', place: 'Veilhaven', where: 'Hidden world · Writing Room', unitWord: 'Floor', verb: 'Unlocked', kind: 'planet' }
  };
  var WD = WORLDS[ID]; if (!WD) return;
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE = matchMedia('(pointer:coarse)').matches || innerWidth < 700;
  var DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2);
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function setLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function ss(k, v) { try { if (v === undefined) { var x = sessionStorage.getItem(k); sessionStorage.removeItem(k); return x; } sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------------- math helpers ---------------- */
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function sm(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }
  function noise2(seed) {
    var r = rng(seed), P = new Float32Array(65536); for (var i = 0; i < 65536; i++) P[i] = r();
    function n(x, y) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      var a = P[(xi & 255) | ((yi & 255) << 8)], b = P[((xi + 1) & 255) | ((yi & 255) << 8)], c = P[(xi & 255) | (((yi + 1) & 255) << 8)], d = P[((xi + 1) & 255) | (((yi + 1) & 255) << 8)];
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
    function fbm(x, y, o) { var s = 0, a = .5, t = 0; for (var i = 0; i < (o || 5); i++) { s += a * n(x, y); t += a; x *= 2.03; y *= 2.03; a *= .5; } return s / t; }
    return { n: n, fbm: fbm };
  }
  function perlin(seed) {
    var r = rng(seed), perm = []; for (var i = 0; i < 256; i++) perm[i] = i;
    for (i = 255; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    var p = new Uint8Array(512); for (i = 0; i < 512; i++) p[i] = perm[i & 255];
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); } function L(a, b, t) { return a + t * (b - a); }
    function g(h, x, y, z) { h &= 15; var u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z); return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
    function n(x, y, z) { var fx = Math.floor(x), fy = Math.floor(y), fz = Math.floor(z), X = fx & 255, Y = fy & 255, Z = fz & 255; x -= fx; y -= fy; z -= fz;
      var u = fade(x), v = fade(y), w = fade(z), A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
      return L(L(L(g(p[AA], x, y, z), g(p[BA], x - 1, y, z), u), L(g(p[AB], x, y - 1, z), g(p[BB], x - 1, y - 1, z), u), v), L(L(g(p[AA + 1], x, y, z - 1), g(p[BA + 1], x - 1, y, z - 1), u), L(g(p[AB + 1], x, y - 1, z - 1), g(p[BB + 1], x - 1, y - 1, z - 1), u), v), w); }
    function fbm(x, y, z, o) { var a = .5, f = 1, s = 0, t = 0; for (var i = 0; i < o; i++) { s += a * n(x * f, y * f, z * f); t += a; a *= .5; f *= 2.03; } return s / t; }
    return { n: n, fbm: fbm };
  }

  /* ---------------- canvas helpers ---------------- */
  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function lin(ctx, x0, y0, x1, y1, stops) { var g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
  function glow(ctx, x, y, r, c, a) { if (r <= 0) return; var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, a)); g.addColorStop(.35, rgba(c, a * .35)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function starfield(ctx, W, H, n, seed, maxY, amax) {
    var r = rng(seed);
    for (var i = 0; i < n; i++) { var x = r() * W, y = r() * H * maxY, s = r() < .04 ? 1.6 : .7 + r() * .7, a = (.25 + r() * .75) * amax * (1 - y / (H * maxY) * .6);
      ctx.fillStyle = 'rgba(' + (220 + r() * 35 | 0) + ',' + (225 + r() * 30 | 0) + ',255,' + a + ')'; ctx.fillRect(x, y, s, s); }
  }
  function ridgeFn(seed, freq, oct, sharp) { var N = noise2(seed); return function (x) { var v = N.fbm(x * freq, 3.7, oct || 5); return sharp ? Math.pow(Math.abs(v * 2 - 1), .8) * (v > .5 ? 1 : .7) : v; }; }
  function fillRidge(ctx, W, H, yAt, fill) { ctx.beginPath(); ctx.moveTo(0, H); for (var x = 0; x <= W + 4; x += 3) ctx.lineTo(x, yAt(x)); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  function cloudCanvas(w, h, seed, o) {
    var c = mk(w, h), x = c.getContext('2d'), img = x.createImageData(c.width, c.height), d = img.data, N = noise2(seed);
    var top = hex(o.top), bot = hex(o.bot);
    for (var j = 0; j < c.height; j++) for (var i = 0; i < c.width; i++) {
      var v = N.fbm(i / c.width * o.sx, j / c.height * o.sy, 6), a = sm(o.cov, o.cov + o.soft, v) * (o.fadeY ? sm(0, .25, j / c.height) * sm(1, .7, j / c.height) : 1);
      var col = mix(bot, top, clamp(v * 1.4 - .2 - (j / c.height) * .4 + .3, 0, 1)), k = (j * c.width + i) * 4;
      d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = a * 255 * o.alpha;
    }
    x.putImageData(img, 0, 0); return c;
  }
  function drawWrap(ctx, cv, x, y, w, h) { /* seamless drift: copy + mirrored copy */
    var o = ((x % (w * 2)) + w * 2) % (w * 2);
    ctx.drawImage(cv, o - w * 2, y, w, h); ctx.save(); ctx.translate(o - w, y); ctx.scale(-1, 1); ctx.drawImage(cv, -w, 0, w, h); ctx.restore();
    ctx.drawImage(cv, o, y, w, h); ctx.save(); ctx.translate(o + w, y); ctx.scale(-1, 1); ctx.drawImage(cv, -w, 0, w, h); ctx.restore();
  }
  function particles(n, seed) { var r = rng(seed), a = []; for (var i = 0; i < n; i++) a.push({ x: r(), y: r(), s: r(), p: r() * 6.28 }); return a; }

  /* =====================================================================
     SCENES: each returns { bg (static canvas), draw(ctx, t), marks(n) -> [{x,y}] }
     Original worlds. Palettes and moods follow the user's theme pack.
     ===================================================================== */
  var SCENES = {};
  function moon(c, x, y, r, col, a) {
    var m = mk(r * 2 + 4, r * 2 + 4), mx = m.getContext('2d'), g = mx.createRadialGradient(r * .7, r * .7, r * .1, r + 2, r + 2, r);
    g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(mix(col, [40, 30, 60], .45), a)); mx.fillStyle = g; mx.beginPath(); mx.arc(r + 2, r + 2, r, 0, 6.28); mx.fill();
    mx.globalCompositeOperation = 'destination-out'; mx.fillStyle = 'rgba(0,0,0,.82)'; mx.beginPath(); mx.arc(r + 2 + r * .55, r + 2 + r * .15, r * 1.02, 0, 6.28); mx.fill();
    c.drawImage(m, x - r - 2, y - r - 2); glow(c, x, y, r * 2.2, col, a * .12);
  }
  function polyPath(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return function (f) { var d = f * L[L.length - 1]; for (var i = 1; i < pts.length; i++) if (L[i] >= d) { var k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k }; } return pts[pts.length - 1]; }; }
  function windows(c, x, y, w, h, u, r, col, p) { for (var wy = y + u * .8; wy < y + h - u * .6; wy += u * 1.5) for (var wx = x + u * .5; wx < x + w - u * .5; wx += u * 1.1) if (r() < p) { c.fillStyle = rgba(col, .55 + r() * .4); c.fillRect(wx, wy, u * .42, u * .55); } }

  /* ---------- FDE Lab · Throneworld Aurex: gold + royal purple capital, palace dome, four moons ---------- */
  SCENES.throne = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .6, u = Math.min(W, H * 2.2) / 100, r = rng(201);
    c.fillStyle = lin(c, 0, 0, 0, hz + H * .04, [[0, '#0b0520'], [.34, '#28114c'], [.6, '#5e2a6c'], [.82, '#c46e52'], [1, '#f3c268']]); c.fillRect(0, 0, W, H);
    starfield(c, W, H, MOBILE ? 130 : 280, 203, .42, .75);
    var px = W * .63; glow(c, px, hz, Math.max(W, H) * .6, [255, 196, 120], .42);
    [[.1, .17, .055, '#f2e0bc', .9], [.22, .09, .022, '#d8c6f2', .75], [.84, .13, .038, '#ecd7ae', .8], [.93, .29, .016, '#cbb6ea', .7]].forEach(function (m) { moon(c, W * m[0], H * m[1], H * m[2], hex(m[3]), m[4]); });
    // far skyline in the haze
    for (var x = 0; x < W; x += u * (1.2 + r() * 1.6)) { var bh = H * (.02 + r() * .07) * (1 - Math.abs(x / W - .63) * .8), bw = u * (1 + r() * 2.2);
      c.fillStyle = 'rgba(78,38,92,.9)'; c.fillRect(x, hz - bh, bw, bh); if (r() < .7) { c.fillStyle = 'rgba(255,214,140,.7)'; c.fillRect(x + bw * .4, hz - bh * .7, u * .25, u * .25); } }
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, '#3b1c3e'], [.4, '#21102a'], [1, '#0c0612']]); c.fillRect(0, hz, W, H - hz);
    // the palace: terraces, colonnade, great dome, spires (backlit by the setting sun)
    var pw = Math.min(W * .17, H * .6), base = hz + H * .04, rim = 'rgba(255,206,130,.75)';
    for (var k = 0; k < 3; k++) { var tw = pw * (1.45 - k * .28); c.fillStyle = k ? '#24112c' : '#1b0c22'; c.fillRect(px - tw, base - (k + 1) * H * .03, tw * 2, H * .031); c.fillStyle = 'rgba(255,200,120,.35)'; c.fillRect(px - tw, base - (k + 1) * H * .03, tw * 2, 1); }
    var colY = base - H * .09 - H * .1; c.fillStyle = '#2a1432'; c.fillRect(px - pw * .72, colY, pw * 1.44, H * .1);
    for (var cc = 0; cc < 11; cc++) { c.fillStyle = 'rgba(255,190,110,' + (.18 + r() * .1) + ')'; c.fillRect(px - pw * .68 + cc * pw * .132, colY + H * .012, u * .25, H * .075); }
    c.fillStyle = '#2d1636'; c.beginPath(); c.ellipse(px, colY, pw * .56, H * .17, 0, Math.PI, 0); c.fill();
    c.strokeStyle = rim; c.lineWidth = 1.6; c.beginPath(); c.ellipse(px, colY, pw * .56, H * .17, 0, Math.PI * 1.02, Math.PI * 1.6); c.stroke();
    c.strokeStyle = 'rgba(255,210,140,.22)'; c.lineWidth = 1; for (var rb = 1; rb < 6; rb++) { c.beginPath(); c.ellipse(px, colY, pw * .56 * rb / 6, H * .17, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); }
    var tipY = colY - H * .17; c.fillStyle = '#2d1636'; c.beginPath(); c.moveTo(px - u * .6, tipY); c.lineTo(px, tipY - H * .1); c.lineTo(px + u * .6, tipY); c.fill();
    [-1, 1].forEach(function (s) { [.95, 1.3].forEach(function (d, j) { var sx = px + s * pw * d, sh = H * (.3 - j * .08); c.fillStyle = '#231029'; c.fillRect(sx - u * .9, base - H * .09 - sh, u * 1.8, sh); c.beginPath(); c.moveTo(sx - u * 1.1, base - H * .09 - sh); c.lineTo(sx, base - H * .09 - sh - H * .07); c.lineTo(sx + u * 1.1, base - H * .09 - sh); c.fill();
      c.strokeStyle = rim; c.lineWidth = 1; c.beginPath(); c.moveTo(sx - s * u * .9, base - H * .09); c.lineTo(sx - s * u * .9, base - H * .09 - sh); c.stroke(); windows(c, sx - u * .6, base - H * .09 - sh, u * 1.2, sh, u * .8, r, [255, 210, 140], .35); }); });
    // the boulevard to the palace, lamps and statues on both sides
    var B = function (t) { var g = Math.pow(t, .9); return { x: W * .34 + (px - W * .34) * g, y: H * 1.02 + (base - H * 1.02) * g, hw: W * .17 + (pw * .1 - W * .17) * g }; };
    c.beginPath(); for (var i = 0; i <= 40; i++) { var p = B(i / 40); i ? c.lineTo(p.x - p.hw, p.y) : c.moveTo(p.x - p.hw, p.y); } for (i = 40; i >= 0; i--) { p = B(i / 40); c.lineTo(p.x + p.hw, p.y); } c.closePath();
    c.fillStyle = lin(c, 0, base, 0, H, [[0, '#5a2f4a'], [1, '#2a1426']]); c.fill();
    for (i = 1; i < 24; i++) { p = B(i / 24); var s2 = 1 - Math.pow(i / 24, .9) * .85; [-1, 1].forEach(function (s) { var lx = p.x + s * p.hw * 1.08; c.fillStyle = '#1a0b1e'; c.fillRect(lx - u * .25 * s2, p.y - u * 3 * s2, u * .5 * s2, u * 3 * s2); glow(c, lx, p.y - u * 3.2 * s2, u * 1.6 * s2, [255, 205, 130], .85); }); }
    var dust = particles(MOBILE ? 50 : 110, 205), ships = particles(6, 207);
    return { bg: bg, ringAt: function (f) { var q = B(.04 + f * .9); return { x: q.x, y: q.y - u * 1.4 }; },
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        var b = .55 + .45 * Math.sin(t * 1.4); glow(x, px, tipY - H * .1, u * (4 + b * 3), [255, 214, 140], .5 + b * .3);
        ships.forEach(function (q, i) { var ph = (t * (.01 + q.s * .012) + q.x) % 1, sx = W * (1.1 - ph * 1.25), sy = H * (.14 + q.y * .3); glow(x, sx, sy, u * 1.1, i % 2 ? [255, 214, 150] : [200, 170, 255], .9); x.fillStyle = 'rgba(255,240,220,.9)'; x.fillRect(sx, sy, 1.5, 1.5); });
        x.fillStyle = 'rgba(255,214,150,1)';
        dust.forEach(function (q) { var dx = ((q.x * W + Math.sin(t * .2 + q.p) * 18 + t * 5) % W + W) % W, dy = hz - H * .1 + q.y * H * .5 + Math.sin(t * .4 + q.p) * 6; x.globalAlpha = .12 + q.s * .35; x.fillRect(dx, dy, 1.3, 1.3); });
        x.globalAlpha = 1;
      },
      marks: function (n) { var a = []; for (var i = 0; i < n; i++) { var q = B(n === 1 ? .5 : .04 + i / (n - 1) * .9); a.push({ x: q.x, y: q.y - u * .6 }); } return a; } };
  };

  /* ---------- Python · Tidehold: teal sea, forest-green cliffs, castle above the waves, rain ---------- */
  SCENES.tide = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .56, u = Math.min(W, H * 2.2) / 100, r = rng(301);
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, '#071419'], [.45, '#15303a'], [.85, '#3f6b6c'], [1, '#6c9790']]); c.fillRect(0, 0, W, H);
    glow(c, W * .28, hz - H * .08, Math.max(W, H) * .4, [190, 230, 220], .22);
    var fh = ridgeFn(303, 2.6 / W, 4); fillRidge(c, W, H, function (x) { return x > W * .55 ? H : hz - fh(x) * H * .06; }, 'rgba(20,48,50,.9)');
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, '#2a5a5c'], [.25, '#123c42'], [1, '#04161a']]); c.fillRect(0, hz, W, H - hz);
    c.strokeStyle = 'rgba(190,235,225,.16)'; c.lineWidth = 1;
    for (var w = 0; w < 160; w++) { var wy = hz + Math.pow(r(), 1.6) * (H - hz), wl = u * (2 + (wy - hz) / (H - hz) * 9) * (.5 + r()), wx = r() * W; c.beginPath(); c.moveTo(wx, wy); c.quadraticCurveTo(wx + wl * .5, wy - 1.5, wx + wl, wy); c.stroke(); }
    // the cliff headland
    var cliff = [], N = noise2(305); cliff.push({ x: W * .5, y: H });
    for (var k = 0; k <= 40; k++) { var f = k / 40, cx = W * (.5 + f * .2), cy = H - f * (H - H * .3) + N.fbm(f * 6, 1, 4) * H * .05; cliff.push({ x: cx + N.fbm(f * 9, 2, 3) * W * .02, y: cy }); }
    for (k = 0; k <= 20; k++) cliff.push({ x: W * (.7 + k / 20 * .32), y: H * .3 - N.fbm(k * .4, 3, 3) * H * .04 });
    cliff.push({ x: W * 1.02, y: H });
    c.beginPath(); cliff.forEach(function (p, i) { i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); }); c.closePath();
    c.fillStyle = lin(c, W * .5, 0, W, 0, [[0, '#0a1715'], [.4, '#13241f'], [1, '#0d1a17']]); c.fill();
    c.save(); c.clip(); for (var s = 0; s < 30; s++) { var sy = H * .32 + r() * H * .68; c.strokeStyle = 'rgba(120,160,140,' + (.04 + r() * .06) + ')'; c.lineWidth = 1; c.beginPath(); c.moveTo(W * .5, sy); c.lineTo(W, sy - H * .05 + r() * H * .1); c.stroke(); }
    c.fillStyle = lin(c, 0, H * .24, 0, H * .36, [[0, '#3f7a3a'], [1, 'rgba(31,74,42,0)']]); c.fillRect(W * .66, H * .2, W * .36, H * .16); c.restore();
    // the castle
    var kx = W * .82, ky = H * .3 - H * .02, cl = [];
    function block(x0, w0, h0, crenel) { c.fillStyle = '#0d1a1c'; c.fillRect(x0, ky - h0, w0, h0); if (crenel) for (var q = 0; q < w0; q += u * 1.1) c.fillRect(x0 + q, ky - h0 - u * .8, u * .6, u * .8); c.strokeStyle = 'rgba(170,220,210,.3)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, ky - h0); c.lineTo(x0, ky); c.stroke(); windows(c, x0, ky - h0, w0, h0, u, r, [255, 208, 138], .3); }
    block(kx - u * 14, u * 28, H * .08, true); block(kx - u * 3.5, u * 7, H * .2, true); block(kx - u * 13, u * 4, H * .13, true); block(kx + u * 9, u * 4, H * .15, true);
    c.fillStyle = '#0d1a1c'; c.beginPath(); c.moveTo(kx - u * 4.2, ky - H * .2); c.lineTo(kx, ky - H * .27); c.lineTo(kx + u * 4.2, ky - H * .2); c.fill();
    // the switchback stair up the cliff
    var pts = [], zig = 9; for (k = 0; k <= zig; k++) { var hy = H * .93 - k / zig * (H * .93 - (ky + u)); var edge = W * (.5 + (1 - (hy - H * .3) / (H * .7)) * .2) + u * 3; pts.push({ x: k % 2 ? edge + W * .09 : edge + u, y: hy }); }
    pts.push({ x: kx - u * 13, y: ky + u * .2 });
    c.strokeStyle = 'rgba(200,225,205,.32)'; c.lineWidth = 1.6; c.setLineDash([3, 3]); c.beginPath(); pts.forEach(function (p, i) { i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); }); c.stroke(); c.setLineDash([]);
    var path = polyPath(pts);
    var clouds = cloudCanvas(300, 80, 307, { sx: 5, sy: 2.2, cov: .38, soft: .3, top: '#7ea3a2', bot: '#0e2428', alpha: .95 });
    var rain = particles(MOBILE ? 90 : 220, 309);
    return { bg: bg,
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        x.globalAlpha = .9; drawWrap(x, clouds, t * 7, -H * .05, W, H * .42); x.globalAlpha = 1;
        var fl = Math.max(0, Math.sin(t * .37) * 40 - 39); if (fl > 0) { x.fillStyle = 'rgba(210,240,255,' + fl * .25 + ')'; x.fillRect(0, 0, W, hz); }
        x.strokeStyle = 'rgba(220,245,240,.85)'; x.lineWidth = 1.2;
        for (var f2 = 0; f2 < 6; f2++) { var fx = W * (.5 + f2 * .035), fy = H * (.95 - f2 * .015), a = .25 + .25 * Math.sin(t * 1.6 + f2 * 2); x.globalAlpha = a; x.beginPath(); x.arc(fx, fy, u * (1.5 + Math.sin(t + f2)), Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
        x.globalAlpha = 1; x.strokeStyle = 'rgba(200,230,230,.35)'; x.lineWidth = 1;
        rain.forEach(function (q) { var rx = ((q.x * W + t * 60 * (.6 + q.s)) % (W * 1.1)) - W * .05, ry = ((q.y + t * (.6 + q.s * .5)) % 1) * H; x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - u * .6, ry + u * 2.4); x.stroke(); });
        var b = .5 + .5 * Math.sin(t * 1.8); glow(x, kx, ky - H * .27, u * (3 + b * 2), [255, 208, 138], .4 + b * .3);
      },
      marks: function (n) { var a = []; for (var i = 0; i < n; i++) a.push(path(n === 1 ? .5 : i / (n - 1))); return a; } };
  };

  /* ---------- Math · Emberdune: amber dunes, a hazy sun, spice-blue shimmer in the sand ---------- */
  SCENES.desert = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .6;
    c.fillStyle = lin(c, 0, 0, 0, hz + H * .05, [[0, '#0e1630'], [.38, '#30284a'], [.66, '#a8603e'], [.86, '#e59a62'], [1, '#f4c48c']]); c.fillRect(0, 0, W, H);
    starfield(c, W, H, MOBILE ? 140 : 300, 21, .35, .7);
    var sunX = W * .76, sunY = hz - H * .03;
    glow(c, sunX, sunY, Math.max(W, H) * .5, [255, 190, 130], .5); glow(c, sunX, sunY, H * .12, [255, 236, 205], .9);
    c.fillStyle = '#fff3dc'; c.beginPath(); c.arc(sunX, sunY, H * .035, 0, 6.28); c.fill();
    moon(c, W * .18, H * .15, H * .055, [236, 222, 205], .85); moon(c, W * .3, H * .08, H * .02, [214, 222, 240], .7);
    c.fillStyle = lin(c, 0, hz - H * .1, 0, hz + H * .06, [[0, 'rgba(255,190,140,0)'], [1, 'rgba(255,190,140,.45)']]); c.fillRect(0, hz - H * .1, W, H * .16);
    var mesa = ridgeFn(31, 2.2 / W, 4);
    fillRidge(c, W, H, function (x) { var v = mesa(x); return hz - Math.min(v, .62) * H * .09; }, 'rgba(176,104,66,.8)');
    var ox = W * .36, oy = hz - H * .02, ou = Math.min(W, H * 2.2) / 100, ol = [];
    c.fillStyle = 'rgba(120,70,52,.95)';
    [[-3, 9, 1.2], [-1, 15, 1.6], [1.2, 11, 1.1], [3.4, 7, 1.4], [5.5, 4, 2.2]].forEach(function (b) { c.beginPath(); c.moveTo(ox + b[0] * ou, oy); c.lineTo(ox + b[0] * ou + b[2] * ou * .2, oy - b[1] * ou); c.lineTo(ox + b[0] * ou + b[2] * ou, oy - b[1] * ou * .92); c.lineTo(ox + b[0] * ou + b[2] * ou, oy); c.fill(); ol.push([ox + b[0] * ou + b[2] * ou * .5, oy - b[1] * ou * .8]); });
    ol.forEach(function (p) { glow(c, p[0], p[1], ou * 1.4, [150, 205, 255], .7); });
    function duneLayer(base, amp, f, seed, lit, shade, haze, hazeA) {
      var N = noise2(seed), cv = mk(W, H), x = cv.getContext('2d'), L = hex(lit), S = hex(shade), Z = hex(haze);
      var y = function (px) { var u2 = px * f + seed, tri = Math.abs((u2 % 1 + 1) % 1 - .5) * 2; return base - amp * (.55 * Math.pow(1 - tri, 1.6) + .45 * N.fbm(px * f * .6, 1.3, 4)); };
      for (var px = 0; px < W; px += 2) { var y0 = y(px), sl = y(px + 2) - y0, l = clamp(.5 + sl * 1.4, 0, 1), col = mix(mix(S, L, l), Z, hazeA); x.fillStyle = rgba(col, 1); x.fillRect(px, y0, 2.4, H - y0); }
      x.globalCompositeOperation = 'source-atop'; x.fillStyle = lin(x, 0, base - amp, 0, H, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(30,10,4,.55)']]); x.fillRect(0, 0, W, H);
      c.drawImage(cv, 0, 0); return y;
    }
    duneLayer(hz + H * .07, H * .07, 2.3 / W, 41, '#e3a46e', '#9a5a3a', '#e8a877', .45);
    var yMid = duneLayer(hz + H * .22, H * .11, 1.6 / W, 43, '#e19358', '#7a3b20', '#d88c5c', .15);
    duneLayer(H * 1.04, H * .16, 1.1 / W, 47, '#d9823f', '#4f2312', '#000000', 0);
    c.strokeStyle = 'rgba(70,30,12,.55)'; c.lineWidth = 1.4;
    [0, 5].forEach(function (d) { c.beginPath(); for (var px = 0; px <= W; px += 6) { var py = yMid(px) + 6 + d * .6 + Math.sin(px * .006) * 3; px === 0 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke(); });
    var sand = particles(MOBILE ? 60 : 130, 13), spice = particles(MOBILE ? 40 : 90, 15), dust = cloudCanvas(260, 50, 29, { sx: 6, sy: 2, cov: .48, soft: .2, top: '#ffd3a2', bot: '#e09a62', alpha: .35, fadeY: 1 });
    return { bg: bg,
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        x.globalAlpha = .7; drawWrap(x, dust, t * 9, hz - H * .02, W, H * .2); x.globalAlpha = 1;
        x.strokeStyle = 'rgba(255,214,170,.35)'; x.lineWidth = 1;
        sand.forEach(function (p) { var px = ((p.x + t * (.03 + p.s * .06)) % 1) * W, py = hz + p.y * (H - hz); x.globalAlpha = .15 + p.s * .3; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 6 + p.s * 14, py - 1); x.stroke(); });
        x.globalCompositeOperation = 'lighter';
        spice.forEach(function (p) { var tw = Math.max(0, Math.sin(t * (1 + p.s * 2) + p.p * 9)); if (tw < .5) return; var px = ((p.x + t * .01) % 1) * W, py = hz + H * .06 + p.y * (H - hz - H * .06); x.globalAlpha = (tw - .5) * 1.4; glow(x, px, py, 3 + p.s * 4, [120, 190, 255], .9); });
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
      },
      marks: function (n) { var a = []; for (var i = 0; i < n; i++) { var px = W * (.05 + (n === 1 ? .45 : i / (n - 1) * .9)); a.push({ x: px, y: yMid(px) + 2 }); } return a; } };
  };

  /* ---------- AI Business · Waypoint Prime: ice-blue landing fields, giant freighters, the hub everything passes through ---------- */
  SCENES.hub = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .5, u = Math.min(W, H * 2.2) / 100, r = rng(401);
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, '#01040b'], [.5, '#06142a'], [.85, '#1a3754'], [1, '#4a7393']]); c.fillRect(0, 0, W, H);
    starfield(c, W, H, MOBILE ? 180 : 380, 403, .8, .9);
    var gx = W * .86, gy = -H * .55, gr = H * .95; c.save(); c.beginPath(); c.arc(gx, gy, gr, 0, 6.28); c.clip();
    c.fillStyle = lin(c, gx - gr, gy + gr * .6, gx, gy + gr, [[0, '#cfe4f4'], [1, '#2b4a68']]); c.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
    var gb = cloudCanvas(260, 100, 405, { sx: 3, sy: 9, cov: .4, soft: .4, top: '#f3fbff', bot: '#4d7393', alpha: .5 }); c.drawImage(gb, gx - gr, gy, gr * 2, gr); c.restore();
    glow(c, gx - gr * .35, gy + gr * .9, gr * .5, [190, 225, 255], .25);
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, '#132638'], [.3, '#0a1724'], [1, '#02070c']]); c.fillRect(0, hz, W, H - hz);
    // perspective grid of the landing field
    var vx = W * .5, vy = hz - H * .04; c.strokeStyle = 'rgba(150,205,255,.14)'; c.lineWidth = 1;
    for (var gxl = -24; gxl <= 24; gxl++) { var bx = vx + gxl * W * .08; c.beginPath(); c.moveTo(vx + (bx - vx) * .06, hz + 2); c.lineTo(bx, H); c.stroke(); }
    for (var k = 1; k < 16; k++) { var yy = hz + (H - hz) * Math.pow(k / 16, 2.1); c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke(); }
    // giant freighters resting on the field
    function freighter(cx, cy, len, ht) { c.fillStyle = '#0b1622'; c.beginPath(); c.ellipse(cx, cy, len / 2, ht / 2, 0, 0, 6.28); c.fill();
      c.fillStyle = lin(c, 0, cy - ht / 2, 0, cy + ht / 2, [[0, 'rgba(200,230,255,.25)'], [.4, 'rgba(200,230,255,0)']]); c.beginPath(); c.ellipse(cx, cy, len / 2, ht / 2, 0, Math.PI, 0); c.fill();
      for (var q = -len * .42; q < len * .42; q += u * .9) if (r() < .55) { c.fillStyle = 'rgba(225,242,255,' + (.4 + r() * .5) + ')'; c.fillRect(cx + q, cy - ht * .05, u * .35, u * .22); } }
    freighter(W * .2, hz + H * .02, W * .34, H * .07); freighter(W * .74, hz + H * .035, W * .3, H * .06);
    for (var g = 0; g < 7; g++) { var tx = W * (.06 + g * .15 + r() * .04), th = H * (.08 + r() * .1); c.fillStyle = '#08121c'; c.fillRect(tx, hz + H * .03 - th, u * .7, th); c.fillRect(tx - u * 2, hz + H * .03 - th, u * 4.5, u * .5); }
    // landing pads (the markers sit on these)
    function pad(i, n) { var back = i < Math.ceil(n / 2), row = back ? i : i - Math.ceil(n / 2), cnt = back ? Math.ceil(n / 2) : n - Math.ceil(n / 2), depth = back ? .36 : .72, yy2 = hz + (H - hz) * depth, spread = (back ? .62 : .86) * W, x0 = vx - spread / 2 + spread * (cnt === 1 ? .5 : row / (cnt - 1));
      return { x: x0, y: yy2, rx: u * (back ? 4 : 6.5), ry: u * (back ? 1 : 1.6) }; }
    var hover = { x: W * .38, y: H * .2 }, padN = 8;
    return { bg: bg,
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        for (var pi = 0; pi < padN; pi++) { var pp = pad(pi, padN), pl = .35 + .25 * Math.sin(t * 2 + pi); x.strokeStyle = 'rgba(160,215,255,' + pl + ')'; x.lineWidth = 1.2; x.beginPath(); x.ellipse(pp.x, pp.y, pp.rx, pp.ry, 0, 0, 6.28); x.stroke(); }
        var drift = Math.sin(t * .2) * u; x.save(); x.globalCompositeOperation = 'lighter';
        [-1, 1].forEach(function (s, i) { var a = .1 + .05 * Math.sin(t * 1.3 + i); x.fillStyle = lin(x, 0, hover.y, 0, H, [[0, 'rgba(200,235,255,' + a + ')'], [1, 'rgba(200,235,255,0)']]); x.beginPath(); x.moveTo(hover.x + s * u * 6 + drift, hover.y + H * .03); x.lineTo(hover.x + s * u * 30 + drift + Math.sin(t * .4 + i) * u * 6, H); x.lineTo(hover.x + s * u * 10 + drift, H); x.closePath(); x.fill(); });
        x.restore();
        x.fillStyle = '#0a1520'; x.beginPath(); x.ellipse(hover.x + drift, hover.y, W * .16, H * .045, -.03, 0, 6.28); x.fill();
        x.fillStyle = 'rgba(210,240,255,.85)'; for (var q = -12; q <= 12; q++) x.fillRect(hover.x + drift + q * W * .011, hover.y + H * .01, 2, 1.6);
        for (var s = 0; s < 5; s++) { var ph = (t * (.04 + s * .01) + s * .23) % 1, sx = W * (.1 + ph * .8), sy = hz - H * .05 - Math.sin(ph * Math.PI) * H * .25; glow(x, sx, sy, u * 1.2, s % 2 ? [255, 255, 255] : [150, 205, 255], .9); }
      },
      marks: function (n) { padN = n || 8; var a = []; for (var i = 0; i < n; i++) { var p = pad(i, n); a.push({ x: p.x, y: p.y }); } return a; } };
  };

  /* ---------- Ethics · Forgefall: white + hot red + molten orange, smokestacks, lava, the arena ---------- */
  SCENES.forge = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .62, u = Math.min(W, H * 2.2) / 100, r = rng(501);
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, '#0b0909'], [.4, '#2a2425'], [.72, '#6e625e'], [.9, '#b9644a'], [1, '#d8462a']]); c.fillRect(0, 0, W, H);
    var ash = cloudCanvas(300, 80, 503, { sx: 5, sy: 2, cov: .4, soft: .35, top: '#d8d2cc', bot: '#3a3232', alpha: .55 }); c.drawImage(ash, 0, H * .08, W, H * .35);
    var vol = ridgeFn(505, 2.1 / W, 5, true), yV = function (x) { return hz - vol(x) * H * .2; };
    fillRidge(c, W, H, yV, '#231a19');
    for (var v = 0; v < 2; v++) { var vx = W * (.18 + v * .6), best = 0, bxv = vx; for (var q = vx - W * .1; q < vx + W * .1; q += 4) if (hz - yV(q) > best) { best = hz - yV(q); bxv = q; } glow(c, bxv, yV(bxv), u * 8, [255, 110, 40], .7); }
    // industrial skyline + smokestacks
    var stacks = [];
    for (var b = 0; b < 26; b++) { var bx = W * (b / 26) + r() * u * 2, bh = H * (.04 + r() * .09), bw = u * (2 + r() * 3); c.fillStyle = '#120d0d'; c.fillRect(bx, hz - bh, bw, bh + 2); windows(c, bx, hz - bh, bw, bh, u * .8, r, [255, 120, 70], .18);
      if (r() < .3) { var sh = H * (.12 + r() * .14); c.fillRect(bx + bw * .4, hz - bh - sh, u * .9, sh); stacks.push({ x: bx + bw * .4 + u * .45, y: hz - bh - sh }); c.fillStyle = 'rgba(255,60,40,.9)'; c.fillRect(bx + bw * .4, hz - bh - sh, u * .9, u * .3); } }
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, '#1d1312'], [1, '#050303']]); c.fillRect(0, hz, W, H - hz);
    // lava rivers
    c.lineCap = 'round';
    var LN = noise2(511);
    for (var l = 0; l < 2; l++) { var ly = hz + H * (.1 + l * .16), x0 = W * (l ? .02 : .3), x1 = W * (l ? .55 : 1.02), pts2 = [];
      for (var lx = x0; lx <= x1; lx += 6) pts2.push([lx, ly + (LN.fbm(lx / W * 3 + l * 7, 1, 5) - .5) * H * .16, .25 + LN.fbm(lx / W * 6 + l * 3, 4, 3) * 1.1]);
      [[9, 'rgba(255,70,20,.16)'], [3.2, 'rgba(255,120,35,.75)'], [1.1, 'rgba(255,215,140,.85)']].forEach(function (st) { c.strokeStyle = st[1];
        for (var i = 1; i < pts2.length; i++) { var w2 = st[0] * pts2[i][2] * (1 + l * .5) * (.6 + .4 * (pts2[i][1] - hz) / (H - hz)); if (w2 < .3) continue; c.lineWidth = w2; c.beginPath(); c.moveTo(pts2[i - 1][0], pts2[i - 1][1]); c.lineTo(pts2[i][0], pts2[i][1]); c.stroke(); } });
      c.fillStyle = 'rgba(20,10,8,.85)'; for (i = 0; i < pts2.length; i += 7) if (LN.n(i * .7, l * 3) > .62) c.fillRect(pts2[i][0], pts2[i][1] - 2, 4 + LN.n(i, 9) * 8, 4); }
    // the arena
    var narrow = W < 700, ax = W * (narrow ? .5 : .56), ay = H * (narrow ? .87 : .8), arx = narrow ? Math.min(W * .37, H * .7) : Math.min(W * .2, H * .62), ary = arx * (narrow ? .27 : .26), wall = H * .08, pts = [];
    for (var i = 0; i < 8; i++) { var a = (i + .5) / 8 * Math.PI * 2; pts.push([ax + Math.cos(a) * arx, ay + Math.sin(a) * ary]); }
    for (i = 0; i < 8; i++) { var p = pts[i], q2 = pts[(i + 1) % 8]; if (p[1] + q2[1] > ay * 2 - ary * .2) { c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q2[0], q2[1]); c.lineTo(q2[0], q2[1] - wall); c.lineTo(p[0], p[1] - wall); c.closePath(); c.fillStyle = '#1a1414'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke(); } }
    c.beginPath(); pts.forEach(function (p, k) { k ? c.lineTo(p[0], p[1] - wall) : c.moveTo(p[0], p[1] - wall); }); c.closePath();
    c.fillStyle = 'rgba(255,70,40,.16)'; c.fill(); c.strokeStyle = 'rgba(255,245,240,.85)'; c.lineWidth = 1.6; c.stroke();
    glow(c, ax, ay - wall, arx * .9, [255, 80, 50], .3);
    var embers = particles(MOBILE ? 70 : 160, 507), smoke = cloudCanvas(120, 120, 509, { sx: 3, sy: 3, cov: .35, soft: .4, top: '#5a5050', bot: '#1a1414', alpha: .7 });
    return { bg: bg,
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        stacks.forEach(function (s, i) { for (var k = 0; k < 3; k++) { var ph = (t * .05 + k / 3 + i * .13) % 1; x.globalAlpha = (1 - ph) * .45; var sz = u * (3 + ph * 14); x.drawImage(smoke, s.x - sz / 2 + ph * u * 20, s.y - ph * H * .25 - sz / 2, sz, sz); } });
        x.globalAlpha = 1; x.save(); x.globalCompositeOperation = 'lighter';
        for (var bm = 0; bm < 4; bm++) { var ang = -Math.PI / 2 + Math.sin(t * .25 + bm * 1.7) * .35, bx = ax + (bm - 1.5) * arx * .5, by = ay - wall; x.fillStyle = lin(x, bx, by, bx + Math.cos(ang) * H, by + Math.sin(ang) * H, [[0, 'rgba(255,250,245,.16)'], [1, 'rgba(255,250,245,0)']]);
          x.beginPath(); x.moveTo(bx - 2, by); x.lineTo(bx + Math.cos(ang - .05) * H * 1.2, by + Math.sin(ang - .05) * H * 1.2); x.lineTo(bx + Math.cos(ang + .05) * H * 1.2, by + Math.sin(ang + .05) * H * 1.2); x.lineTo(bx + 2, by); x.fill(); }
        embers.forEach(function (p) { var ph = (t * (.04 + p.s * .06) + p.y) % 1, ex = p.x * W + Math.sin(t + p.p) * 10, ey = H - ph * H * .9; x.globalAlpha = (1 - ph) * .9; x.fillStyle = 'rgb(255,' + (120 + p.s * 90 | 0) + ',40)'; x.fillRect(ex, ey, 1.2 + p.s * 1.6, 1.2 + p.s * 1.6); });
        x.restore(); x.globalAlpha = 1;
      },
      marks: function (n) { var a = []; for (var i = 0; i < n; i++) { var an = Math.PI * .08 + (n === 1 ? .5 : i / (n - 1)) * Math.PI * 1.84; a.push({ x: ax + Math.cos(an + Math.PI * .5) * arx * 1.06, y: ay - wall + Math.sin(an + Math.PI * .5) * ary * 1.15 }); } return a; } };
  };

  /* ---------- Writing Room · Veilhaven: violet storm vortex, orchard hills, amber desert creeping in, the keep ---------- */
  SCENES.veil = function (W, H) {
    var bg = mk(W, H), c = bg.getContext('2d'), hz = H * .62, u = Math.min(W, H * 2.2) / 100, r = rng(601);
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, '#0d071c'], [.4, '#2b1550'], [.75, '#6a3c86'], [1, '#d39a62']]); c.fillRect(0, 0, W, H);
    starfield(c, W, H, MOBILE ? 80 : 180, 603, .3, .6);
    glow(c, W * .18, hz, Math.max(W, H) * .45, [255, 190, 130], .4);
    // the weather vortex (sisterhood weather control), drawn once and turned slowly
    var vr = Math.min(W * .3, H * .55), V = mk(vr * 2, vr * 2), vx2 = V.getContext('2d'), img = vx2.createImageData(V.width, V.height), d = img.data, N = noise2(605);
    for (var j = 0; j < V.height; j++) for (var i = 0; i < V.width; i++) {
      var dx = (i - V.width / 2) / (V.width / 2), dy = (j - V.height / 2) / (V.height / 2), rr = Math.sqrt(dx * dx + dy * dy); if (rr > 1) continue;
      var an = Math.atan2(dy, dx), s = an + Math.log(rr + .05) * 2.4, val = N.fbm(Math.cos(s) * 2 + 4, Math.sin(s) * 2 + rr * 3, 5), arm = sm(.42, .7, val) * sm(1, .55, rr) * sm(.02, .2, rr);
      var k2 = (j * V.width + i) * 4, col = mix([90, 52, 140], [236, 200, 240], clamp(val * 1.5 - .3, 0, 1)); d[k2] = col[0]; d[k2 + 1] = col[1]; d[k2 + 2] = col[2]; d[k2 + 3] = arm * 220;
    }
    vx2.putImageData(img, 0, 0);
    // terrain: amber desert on the left creeping into dark orchard hills on the right
    var dn = ridgeFn(607, 1.8 / W, 4), hl = ridgeFn(609, 2.6 / W, 5);
    fillRidge(c, W, H, function (x) { return hz - dn(x) * H * .05; }, lin(c, 0, 0, W, 0, [[0, '#c98a52'], [.4, '#a5683e'], [.55, '#4a2c4a'], [1, '#2a1a36']]));
    fillRidge(c, W, H, function (x) { return hz + H * .06 - hl(x) * H * .08 * sm(.35, .7, x / W); }, lin(c, 0, 0, W, 0, [[0, '#b07444'], [.42, '#8a5534'], [.56, '#2a1a30'], [1, '#1c1026']]));
    for (var tr = 0; tr < 70; tr++) { var tx = W * (.5 + r() * .5), ty = hz + H * .05 + r() * H * .3, ts = u * (1 + r() * 1.6) * (.6 + (ty - hz) / (H - hz)); c.fillStyle = 'rgba(' + (16 + r() * 10 | 0) + ',' + (10 + r() * 8 | 0) + ',' + (22 + r() * 10 | 0) + ',.96)'; c.beginPath(); c.ellipse(tx, ty, ts, ts * .8, 0, 0, 6.28); c.fill(); c.fillRect(tx - ts * .08, ty, ts * .16, ts * .9); c.strokeStyle = 'rgba(210,160,230,.10)'; c.lineWidth = 1; c.beginPath(); c.arc(tx, ty, ts, Math.PI * 1.1, Math.PI * 1.45); c.stroke(); }
    c.fillStyle = lin(c, 0, hz + H * .2, 0, H, [[0, 'rgba(10,6,16,0)'], [1, 'rgba(10,6,16,.85)']]); c.fillRect(0, hz + H * .2, W, H);
    // the keep: stacked stone tiers with battlements
    var kx = W * .68, kb = hz + H * .16, floors = [], tiers = 6, th = H * .085;
    c.fillStyle = '#1a0f24'; c.beginPath(); c.moveTo(kx - u * 12, kb + H * .04); c.lineTo(kx + u * 12, kb + H * .04); c.lineTo(kx + u * 8, kb - H * .02); c.lineTo(kx - u * 9, kb - H * .02); c.fill();
    for (var k = 0; k < tiers; k++) { var w = u * (6.5 - k * .55), y = kb - (k + 1) * th; c.fillStyle = k % 2 ? '#22132e' : '#1e1029'; c.fillRect(kx - w, y, w * 2, th);
      for (var q = -w; q < w; q += u * 1.2) c.fillRect(kx + q, y - u * .7, u * .65, u * .7);
      c.strokeStyle = 'rgba(255,196,130,.28)'; c.lineWidth = 1; c.beginPath(); c.moveTo(kx - w, y + th); c.lineTo(kx - w, y); c.stroke();
      windows(c, kx - w, y, w * 2, th, u * .9, r, [255, 196, 120], .4); floors.push({ x: kx + w + u * 1.6, y: y + th * .5 }); }
    var tipY = kb - tiers * th; c.fillStyle = '#1e1029'; c.beginPath(); c.moveTo(kx - u * 3, tipY - u * .7); c.lineTo(kx, tipY - H * .1); c.lineTo(kx + u * 3, tipY - u * .7); c.fill();
    var dust = cloudCanvas(260, 50, 611, { sx: 6, sy: 2, cov: .45, soft: .25, top: '#f0c08a', bot: '#a5683e', alpha: .45, fadeY: 1 });
    return { bg: bg,
      draw: function (x, t) {
        x.drawImage(bg, 0, 0, W, H);
        x.save(); x.translate(W * .3, H * .18); x.rotate(t * .025); x.globalAlpha = .85; x.drawImage(V, -vr, -vr); x.restore(); x.globalAlpha = 1;
        var lf = Math.max(0, Math.sin(t * .53) * 30 - 29); if (lf > 0) glow(x, W * .3, H * .18, vr * .5, [230, 210, 255], lf * .5);
        x.globalAlpha = .6; x.save(); x.beginPath(); x.rect(0, 0, W * .55, H); x.clip(); drawWrap(x, dust, t * 10, hz - H * .03, W, H * .14); x.restore(); x.globalAlpha = 1;
        var b = .5 + .5 * Math.sin(t * 1.6); glow(x, kx, tipY - H * .1, u * (2 + b * 2), [190, 150, 255], .4 + b * .3);
      },
      marks: function (n) { var a = []; for (var i = 0; i < n; i++) { var f = floors[Math.min(floors.length - 1, Math.round(i * (floors.length - 1) / Math.max(1, n - 1)))]; a.push({ x: f.x, y: f.y }); } return a; } };
  };

  /* =====================================================================
     UNITS: each trainer's own saved progress, per unit (read only)
     ===================================================================== */
  /* global DATA, CONTENT, FIGHTERS, LESSON_IDS */
  function units() {
    try {
      if (ID === 'python') { var D = typeof DATA !== 'undefined' ? DATA : null; if (!D || !D.levels) return [];
        var s = get('pot.solved', {}), w = get('pot.wsolved', {});
        return D.levels.map(function (l) { var d = 0, n = 0; (l.practice || []).forEach(function (p) { n++; if (s[p.id]) d++; }); (l.write || []).forEach(function (x) { n++; if (w[x.id]) d++; });
          return { label: 'Level ' + l.num, title: l.title, frac: n ? d / n : 0, go: { h: '#level-' + l.num } }; }); }
      if (ID === 'math') { var C = typeof CONTENT !== 'undefined' ? CONTENT : null; if (!C || !C.units) return [];
        var u = (get('mpt.v1', {}) || {}).u || {};
        return C.units.map(function (x) { var r = (u[x.id] && u[x.id].r) || '', ones = (r.match(/1/g) || []).length, ready = r.length >= 10 && ones >= 8;
          return { label: 'Unit ' + x.n, title: x.title, frac: ready ? 1 : Math.min(.9, ones / 8), go: { h: '#u-' + x.id } }; }); }
      if (ID === 'business') { var B = window.TRAINER_DATA; if (!B || !B.chapters) return [];
        var q = (get('geb1432-trainer-v1', {}) || {}).q || {};
        return B.chapters.map(function (ch) { var ids = (ch.quiz || []).concat(ch.practice || []).map(function (z) { return z.id; }), d = ids.filter(function (i) { return q[i] && q[i].ok; }).length;
          return { label: 'Ch ' + ch.num, title: ch.short, frac: ids.length ? d / ids.length : 0, go: { set: { k: 'geb1432-trainer-v1', f: 'level', v: ch.id } } }; }); }
      if (ID === 'ethics') { var F = typeof FIGHTERS !== 'undefined' ? FIGHTERS : null; if (!F) return [];
        var an = (get('phi2680-octagon-v1', {}) || {}).answers || {};
        return F.filter(function (f) { return f.status !== 'preview'; }).map(function (f) { var ids = (f.quiz || []).map(function (z) { return z.id; }), d = ids.filter(function (i) { return an[i] && an[i].last === 1; }).length;
          return { label: f.name, title: f.status === 'covered' ? 'Fighter' : 'Bonus round', frac: ids.length ? d / ids.length : 0, go: { h: '#f-' + f.id } }; }); }
      if (ID === 'english') { var btns = [].slice.call(document.querySelectorAll('#levels .lv[data-id]')).filter(function (b) { return b.dataset.id !== 'mixed'; });
        var best = (get('writing-room-v1', {}) || {}).best || {};
        return btns.map(function (b, i) { var sc = typeof best[b.dataset.id] === 'number' ? best[b.dataset.id] : 0, t = b.querySelector('strong');
          return { label: 'Floor ' + (i + 1), title: t ? t.textContent : b.dataset.id, frac: sc >= 90 ? 1 : Math.min(.9, sc / 100), go: { set: { k: 'writing-room-v1', f: 'last', v: b.dataset.id } } }; }); }
      if (ID === 'fde') { var ids2 = typeof LESSON_IDS !== 'undefined' ? LESSON_IDS : null, DD = typeof DATA !== 'undefined' ? DATA : null; if (!ids2 || !DD) return [];
        var ps = (get('fdelab.v1', {}) || {}).passes || {}, ORDER = 'SAIL';
        var list = ids2.map(function (i) { var arr = ps[i] || [], d = arr.filter(Boolean).length, L = (DD.lessons[i] && DD.lessons[i].lanes) || ['S'];
          return { label: i, title: (DD.lessons[i] && DD.lessons[i].title) || '', frac: d / 4, lane: L[0], lanes: L, go: { h: '#l-' + i } }; });
        list.sort(function (a, b) { return ORDER.indexOf(a.lane) - ORDER.indexOf(b.lane); });
        return list; }
    } catch (e) { return []; }
    return [];
  }
  var LANE_NAMES = { S: 'Software', A: 'AI engineering', I: 'Infrastructure', L: 'Liaison' };

  function go(target) {
    if (!target) return;
    if (target.set) { var o = get(target.set.k, {}) || {}; o[target.set.f] = target.set.v; setLS(target.set.k, o); }
    if (target.h) { if (location.hash !== target.h) { location.hash = target.h; } }
    setTimeout(function () { location.reload(); }, 60);
  }
  function toOrbit() { ss('jw.resume', JSON.stringify({ kind: WD.kind, id: ID })); location.href = 'index.html'; }

  /* =====================================================================
     STYLES
     ===================================================================== */
  var css = document.createElement('style');
  css.textContent = [
    'html.mtw::before{display:none!important}',
    'html.cc.mtw::after{background:radial-gradient(120% 80% at 50% 40%,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 100%),linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.05) 30%,rgba(0,0,0,.35))!important}',
    '#mtw-bg{position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;filter:brightness(.62) saturate(1.05);transition:filter 1.2s}',
    '.mtw-band{position:relative;margin:14px max(14px,env(safe-area-inset-left)) 8px;border-radius:16px;overflow:hidden;height:clamp(230px,30vw,330px);border:1px solid color-mix(in srgb,var(--mtw) 55%,transparent);box-shadow:0 0 26px color-mix(in srgb,var(--mtw) 25%,transparent),0 18px 40px rgba(0,0,0,.5);background:#000;isolation:isolate}',
    '.mtw-band canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.mtw-info{position:absolute;left:0;top:0;padding:16px 18px;max-width:min(62%,460px);background:linear-gradient(135deg,rgba(0,0,0,.72),rgba(0,0,0,.35) 70%,rgba(0,0,0,0));border-bottom-right-radius:16px;z-index:3}',
    '.mtw-k{font:700 10px/1.2 Orbitron,"Exo 2",sans-serif;letter-spacing:.22em;color:var(--mtw);text-transform:uppercase}',
    '.mtw-t{margin:6px 0 2px;font:800 clamp(17px,2.1vw,26px)/1.1 Orbitron,"Exo 2",sans-serif;letter-spacing:.05em;color:#fff;text-shadow:0 2px 12px #000}',
    '.mtw-s{font:500 13px/1.45 "Exo 2",system-ui,sans-serif;color:#dfe8f2;text-shadow:0 1px 6px #000}',
    '.mtw-s b{color:#fff}',
    '.mtw-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
    '.mtw-btn{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:0 13px;font:700 10.5px/1 Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#fff;border:1px solid var(--mtw);background:rgba(0,0,0,.55);border-radius:4px;box-shadow:0 0 12px -3px var(--mtw)}',
    '.mtw-btn:hover,.mtw-btn:focus-visible{background:color-mix(in srgb,var(--mtw) 25%,rgba(0,0,0,.6))}',
    '.mtw-btn.alt{border-color:rgba(255,255,255,.35);box-shadow:none}',
    '.mtw-marks{position:absolute;inset:0;z-index:2;transform-origin:50% 50%;cursor:crosshair}',
    '.mtw-band:focus-visible{outline:2px solid var(--mtw);outline-offset:3px}',
    '.mtw-hud{position:absolute;right:56px;top:12px;z-index:3;display:flex;gap:12px;align-items:center;padding:8px 10px;background:rgba(0,0,0,.62);border:1px solid color-mix(in srgb,var(--mtw) 55%,transparent);border-radius:4px;color:#fff;box-shadow:0 0 14px -6px var(--mtw)}',
    '.mtw-hud small{display:block;font:700 8.5px/1 Orbitron,sans-serif;letter-spacing:.16em;color:var(--mtw);margin-bottom:5px}',
    '.mtw-hud b{font:800 12.5px/1 Orbitron,sans-serif;letter-spacing:.08em}',
    '.mtw-hud .xp i{display:block;width:110px;height:5px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden}.mtw-hud .xp span{display:block;height:100%;background:var(--mtw);box-shadow:0 0 8px var(--mtw)}',
    '.mtw-hud .sfx{all:unset;cursor:pointer;padding:7px 8px;border:1px solid rgba(255,255,255,.3);border-radius:3px;font:700 9px/1 Orbitron,sans-serif;letter-spacing:.1em}',
    '.mtw-hud .sfx[aria-pressed=true]{border-color:var(--mtw);color:var(--mtw)}',
    '.mtw-ach{position:absolute;left:50%;top:14px;z-index:6;transform:translate(-50%,-30px);opacity:0;padding:10px 18px;background:rgba(0,0,0,.88);border:1px solid #FFD25A;box-shadow:0 0 24px rgba(255,210,90,.55);text-align:center;transition:opacity .35s,transform .35s;pointer-events:none;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}',
    '.mtw-ach.on{opacity:1;transform:translate(-50%,0)}',
    '.mtw-ach small{display:block;font:700 9px/1 Orbitron,sans-serif;letter-spacing:.22em;color:#FFD25A}.mtw-ach b{display:block;margin-top:6px;font:700 13px/1.25 Orbitron,sans-serif;color:#fff}',
    '.mtw-hint{position:absolute;left:12px;bottom:10px;z-index:3;font:600 10.5px/1 "Exo 2",sans-serif;color:#dde;text-shadow:0 1px 4px #000;background:rgba(0,0,0,.45);padding:6px 9px;border-radius:4px;pointer-events:none}',
    '.mtw-m{all:unset;position:absolute;box-sizing:border-box;cursor:pointer;width:var(--sz);height:var(--sz);margin:calc(var(--sz)/-2) 0 0 calc(var(--sz)/-2);border-radius:50%;display:grid;place-items:center;font:700 9px/1 Orbitron,sans-serif;color:#fff;border:1.5px solid rgba(255,255,255,.55);background:rgba(0,0,0,.55);transition:transform .15s,box-shadow .15s}',
    '.mtw-m.part{border-color:#FF9E45;box-shadow:0 0 8px #FF9E45}',
    '.mtw-m.done{border-color:var(--mtw);background:color-mix(in srgb,var(--mtw) 55%,#000);box-shadow:0 0 12px var(--mtw)}',
    '.mtw-m.now{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.25),0 0 16px #fff;animation:mtwPulse 1.8s infinite}',
    '.mtw-m:hover,.mtw-m:focus-visible{transform:scale(1.35);z-index:4;outline:none;box-shadow:0 0 18px var(--mtw)}',
    '@keyframes mtwPulse{50%{box-shadow:0 0 0 7px rgba(255,255,255,0),0 0 22px #fff}}',
    '.mtw-lane{position:absolute;z-index:2;transform:translate(-50%,-150%);font:700 9.5px/1 Orbitron,sans-serif;letter-spacing:.14em;color:#ffe9b8;text-shadow:0 0 8px #000,0 0 4px #000;white-space:nowrap;pointer-events:none}',
    '.mtw-tip{position:absolute;z-index:5;pointer-events:none;min-width:150px;max-width:240px;padding:9px 11px;background:rgba(0,0,0,.86);border:1px solid var(--mtw);box-shadow:0 0 14px -4px var(--mtw);font:500 12.5px/1.35 "Exo 2",sans-serif;color:#eef;opacity:0;transform:translateY(4px);transition:opacity .15s,transform .15s;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}',
    '.mtw-tip.on{opacity:1;transform:none}',
    '.mtw-tip b{display:block;font:700 10px/1.2 Orbitron,sans-serif;letter-spacing:.14em;color:var(--mtw);margin-bottom:3px;text-transform:uppercase}',
    '.mtw-tip i{display:block;height:3px;margin-top:7px;background:rgba(255,255,255,.15)}.mtw-tip i span{display:block;height:100%;background:var(--mtw)}',
    '.mtw-leg{position:absolute;right:12px;bottom:10px;z-index:3;display:flex;gap:10px;font:600 10.5px/1 "Exo 2",sans-serif;color:#dde;text-shadow:0 1px 4px #000;background:rgba(0,0,0,.45);padding:6px 9px;border-radius:4px}',
    '.mtw-leg span::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:-1px;border:1.5px solid rgba(255,255,255,.55)}',
    '.mtw-leg .p::before{border-color:#FF9E45}.mtw-leg .d::before{border-color:var(--mtw);background:var(--mtw)}',
    '.cc-orb.mtw-orb::before{display:none}',
    '.cc-orb.mtw-orb canvas{position:absolute;inset:13%;width:74%;height:74%;border-radius:50%;filter:drop-shadow(0 0 24px color-mix(in srgb,var(--mtw) 45%,transparent))}',
    '.cc-orb.mtw-orb b{z-index:1;text-shadow:0 0 6px #000,0 0 14px #000,0 0 22px var(--mtw)}',
    '#mtw-arrive{position:fixed;inset:0;z-index:2147483000;overflow:hidden;background:#000;pointer-events:none}',
    '#mtw-arrive canvas{position:absolute;inset:0;width:100%;height:100%;transform:scale(1.35);filter:blur(6px) brightness(1.15);animation:mtwIn 2.6s cubic-bezier(.2,.7,.2,1) forwards}',
    '#mtw-arrive .x{position:absolute;inset:0;background:radial-gradient(circle,transparent 30%,rgba(255,140,60,.55) 70%,rgba(255,230,190,.9));animation:mtwHeat 1.2s ease-out forwards}',
    '#mtw-arrive .tt{position:absolute;left:0;right:0;top:42%;text-align:center;color:#fff;text-shadow:0 0 18px #000,0 2px 6px #000;opacity:0;animation:mtwTitle 2.4s ease forwards .3s}',
    '#mtw-arrive .tt small{display:block;font:700 11px/1 Orbitron,sans-serif;letter-spacing:.34em;color:var(--mtw)}',
    '#mtw-arrive .tt b{display:block;margin-top:10px;font:800 clamp(24px,4.2vw,46px)/1.1 Orbitron,sans-serif;letter-spacing:.08em}',
    '#mtw-arrive.out{transition:opacity .9s;opacity:0}',
    '@keyframes mtwIn{to{transform:scale(1);filter:blur(0) brightness(1)}}',
    '@keyframes mtwHeat{from{opacity:1}to{opacity:0}}',
    '@keyframes mtwTitle{0%{opacity:0;letter-spacing:.3em}30%{opacity:1}75%{opacity:1}100%{opacity:0}}',
    '@media (max-width:680px){.mtw-hud{position:static;display:inline-flex;margin-top:9px;padding:5px 7px;gap:8px}.mtw-hud .xp i{width:64px}.mtw-hint{display:none}.mtw-band{margin:10px 10px 6px;height:330px}.mtw-info{max-width:100%;padding:12px 13px;background:linear-gradient(180deg,rgba(0,0,0,.75),rgba(0,0,0,0))}.mtw-s{font-size:12px}.mtw-leg{display:none}}',
    '@media (prefers-reduced-motion:reduce){.mtw-m.now{animation:none}#mtw-arrive{display:none}}'
  ].join('\n');
  document.head.appendChild(css);
  document.documentElement.classList.add('mtw');
  document.documentElement.style.setProperty('--mtw', WD.color);

  /* =====================================================================
     BACKDROP (whole page) + ARRIVAL
     ===================================================================== */
  var bgCv = document.createElement('canvas'); bgCv.id = 'mtw-bg'; document.body.insertBefore(bgCv, document.body.firstChild);
  function paintBackdrop() {
    var w = innerWidth, h = innerHeight, scale = Math.min(DPR, 1.25);
    bgCv.width = Math.round(w * scale); bgCv.height = Math.round(h * scale);
    var sc = SCENES[WD.scene](w, h), x = bgCv.getContext('2d'); x.setTransform(scale, 0, 0, scale, 0, 0); sc.draw(x, 8); return sc;
  }
  var arriving = ss('jw.arrive') === ID && !REDUCED;
  var arrive = null;
  if (arriving) {
    arrive = document.createElement('div'); arrive.id = 'mtw-arrive';
    arrive.innerHTML = '<canvas></canvas><div class="x"></div><div class="tt"><small>' + esc(WD.where) + '</small><b>' + esc(WD.place) + '</b></div>';
    document.body.appendChild(arrive);
  }
  requestAnimationFrame(function () {
    paintBackdrop();
    if (arrive) {
      var ac = arrive.querySelector('canvas'), s = Math.min(DPR, 1.5); ac.width = innerWidth * s; ac.height = innerHeight * s;
      var ax = ac.getContext('2d'); ax.setTransform(s, 0, 0, s, 0, 0); var sc = SCENES[WD.scene](innerWidth, innerHeight), t0 = performance.now();
      (function step() { if (!arrive) return; sc.draw(ax, 8 + (performance.now() - t0) / 1000); if (performance.now() - t0 < 2900) requestAnimationFrame(step); })();
      setTimeout(function () { arrive.classList.add('out'); }, 2300);
      setTimeout(function () { if (arrive) { arrive.remove(); arrive = null; } }, 3300);
    }
  });
  var rT = 0; addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { paintBackdrop(); buildBand(); }, 250); });

  /* =====================================================================
     WORLD PANEL (live scene + clickable lesson markers)
     ===================================================================== */
  var band = document.createElement('section'); band.className = 'mtw-band'; band.setAttribute('aria-label', WD.place);
  band.innerHTML = '<canvas aria-hidden="true"></canvas><div class="mtw-marks"></div>' +
    '<div class="mtw-info"><div class="mtw-k">' + esc(WD.where) + '</div><div class="mtw-t">' + esc(WD.place) + '</div><div class="mtw-s" id="mtw-sum"></div>' +
    '<div class="mtw-acts"><button class="mtw-btn" type="button" id="mtw-go">Continue ›</button><button class="mtw-btn alt" type="button" id="mtw-orbit">Orbit view</button></div></div>' +
    '<div class="mtw-leg"><span>Not started</span><span class="p">In progress</span><span class="d">' + esc(WD.verb) + '</span></div><div class="mtw-tip" role="status"></div>';
  function placeBand() {
    var heroEl = document.querySelector('.cc-hero'), top = document.querySelector('.cc-top'), strip = document.querySelector('.mt-strip');
    if (heroEl && heroEl.parentNode) heroEl.parentNode.insertBefore(band, heroEl);
    else if (strip && strip.parentNode) strip.parentNode.insertBefore(band, strip.nextSibling);
    else if (top && top.parentNode) top.parentNode.insertBefore(band, top.nextSibling); else document.body.insertBefore(band, bgCv.nextSibling);
  }
  placeBand();
  /* some trainers redraw their page; put the world panel back if it gets dropped */
  new MutationObserver(function () { if (!band.isConnected) { placeBand(); setTimeout(function () { buildBand(); }, 30); } }).observe(document.body, { childList: true, subtree: true });
  var bandCv = band.querySelector('canvas'), marksEl = band.querySelector('.mtw-marks'), tip = band.querySelector('.mtw-tip');
  var scene = null, U = [], nextU = null, bW = 0, bH = 0;
  function summary() {
    var done = U.filter(function (u) { return u.frac >= 1; }).length, el = document.getElementById('mtw-sum');
    nextU = U.filter(function (u) { return u.frac < 1; })[0] || null;
    if (!el) return;
    if (!U.length) { el.textContent = 'Your progress map appears here once the trainer loads.'; return; }
    var line;
    if (ID === 'python') line = '<b>' + done + ' of ' + U.length + '</b> steps climbed to the castle (levels cleared)';
    else if (ID === 'math') line = '<b>' + done + ' of ' + U.length + '</b> waypoints reached (units test-ready)';
    else if (ID === 'business') line = '<b>' + done + ' of ' + U.length + '</b> landing pads cleared (every question right)';
    else if (ID === 'ethics') line = '<b>' + done + ' of ' + U.length + '</b> bouts won (every fight question right)';
    else if (ID === 'english') line = '<b>' + done + ' of ' + U.length + '</b> floors of the keep unlocked (90%+)';
    else { var lanes = { S: [0, 0], A: [0, 0], I: [0, 0], L: [0, 0] }; U.forEach(function (u) { (u.lanes || [u.lane]).forEach(function (l) { if (lanes[l]) { lanes[l][1]++; if (u.frac >= 1) lanes[l][0]++; } }); });
      line = '<b>' + done + ' of ' + U.length + '</b> stops lit on the road to the palace · ' + 'SAIL'.split('').map(function (k) { return LANE_NAMES[k] + ' ' + lanes[k][0] + '/' + lanes[k][1]; }).join(' · '); }
    el.innerHTML = line + (nextU ? '<br>Next: <b>' + esc(nextU.label) + (nextU.title && nextU.title !== nextU.label ? ' · ' + esc(nextU.title) : '') + '</b>' : '<br><b>Every section complete.</b>');
    var gb = document.getElementById('mtw-go'); if (gb) gb.hidden = !nextU;
  }
  function buildBand() {
    var r = band.getBoundingClientRect(); bW = Math.max(300, r.width); bH = Math.max(180, r.height);
    var s = Math.min(DPR, 1.75); bandCv.width = Math.round(bW * s); bandCv.height = Math.round(bH * s);
    bandCv.getContext('2d').setTransform(s, 0, 0, s, 0, 0);
    scene = SCENES[WD.scene](bW, bH);
    paintMarks();
  }
  function paintMarks() {
    U = units(); summary(); if (!scene) return;
    var n = U.length, pts = n ? scene.marks(n) : [], sz = n > 24 ? 13 : n > 12 ? 18 : 24; PTS = pts; if (typeof paintHud === 'function') { paintHud(); checkAch(); }
    marksEl.innerHTML = U.map(function (u, i) {
      var st = u.frac >= 1 ? 'done' : u.frac > 0 ? 'part' : '', now = u === nextU ? ' now' : '', p = pts[i] || { x: 0, y: 0 };
      return '<button type="button" class="mtw-m ' + st + now + '" data-i="' + i + '" style="--sz:' + sz + 'px;left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) + 'px" aria-label="' + esc(u.label + ' ' + (u.title || '') + ', ' + Math.round(u.frac * 100) + '%') + '">' + (sz >= 18 ? (i + 1) : '') + '</button>';
    }).join('');
    if (ID === 'fde' && scene.ringAt && n) {
      var counts = {}; U.forEach(function (u) { counts[u.lane] = (counts[u.lane] || 0) + 1; }); var acc = 0;
      'SAIL'.split('').forEach(function (k) { if (!counts[k]) return; var mid = (acc + counts[k] / 2) / n; acc += counts[k]; var p = scene.ringAt(.03 + mid * .94);
        var el = document.createElement('div'); el.className = 'mtw-lane'; el.style.left = p.x + 'px'; el.style.top = (p.y - 6) + 'px'; el.textContent = LANE_NAMES[k].toUpperCase(); marksEl.appendChild(el); });
    }
  }
  /* =====================================================================
     GAME LAYER: your own craft travels the lesson path, arrow keys / tap to move,
     Enter to launch, click the world for effects, rank + XP, achievements, sound.
     ===================================================================== */
  var PTS = [], G = { pos: -1, target: -1, goAfter: false, dir: 1, fx: [], off: { x: 0, y: 0, tx: 0, ty: 0 }, sfx: get('mtw.sfx', true) !== false, flash: 0, last: 0 };
  var RANKS = [[0, 'Recruit'], [.0001, 'Cadet'], [.25, 'Pilot'], [.5, 'Commander'], [.75, 'Vanguard'], [1, 'Legend']];
  function rankOf(p) { var r = 'Recruit'; RANKS.forEach(function (k) { if (p >= k[0]) r = k[1]; }); return r; }
  var hud = document.createElement('div'); hud.className = 'mtw-hud';
  if (innerWidth <= 680) band.querySelector('.mtw-info').appendChild(hud); else band.appendChild(hud);
  var ach = document.createElement('div'); ach.className = 'mtw-ach'; ach.setAttribute('role', 'status'); band.appendChild(ach);
  var hint = document.createElement('div'); hint.className = 'mtw-hint';
  hint.textContent = MOBILE ? 'Tap a marker to travel there · tap the world' : '← → move · Enter launch · click the world'; band.appendChild(hint);
  band.tabIndex = 0;
  function totals() { var n = U.length || 1, done = U.filter(function (u) { return u.frac >= 1; }).length, sum = U.reduce(function (s, u) { return s + u.frac; }, 0); return { n: n, done: done, p: done / n, xp: Math.round(sum * 100), fill: sum / n }; }
  function paintHud() {
    var T = totals();
    hud.innerHTML = '<div><small>Rank</small><b>' + rankOf(T.p) + '</b></div><div class="xp"><small>XP ' + T.xp.toLocaleString() + '</small><i><span style="width:' + Math.round(T.fill * 100) + '%"></span></i></div>' +
      '<button type="button" class="sfx" aria-pressed="' + G.sfx + '" title="Sound effects">' + (G.sfx ? 'SFX ON' : 'SFX OFF') + '</button>';
  }
  hud.addEventListener('click', function (e) { if (!e.target.closest('.sfx')) return; G.sfx = !G.sfx; setLS('mtw.sfx', G.sfx); paintHud(); if (G.sfx) SFX.arrive(); });

  /* ---- sound (made in code, only after you click) ---- */
  var AC = null;
  function ac() { if (!G.sfx) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; } return AC; }
  function tone(f1, f2, dur, type, vol, delay) { var a = ac(); if (!a) return; var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + (delay || 0);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .06, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .05); }
  function noise(dur, freq, vol, type) { var a = ac(); if (!a) return; var len = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); f.type = type || 'lowpass'; f.frequency.value = freq; g.gain.value = vol || .08; s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start(); }
  var SFX = {
    move: function () { tone(320, 540, .12, 'triangle', .04); },
    arrive: function () { tone(660, 990, .14, 'sine', .05); },
    launch: function () { tone(220, 900, .4, 'sawtooth', .03); noise(.45, 1600, .05); },
    ach: function () { tone(523, 523, .12, 'sine', .06); tone(659, 659, .12, 'sine', .06, .11); tone(784, 1046, .32, 'sine', .06, .22); },
    world: {
      throne: function () { noise(.25, 3200, .08, 'highpass'); tone(1200, 2400, .5, 'sine', .025, .05); },
      tide: function () { noise(1.4, 380, .22); },
      desert: function () { noise(.6, 2600, .05, 'bandpass'); },
      hub: function () { tone(180, 1300, .7, 'sawtooth', .025); noise(.5, 900, .04); },
      forge: function () { tone(190, 85, .45, 'square', .035); noise(.3, 2000, .06, 'highpass'); },
      veil: function () { tone(880, 1320, .7, 'sine', .03); tone(1320, 1760, .6, 'sine', .02, .08); }
    }
  };

  /* ---- path + travel ---- */
  function posAt(f) { var n = PTS.length; if (!n) return null; f = clamp(f, 0, n - 1); var a = Math.floor(f), b = Math.min(n - 1, a + 1), k = f - a; return { x: PTS[a].x + (PTS[b].x - PTS[a].x) * k, y: PTS[a].y + (PTS[b].y - PTS[a].y) * k }; }
  function homeIndex() { var i = nextU ? U.indexOf(nextU) : U.length - 1; return Math.max(0, i); }
  function startTravel(i, goAfter) {
    if (!PTS.length) return; i = clamp(i, 0, PTS.length - 1); if (G.pos < 0) G.pos = homeIndex();
    G.target = i; G.goAfter = !!goAfter; if (i !== G.pos) G.dir = i > G.pos ? 1 : -1;
    if (Math.abs(G.pos - i) < .02 || REDUCED) { G.pos = i; arriveAt(); return; } SFX.move();
  }
  function arriveAt() {
    var i = G.target; G.target = -1; if (i < 0) return; G.pos = i; SFX.arrive();
    var b = marksEl.querySelector('.mtw-m[data-i="' + i + '"]'); if (b) showTip(b);
    if (G.goAfter) { G.goAfter = false; G.flash = 1; SFX.launch(); var u = U[i]; setTimeout(function () { go(u && u.go); }, REDUCED ? 50 : 520); }
  }
  marksEl.addEventListener('click', function (e) {
    var b = e.target.closest('.mtw-m');
    if (b) { e.stopPropagation(); startTravel(+b.dataset.i, true); return; }
    var p = toScene(e.clientX, e.clientY); worldFx(p.x, p.y);
  });
  band.addEventListener('keydown', function (e) {
    if (e.target !== band && !e.target.closest('.mtw-marks')) return;
    var cur = G.target >= 0 ? G.target : Math.round(G.pos < 0 ? homeIndex() : G.pos), k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowUp') startTravel(cur + 1, false);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') startTravel(cur - 1, false);
    else if (k === 'Home') startTravel(0, false);
    else if (k === 'End') startTravel(homeIndex(), false);
    else if (k === 'Enter' || k === ' ') startTravel(cur, true);
    else return;
    e.preventDefault(); e.stopPropagation();
  });
  band.addEventListener('pointermove', function (e) { if (REDUCED) return; var r = band.getBoundingClientRect(); G.off.tx = -((e.clientX - r.left) / r.width - .5) * 16; G.off.ty = -((e.clientY - r.top) / r.height - .5) * 9; });
  band.addEventListener('pointerleave', function () { G.off.tx = G.off.ty = 0; });
  var K = 1.03;
  function toScene(cx, cy) { var r = band.getBoundingClientRect(), x = cx - r.left, y = cy - r.top; return { x: bW / 2 + (x - G.off.x - bW / 2) / K, y: bH / 2 + (y - G.off.y - bH / 2) / K }; }

  /* ---- world effects ---- */
  function burst(x, y, n, cols, spd, grav, life, size) { var e = { k: 'p', t: 0, life: life, g: grav, p: [] };
    for (var i = 0; i < n; i++) { var a = Math.random() * 6.283, s = spd * (.3 + Math.random() * .7); e.p.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (grav < 0 ? 0 : spd * .2), c: cols[i % cols.length], s: (size || 2) * (.5 + Math.random()), l: life * (.5 + Math.random() * .5) }); }
    G.fx.push(e); }
  function bolt(x, y, col, w) { var pts = [], sx = x + (Math.random() - .5) * 60, n = 12; for (var i = 0; i <= n; i++) { var k = i / n; pts.push({ x: sx + (x - sx) * k + (i && i < n ? (Math.random() - .5) * 26 : 0), y: -10 + (y + 10) * k }); } G.fx.push({ k: 'b', t: 0, life: .55, pts: pts, c: col, w: w || 2 }); }
  function worldFx(x, y) {
    var u = Math.min(bW, bH * 2.2) / 100, sc = WD.scene;
    if (SFX.world[sc]) SFX.world[sc]();
    if (sc === 'throne') { burst(x, y, 70, [[255, 214, 120], [200, 150, 255], [255, 240, 200]], 130, 45, 1.7, 2.2); G.fx.push({ k: 'r', t: 0, life: .7, x: x, y: y, c: [255, 214, 140], r: u * 14 }); }
    else if (sc === 'tide') { bolt(x, y, [210, 240, 255], 2.2); G.flash = .55; burst(x, y, 30, [[200, 245, 240], [120, 220, 220]], 90, 220, .9, 1.8); }
    else if (sc === 'desert') { burst(x, y, 60, [[240, 170, 110], [255, 205, 150], [200, 120, 70]], 150, 200, 1.2, 2); burst(x, y, 18, [[120, 190, 255]], 40, -10, 1.6, 2.6); }
    else if (sc === 'hub') { var from = PTS.length ? PTS.reduce(function (a, p) { return Math.hypot(p.x - x, p.y - y) < Math.hypot(a.x - x, a.y - y) ? p : a; }) : { x: x, y: bH }; G.fx.push({ k: 's', t: 0, life: 1.1, from: { x: from.x, y: from.y }, to: { x: x, y: y }, done: false }); }
    else if (sc === 'forge') { burst(x, y, 80, [[255, 120, 40], [255, 70, 30], [255, 220, 150]], 150, -40, 1.6, 2); var c0 = PTS.length ? PTS.reduce(function (a, p) { return { x: a.x + p.x / PTS.length, y: a.y + p.y / PTS.length }; }, { x: 0, y: 0 }) : { x: bW / 2, y: bH }; G.fx.push({ k: 'l', t: 0, life: 1.3, from: c0, to: { x: x, y: y } }); }
    else if (sc === 'veil') { G.fx.push({ k: 'r', t: 0, life: 1, x: x, y: y, c: [190, 150, 255], r: u * 22 }); bolt(x, y, [215, 190, 255], 1.4); burst(x, y, 40, [[210, 180, 255], [255, 200, 140]], 70, 0, 1.4, 1.8); }
  }
  function drawFx(x, dt) {
    x.save(); x.globalCompositeOperation = 'lighter';
    G.fx = G.fx.filter(function (e) {
      e.t += dt; var a = Math.max(0, 1 - e.t / e.life);
      if (e.k === 'p') e.p.forEach(function (p) { if (e.t > p.l) return; p.vy += e.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; x.fillStyle = rgba(p.c, Math.max(0, 1 - e.t / p.l)); x.fillRect(p.x, p.y, p.s, p.s); });
      else if (e.k === 'b') { [[e.w * 4, .25], [e.w, .95]].forEach(function (s) { x.strokeStyle = rgba(e.c, a * s[1]); x.lineWidth = s[0]; x.beginPath(); e.pts.forEach(function (p, i) { i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y); }); x.stroke(); }); }
      else if (e.k === 'r') { x.strokeStyle = rgba(e.c, a * .8); x.lineWidth = 2; x.beginPath(); x.arc(e.x, e.y, e.r * (1 - a) + 2, 0, 6.28); x.stroke(); glow(x, e.x, e.y, e.r * .6, e.c, a * .5); }
      else if (e.k === 's') { var k = Math.min(1, e.t / .85), hx = e.from.x + (e.to.x - e.from.x) * k, hy = e.from.y + (e.to.y - e.from.y) * k - Math.sin(k * Math.PI) * 30;
        x.strokeStyle = lin(x, e.from.x, e.from.y, hx, hy, [[0, 'rgba(150,205,255,0)'], [1, 'rgba(220,240,255,.9)']]); x.lineWidth = 2; x.beginPath(); x.moveTo(e.from.x, e.from.y); x.quadraticCurveTo((e.from.x + hx) / 2, Math.min(e.from.y, hy) - 30, hx, hy); x.stroke(); glow(x, hx, hy, 10, [230, 245, 255], 1);
        if (k >= 1 && !e.done) { e.done = true; burst(e.to.x, e.to.y, 26, [[230, 245, 255], [150, 205, 255]], 90, 30, .9, 1.8); } }
      else if (e.k === 'l') { x.fillStyle = lin(x, e.from.x, e.from.y, e.to.x, e.to.y, [[0, rgba([255, 250, 245], .05)], [1, rgba([255, 250, 245], .35 * a)]]); var dx = e.to.x - e.from.x, dy = e.to.y - e.from.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 14, ny = dx / L * 14;
        x.beginPath(); x.moveTo(e.from.x - nx * .1, e.from.y - ny * .1); x.lineTo(e.to.x - nx, e.to.y - ny); x.lineTo(e.to.x + nx, e.to.y + ny); x.lineTo(e.from.x + nx * .1, e.from.y + ny * .1); x.fill(); glow(x, e.to.x, e.to.y, 26, [255, 240, 230], a * .6); }
      return e.t < e.life;
    });
    x.restore();
  }

  /* ---- your craft, one per world ---- */
  function drawAvatar(x, t) {
    if (G.pos < 0) { if (!PTS.length) return; G.pos = homeIndex(); }
    var p = posAt(G.pos); if (!p) return;
    var u = Math.min(bW, bH * 2.2) / 100, bob = Math.sin(t * 3) * u * .3, moving = G.target >= 0, d = G.dir, sc = WD.scene;
    x.save();
    if (sc === 'throne') { var sx = p.x, sy = p.y - u * 2.4 + bob; glow(x, sx, sy, u * 5, [255, 214, 140], .45);
      if (moving) { x.strokeStyle = 'rgba(200,150,255,.6)'; x.lineWidth = u * .6; x.beginPath(); x.moveTo(sx - d * u * 1.4, sy + u * .3); x.lineTo(sx - d * u * 7, sy + u * 1.4); x.stroke(); }
      x.fillStyle = lin(x, sx, sy - u, sx, sy + u, [[0, '#fff1c8'], [1, '#b8842e']]); x.beginPath(); x.ellipse(sx, sy, u * 2.2, u * .7, -.08 * d, 0, 6.28); x.fill();
      x.fillStyle = 'rgba(160,120,255,.9)'; x.beginPath(); x.ellipse(sx + d * u * .5, sy - u * .45, u * .8, u * .4, 0, Math.PI, 0); x.fill(); glow(x, sx - d * u * 2, sy + u * .2, u * 1.6, [190, 150, 255], .8); }
    else if (sc === 'tide') { var cx = p.x, cy = p.y - u * 1.2; glow(x, cx + u * .7, cy, u * 4.5, [255, 208, 138], .55);
      x.fillStyle = '#0a1414'; x.fillRect(cx - u * .35, cy - u * .2, u * .7, u * 1.5); x.beginPath(); x.arc(cx, cy - u * .6, u * .45, 0, 6.28); x.fill();
      x.fillStyle = '#ffe2a8'; x.beginPath(); x.arc(cx + u * .8, cy + u * .3 + Math.sin(t * 5) * u * .1, u * .32, 0, 6.28); x.fill(); }
    else if (sc === 'desert') { var rx = p.x, ry = p.y - u * 1.1;
      x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = lin(x, rx, ry, rx + d * u * 16, ry, [[0, 'rgba(255,240,210,.35)'], [1, 'rgba(255,240,210,0)']]); x.beginPath(); x.moveTo(rx + d * u * 1.6, ry - u * .2); x.lineTo(rx + d * u * 16, ry - u * 2.4); x.lineTo(rx + d * u * 16, ry + u * 1.6); x.closePath(); x.fill(); x.restore();
      x.fillStyle = '#d9d0c2'; x.fillRect(rx - u * 1.6, ry - u * .9, u * 3.2, u * 1.1); x.fillStyle = '#3a4a5a'; x.fillRect(rx + d * u * .3 - u * .5, ry - u * .75, u * 1, u * .45);
      x.fillStyle = '#1b1410'; [-1.1, -.35, .4, 1.15].forEach(function (k) { x.beginPath(); x.arc(rx + k * u, ry + u * .35, u * .38, 0, 6.28); x.fill(); });
      x.strokeStyle = '#d9d0c2'; x.lineWidth = 1; x.beginPath(); x.moveTo(rx - d * u * 1, ry - u * .9); x.lineTo(rx - d * u * 1.2, ry - u * 2.2); x.stroke(); glow(x, rx - d * u * 1.2, ry - u * 2.2, u * .8, [120, 190, 255], .9);
      if (moving && Math.random() < .5) burst(rx - d * u * 1.6, ry + u * .5, 3, [[220, 170, 120]], 18, -6, .7, 2); }
    else if (sc === 'hub') { var hx = p.x, hy = p.y - u * 4.5 + bob;
      x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = lin(x, 0, hy, 0, p.y, [[0, 'rgba(190,230,255,.35)'], [1, 'rgba(190,230,255,0)']]); x.beginPath(); x.moveTo(hx - u * .6, hy); x.lineTo(hx + u * .6, hy); x.lineTo(hx + u * 3, p.y); x.lineTo(hx - u * 3, p.y); x.fill(); x.restore();
      x.fillStyle = lin(x, hx, hy - u, hx, hy + u, [[0, '#f2f8ff'], [1, '#7f97ad']]); x.beginPath(); x.moveTo(hx + d * u * 2.4, hy); x.lineTo(hx - d * u * 1.8, hy - u * .9); x.lineTo(hx - d * u * 1.2, hy); x.lineTo(hx - d * u * 1.8, hy + u * .9); x.closePath(); x.fill();
      glow(x, hx - d * u * 1.5, hy, u * 1.6, [150, 205, 255], .9); }
    else if (sc === 'forge') { var fx = p.x, fy = p.y - u * 2.4;
      x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = lin(x, 0, 0, 0, fy, [[0, 'rgba(255,250,245,0)'], [1, 'rgba(255,250,245,.22)']]); x.beginPath(); x.moveTo(fx - u * .5, 0); x.lineTo(fx + u * .5, 0); x.lineTo(fx + u * 2.6, fy + u); x.lineTo(fx - u * 2.6, fy + u); x.fill(); x.restore();
      x.fillStyle = '#1a0d0b'; x.strokeStyle = '#ff5a3a'; x.lineWidth = 1.6; x.beginPath(); for (var i = 0; i < 6; i++) { var a = i / 6 * 6.283 + Math.PI / 6; x.lineTo(fx + Math.cos(a) * u * 1.4, fy + Math.sin(a) * u * 1.4); } x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#fff'; x.font = '700 ' + Math.round(u * 1.2) + 'px Orbitron, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('★', fx, fy + u * .05); glow(x, fx, fy, u * 3, [255, 90, 50], .5); }
    else if (sc === 'veil') { var vx = p.x, vy = p.y;
      x.strokeStyle = 'rgba(210,180,255,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(vx, 0); x.lineTo(vx, vy - u * .9); x.stroke();
      glow(x, vx, vy, u * 4, [190, 150, 255], .6); x.fillStyle = '#2a1840'; x.strokeStyle = 'rgba(230,200,255,.9)'; x.lineWidth = 1.2; x.fillRect(vx - u * .9, vy - u * .9, u * 1.8, u * 1.8); x.strokeRect(vx - u * .9, vy - u * .9, u * 1.8, u * 1.8);
      x.fillStyle = 'rgba(255,214,160,.95)'; x.fillRect(vx - u * .5, vy - u * .5, u * 1, u * .8); }
    x.restore();
  }

  /* ---- achievements: a lesson you finished since last time lights up with a fanfare ---- */
  function checkAch() {
    if (!U.length) return; var key = 'mtw.done.' + ID, cur = U.filter(function (u) { return u.frac >= 1; }).map(function (u) { return u.label; });
    var seen = get(key, null), rkKey = 'mtw.rank.' + ID, rk = rankOf(totals().p), oldRk = get(rkKey, null);
    setLS(key, cur); setLS(rkKey, rk); if (!seen) return;
    var fresh = cur.filter(function (l) { return seen.indexOf(l) < 0; }), q = [];
    fresh.slice(0, 3).forEach(function (l) { var i = -1; U.forEach(function (u, k) { if (u.label === l) i = k; }); q.push({ t: WD.verb + ': ' + WD.unitWord + ' ' + (i + 1) + ' · ' + l, i: i }); });
    if (oldRk && oldRk !== rk && RANKS.map(function (r) { return r[1]; }).indexOf(rk) > RANKS.map(function (r) { return r[1]; }).indexOf(oldRk)) q.push({ t: 'Rank up: ' + rk, i: -1 });
    q.forEach(function (a, k) { setTimeout(function () { showAch(a.t, a.i); }, 700 + k * 2200); });
  }
  function showAch(text, i) {
    ach.innerHTML = '<small>★ Achievement unlocked</small><b>' + esc(text) + '</b>'; ach.classList.add('on'); SFX.ach();
    var p = PTS[i] || { x: bW / 2, y: bH * .4 }; burst(p.x, p.y, 60, [[255, 214, 90], [255, 255, 255], hex(WD.color)], 120, 60, 1.6, 2.2);
    setTimeout(function () { ach.classList.remove('on'); }, 2600);
  }
  function showTip(b) {
    var u = U[+b.dataset.i]; if (!u) return;
    tip.innerHTML = '<b>' + esc(WD.unitWord) + ' ' + (+b.dataset.i + 1) + ' · ' + esc(u.label) + '</b>' + esc(u.title || '') + '<i><span style="width:' + Math.round(u.frac * 100) + '%"></span></i><div style="margin-top:5px;font-size:11.5px;color:#bcc">' + Math.round(u.frac * 100) + '% · ' + (MOBILE ? 'tap' : 'click') + ' to travel + launch</div>';
    var x = parseFloat(b.style.left), y = parseFloat(b.style.top), tw = 220;
    tip.style.left = clamp(x - tw / 2, 6, bW - tw - 6) + 'px'; tip.style.top = (y > bH * .55 ? y - 92 : y + 16) + 'px'; tip.classList.add('on');
  }
  marksEl.addEventListener('mouseover', function (e) { var b = e.target.closest('.mtw-m'); if (b) showTip(b); });
  marksEl.addEventListener('focusin', function (e) { var b = e.target.closest('.mtw-m'); if (b) showTip(b); });
  marksEl.addEventListener('mouseleave', function () { tip.classList.remove('on'); });
  marksEl.addEventListener('focusout', function () { tip.classList.remove('on'); });
  document.getElementById('mtw-go').addEventListener('click', function () { if (nextU) go(nextU.go); });
  document.getElementById('mtw-orbit').addEventListener('click', toOrbit);
  // links back to the galaxy return you to this planet's orbit
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (!a) return; var h = a.getAttribute('href') || ''; if (/^(\.\/)?index\.html(#.*)?$/.test(h)) ss('jw.resume', JSON.stringify({ kind: WD.kind, id: ID })); }, true);

  buildBand();
  setTimeout(paintMarks, 900); setInterval(paintMarks, 6000);
  addEventListener('storage', paintMarks);

  var t0 = performance.now(), lastF = 0, visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(band);
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!scene || document.hidden || !visible) return;
    var dt = Math.min(.1, (now - (G.last || now)) / 1000); 
    if (REDUCED) { if (!lastF) { scene.draw(bandCv.getContext('2d'), 8); lastF = 1; } else if (!G.fx.length && G.target < 0) return; }
    else if (now - lastF < 30) return;
    dt = Math.min(.1, (now - (lastF || now)) / 1000); lastF = now; G.last = now;
    var tt = 8 + (now - t0) / 1000, cx2 = bandCv.getContext('2d'), s = Math.min(DPR, 1.75);
    if (G.target >= 0) { var dd = G.target - G.pos, step = Math.max(5, Math.abs(dd) * 2.4) * dt; if (Math.abs(dd) <= step) arriveAt(); else G.pos += (dd > 0 ? 1 : -1) * step; }
    G.off.x += (G.off.tx - G.off.x) * Math.min(1, dt * 5); G.off.y += (G.off.ty - G.off.y) * Math.min(1, dt * 5);
    cx2.setTransform(s * K, 0, 0, s * K, s * (bW / 2 * (1 - K) + G.off.x), s * (bH / 2 * (1 - K) + G.off.y));
    scene.draw(cx2, tt); drawAvatar(cx2, tt); drawFx(cx2, dt);
    cx2.setTransform(s, 0, 0, s, 0, 0);
    if (G.flash > 0) { cx2.fillStyle = rgba(hex(WD.color), G.flash * .5); cx2.fillRect(0, 0, bW, bH); G.flash = Math.max(0, G.flash - dt * 2.2); }
    marksEl.style.transform = 'translate(' + G.off.x.toFixed(2) + 'px,' + G.off.y.toFixed(2) + 'px) scale(' + K + ')';
  })(0);

  /* =====================================================================
     HERO ORB: the same planet you landed on
     ===================================================================== */
  var PAL = {
    ocean: ['#06303a', '#0f6a6e', '#2f6b32', '#56763a', '#f3f5f8'], hub: ['#5d7f9c', '#a9c6dc', '#e8f2fa'], forge: ['#140d0c', '#3a2a26', '#6a5048'], veil: ['#2a1840', '#6a4a8a', '#c98a52', '#e8b47a'], desert: ['#6e3a1c', '#b8672e', '#d99a5b', '#f0cf98'],
    gas: ['#6b4a2f', '#c79a6a', '#efdcc0', '#a8693d', '#e8c9a0'], gas2: ['#3a3456', '#8a7fb0', '#d8d2ea', '#6a5a8e', '#bdb4d8'],
    ice: ['#c7dcef', '#eef6ff', '#7ea6c9', '#4b7193'], sun: ['#ff7a18', '#ffb347', '#fff0b8', '#ff5a10']
  };
  function orbPlanet(type, size) {
    var cv = mk(size, size), x = cv.getContext('2d'), img = x.createImageData(size, size), d = img.data, N = perlin(type.length * 97 + 7), pal = PAL[type].map(hex), R = size / 2;
    var L = [-.55, -.45, .7], ll = Math.hypot(L[0], L[1], L[2]); L = L.map(function (v) { return v / ll; });
    for (var j = 0; j < size; j++) for (var i = 0; i < size; i++) {
      var nx = (i + .5 - R) / R, ny = (j + .5 - R) / R, rr = nx * nx + ny * ny, k = (j * size + i) * 4; if (rr > 1) { d[k + 3] = 0; continue; }
      var nz = Math.sqrt(1 - rr), px = nx, py = -ny, pz = nz, c3;
      if (type === 'sun') { var g = .5 + N.fbm(px * 4, py * 4, pz * 4, 5); c3 = mix(pal[0], pal[1], sm(.3, .6, g)); c3 = mix(c3, pal[2], sm(.6, .85, g)); var limb = Math.pow(nz, .4); c3 = c3.map(function (v) { return Math.min(255, v * (.6 + .5 * limb)); }); }
      else {
        if (type === 'ocean') { var h = N.fbm(px * 1.7, py * 1.7, pz * 1.7, 6); c3 = h < .04 ? mix(pal[0], pal[1], sm(-.3, .04, h)) : mix(pal[2], pal[3], sm(.04, .3, h)); var cl = sm(.1, .4, N.fbm(px * 3 + 4, py * 5, pz * 3, 6)); c3 = mix(c3, pal[4], cl * .85); }
        else if (type === 'desert') { var hh = .5 + N.fbm(px * 2.4, py * 2.4, pz * 2.4, 6); c3 = mix(pal[0], pal[1], sm(.2, .55, hh)); c3 = mix(c3, pal[2], sm(.5, .75, hh)); c3 = mix(c3, pal[3], sm(.72, .9, hh) * .7); }
        else if (type === 'hub') { var hb = .5 + N.fbm(px * 2.2, py * 2.2, pz * 2.2, 5); c3 = mix(pal[0], pal[1], sm(.3, .6, hb)); c3 = mix(c3, pal[2], sm(.6, .8, hb)); var gl = Math.abs(N.n(px * 26, py * 26, pz * 26)) < .03 ? 1 : 0; if (gl) c3 = [70, 90, 110]; c3.glow = gl ? [190, 225, 255] : null; }
        else if (type === 'forge') { var hf = .5 + N.fbm(px * 2.6, py * 2.6, pz * 2.6, 5); c3 = mix(pal[0], pal[1], sm(.35, .65, hf)); c3 = mix(c3, pal[2], sm(.65, .85, hf) * .6); var crk = Math.abs(N.n(px * 5, py * 5, pz * 5)) < .035 || Math.abs(N.n(px * 11 + 3, py * 11, pz * 11)) < .02; c3.glow = crk ? [255, 110, 30] : null; }
        else if (type === 'veil') { var hv = .5 + N.fbm(px * 2.2, py * 2.2, pz * 2.2, 6), ds = N.fbm(px * 1.6 + 7, py * 1.6, pz * 1.6, 4); c3 = mix(pal[0], pal[1], sm(.3, .7, hv)); if (ds > .05) c3 = mix(c3, mix(pal[2], pal[3], sm(.4, .7, hv)), sm(.05, .2, ds)); }
        else if (type === 'ice') { var hi = .5 + N.fbm(px * 2.5, py * 2.5, pz * 2.5, 5); c3 = mix(pal[2], pal[0], sm(.3, .6, hi)); c3 = mix(c3, pal[1], sm(.55, .8, hi)); c3 = mix(c3, pal[3], Math.pow(1 - Math.abs(N.n(px * 5.5, py * 5.5, pz * 5.5)), 14) * .7); }
        else { var bands = type === 'gas' ? 9 : 11, v = py * bands + N.fbm(px * 1.6, py * 5, pz * 1.6, 5) * 2.2, t1 = .5 + .5 * Math.sin(v * Math.PI); c3 = mix(pal[0], pal[1], t1); c3 = mix(c3, pal[2], sm(.6, 1, .5 + .5 * Math.sin(v * 2.3 + 1)) * .6); c3 = mix(c3, pal[3], sm(.75, 1, 1 - t1) * .5); }
        var lit = Math.max(0, px * L[0] * -1 * -1 + py * -L[1] * -1 + pz * L[2]); lit = Math.max(0, -nx * .55 + -ny * .45 + nz * .7) / 1.0;
        var shade = .06 + .94 * sm(-.05, .55, lit), rim = Math.pow(1 - nz, 3) * sm(0, .4, lit);
        var atm = type === 'desert' ? [255, 178, 122] : type === 'forge' ? [255, 150, 120] : type === 'veil' ? [210, 170, 255] : type === 'hub' ? [200, 230, 255] : [140, 200, 210];
        var gw = c3.glow;
        c3 = [c3[0] * shade + atm[0] * rim * .6, c3[1] * shade + atm[1] * rim * .6, c3[2] * shade + atm[2] * rim * .6];
        if (gw) { var nm = 1 - sm(0, .5, lit) * .6; c3 = [c3[0] + gw[0] * nm, c3[1] + gw[1] * nm, c3[2] + gw[2] * nm]; }
      }
      var edge = sm(1, .97, Math.sqrt(rr)); d[k] = Math.min(255, c3[0]); d[k + 1] = Math.min(255, c3[1]); d[k + 2] = Math.min(255, c3[2]); d[k + 3] = 255 * edge;
    }
    x.putImageData(img, 0, 0);
    if (type === 'gas') { var o = mk(size * 1.6, size * 1.6), ox = o.getContext('2d'), m = o.width / 2; ox.translate(m, m); ox.rotate(-.35);
      for (var q = 0; q < 50; q++) { ox.strokeStyle = 'rgba(230,205,170,' + (.15 + (q % 7) / 20) + ')'; ox.lineWidth = 1.2; ox.beginPath(); ox.ellipse(0, 0, R * (1.3 + q * .015), R * (1.3 + q * .015) * .22, 0, Math.PI, Math.PI * 2); ox.stroke(); }
      ox.drawImage(cv, -R, -R);
      for (q = 0; q < 50; q++) { ox.strokeStyle = 'rgba(230,205,170,' + (.15 + (q % 7) / 20) + ')'; ox.lineWidth = 1.2; ox.beginPath(); ox.ellipse(0, 0, R * (1.3 + q * .015), R * (1.3 + q * .015) * .22, 0, 0, Math.PI); ox.stroke(); }
      return o; }
    return cv;
  }
  var orb = document.querySelector('.cc-orb');
  if (orb) setTimeout(function () { try { var pc = orbPlanet(WD.planet, MOBILE ? 180 : 260); orb.classList.add('mtw-orb'); if (WD.planet === 'gas') { pc.style.inset = '-5%'; pc.style.width = '110%'; pc.style.height = '110%'; pc.style.borderRadius = '0'; } orb.insertBefore(pc, orb.firstChild); } catch (e) {} }, 50);
})();
