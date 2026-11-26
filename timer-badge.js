// Builders Toolbox: floating timer. Shows in the bottom-right corner of any toolbox page
// while a project timer is running, with Open and Stop. Add <script src="timer-badge.js" defer></script> to a page.
(function () {
  var KEY = 'buildersBuildTimer.v1';
  var el = null;
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function hms(ms) { var s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 3600) + ':' + String(Math.floor(s / 60) % 60).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
  function draw() {
    var d = load(), r = d && d.running, p = r && (d.projects || []).find(function (x) { return x.id === r.pid; });
    if (!p) { if (el) el.hidden = true; return; }
    if (!el) {
      el = document.createElement('div');
      el.className = 'tbadge';
      el.setAttribute('role', 'status');
      el.innerHTML = '<span class="pulse" aria-hidden="true"></span><a class="tb-open" href="projects.html"><span class="tb-t"></span><span class="tb-n"></span></a>' +
        '<button type="button" class="tb-stop" aria-label="Stop the timer">■ Stop</button>';
      document.body.appendChild(el);
      el.querySelector('.tb-stop').addEventListener('click', stop);
    }
    el.hidden = false;
    el.querySelector('.tb-t').textContent = hms(Date.now() - r.start);
    el.querySelector('.tb-n').textContent = p.name;
  }
  function stop() {
    var d = load(); if (!d || !d.running) return draw();
    var r = d.running, end = Date.now(), mins = Math.round((end - r.start) / 60000);
    d.running = null;
    if (mins >= 1) d.sessions.push({ id: end.toString(36) + Math.random().toString(36).slice(2, 7), pid: r.pid, start: r.start, end: end, mins: mins, note: r.note || '', submittedAt: null });
    save(d); draw();
  }
  window.addEventListener('storage', function (e) { if (e.key === KEY) draw(); });
  setInterval(draw, 1000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw); else draw();
})();
