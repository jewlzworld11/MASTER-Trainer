/* Master Trainer progress reporter.
   Each trainer page loads this file with data-id="<class id>". It reads the progress that trainer
   already saves in this browser, boils it down to "done / total" plus the next thing to study,
   and writes that summary to localStorage under "mt.progress" so the hub can show it.
   It only reads the trainer's own saved data; it never changes it. */
(function () {
  'use strict';
  var me = document.currentScript;
  var id = me && me.dataset ? me.dataset.id : '';
  if (!id) return;
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  /* trainer data lives in top-level consts, which other classic scripts can read by name (no eval needed) */
  /* global DATA, CONTENT, FIGHTERS, LESSON_IDS */

  var R = {
    python: function () {
      var D = typeof DATA !== 'undefined' ? DATA : null; if (!D || !D.levels) return null;
      var s = get('pot.solved', {}), w = get('pot.wsolved', {}), done = 0, total = 0, next = null;
      D.levels.forEach(function (l) {
        var d = 0, n = 0;
        (l.practice || []).forEach(function (p) { n++; if (s[p.id]) d++; });
        (l.write || []).forEach(function (x) { n++; if (w[x.id]) d++; });
        done += d; total += n;
        if (!next && d < n) next = { t: 'Level ' + l.num + ': ' + l.title, h: '#level-' + l.num };
      });
      return { done: done, total: total, unit: 'problems solved', next: next };
    },
    math: function () {
      var C = typeof CONTENT !== 'undefined' ? CONTENT : null; if (!C || !C.units) return null;
      var S = get('mpt.v1', {}), u = S.u || {}, done = 0, next = null;
      C.units.forEach(function (x) {
        var r = (u[x.id] && u[x.id].r) || '';
        var ready = r.length >= 10 && (r.match(/1/g) || []).length >= 8;
        if (ready) done++; else if (!next) next = { t: 'Unit ' + x.n + ': ' + x.title, h: '#u-' + x.id };
      });
      return { done: done, total: C.units.length, unit: 'units test-ready', next: next };
    },
    business: function () {
      var D = window.TRAINER_DATA; if (!D || !D.chapters) return null;
      var q = (get('geb1432-trainer-v1', {}).q) || {}, done = 0, total = 0, next = null;
      D.chapters.forEach(function (c) {
        var ids = (c.quiz || []).concat(c.practice || []).map(function (x) { return x.id; });
        var d = ids.filter(function (i) { return q[i] && q[i].ok; }).length;
        done += d; total += ids.length;
        if (!next && ids.length && d < ids.length) next = { t: 'Ch ' + c.num + ': ' + c.short, set: { k: 'geb1432-trainer-v1', f: 'level', v: c.id } };
      });
      return { done: done, total: total, unit: 'questions right', next: next };
    },
    ethics: function () {
      var F = typeof FIGHTERS !== 'undefined' ? FIGHTERS : null; if (!F) return null;
      var a = (get('phi2680-octagon-v1', {}).answers) || {}, done = 0, total = 0, next = null;
      F.forEach(function (f) {
        if (f.status === 'preview') return;
        var ids = (f.quiz || []).map(function (q) { return q.id; });
        var d = ids.filter(function (i) { return a[i] && a[i].last === 1; }).length;
        done += d; total += ids.length;
        if (!next && ids.length && d < ids.length) next = { t: f.name, h: '#f-' + f.id };
      });
      return { done: done, total: total, unit: 'fight questions right', next: next };
    },
    english: function () {
      var btns = [].slice.call(document.querySelectorAll('#levels .lv[data-id]')).filter(function (b) { return b.dataset.id !== 'mixed'; });
      if (!btns.length) return null;
      var best = (get('writing-room-v1', {}).best) || {}, done = 0, next = null;
      btns.forEach(function (b) {
        var ok = typeof best[b.dataset.id] === 'number' && best[b.dataset.id] >= 90;
        if (ok) done++;
        else if (!next) { var t = b.querySelector('strong'); next = { t: t ? t.textContent : b.dataset.id, set: { k: 'writing-room-v1', f: 'last', v: b.dataset.id } }; }
      });
      return { done: done, total: btns.length, unit: 'levels locked in (90%+)', next: next };
    },
    fde: function () {
      var ids = typeof LESSON_IDS !== 'undefined' ? LESSON_IDS : null, D = typeof DATA !== 'undefined' ? DATA : null; if (!ids || !D) return null;
      var p = (get('fdelab.v1', {}).passes) || {}, done = 0, next = null;
      ids.forEach(function (i) {
        var ok = (p[i] || []).length === 4 && p[i].every(Boolean);
        if (ok) done++; else if (!next) next = { t: i + ' ' + (D.lessons[i].title || ''), h: '#l-' + i };
      });
      return { done: done, total: ids.length, unit: 'lessons, all 4 passes', next: next };
    }
  };

  function report() {
    var fn = R[id]; if (!fn) return;
    var r = null; try { r = fn(); } catch (e) { r = null; }
    if (!r) return;
    r.at = Date.now();
    var all = get('mt.progress', {}); if (!all || typeof all !== 'object') all = {};
    all[id] = r;
    try { localStorage.setItem('mt.progress', JSON.stringify(all)); } catch (e) {}
  }
  function soon() { setTimeout(report, 700); }
  if (document.readyState === 'complete') soon(); else addEventListener('load', soon);
  document.addEventListener('visibilitychange', function () { if (document.hidden) report(); });
  addEventListener('pagehide', report);
  setInterval(report, 15000);
})();
