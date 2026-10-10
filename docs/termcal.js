// Termcal: turn a weekly timetable into calendar events for the whole term.
// Everything runs in the browser; nothing is uploaded.
(function () {
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var TYPES = ['Lecture', 'Seminar', 'Tutorial', 'Lab', 'Language class', 'Workshop', 'Other'];
  var KEY = 'termcal.v1';
  var $ = function (id) { return document.getElementById(id); };
  var body = document.getElementById('classes');
  var uid = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function row(c) {
    c = c || { name: '', type: 'Lecture', day: 0, start: '10:00', end: '11:00', room: '', weeks: 'all' };
    var n = ++uid;
    var f = function (cls, label, control) { return '<div class="field ' + cls + '"><label for="' + cls + n + '">' + label + '</label>' + control.replace('ID', cls + n) + '</div>'; };
    var div = document.createElement('div');
    div.className = 'cls';
    div.innerHTML =
      f('c-name', 'Class', '<input id="ID" type="text" data-k="name" placeholder="Module or class name" value="' + esc(c.name) + '">') +
      f('c-type', 'Type', '<select id="ID" data-k="type">' + TYPES.map(function (t) { return '<option' + (t === c.type ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select>') +
      f('c-day', 'Day', '<select id="ID" data-k="day">' + DAYS.map(function (d, i) { return '<option value="' + i + '"' + (i === Number(c.day) ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select>') +
      f('c-start', 'Starts', '<input id="ID" type="time" data-k="start" value="' + esc(c.start) + '">') +
      f('c-end', 'Ends', '<input id="ID" type="time" data-k="end" value="' + esc(c.end) + '">') +
      f('c-room', 'Room', '<input id="ID" type="text" data-k="room" placeholder="Room" value="' + esc(c.room) + '">') +
      f('c-weeks', 'Weeks', '<input id="ID" type="text" data-k="weeks" placeholder="all" value="' + esc(c.weeks) + '">') +
      '<div class="c-del"><button class="b icon" type="button" aria-label="Remove class" title="Remove">&times;</button></div>';
    div.querySelector('button').onclick = function () { div.remove(); update(); };
    body.appendChild(div);
  }

  function read() {
    var classes = [].map.call(body.querySelectorAll('.cls'), function (tr) {
      var c = {};
      tr.querySelectorAll('[data-k]').forEach(function (el) { c[el.dataset.k] = el.value.trim(); });
      c.day = Number(c.day);
      return c;
    });
    return { name: $('t-name').value.trim() || 'Term', start: $('t-start').value, weeks: Math.max(1, Math.min(30, Number($('t-weeks').value) || 1)), skip: $('t-skip').value, classes: classes };
  }

  function parseWeeks(text, max) {
    var out = new Set();
    text = (text || '').trim().toLowerCase();
    if (!text || text === 'all') { for (var i = 1; i <= max; i++) out.add(i); return out; }
    text.split(/[,\s]+/).forEach(function (part) {
      var m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) return;
      var a = Number(m[1]), b = Number(m[2] || m[1]);
      for (var w = Math.min(a, b); w <= Math.max(a, b); w++) if (w >= 1 && w <= max) out.add(w);
    });
    return out;
  }

  function monday(iso) {
    if (!iso) return null;
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return null;
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }

  function sessions(t) {
    var start = monday(t.start);
    if (!start) return [];
    var skip = t.skip.trim() ? parseWeeks(t.skip, t.weeks) : new Set();
    var out = [];
    t.classes.forEach(function (c, ci) {
      if (!c.name || !c.start || !c.end || c.end <= c.start) return;
      parseWeeks(c.weeks, t.weeks).forEach(function (w) {
        if (skip.has(w)) return;
        var d = new Date(start);
        d.setDate(d.getDate() + (w - 1) * 7 + c.day);
        out.push({ c: c, ci: ci, week: w, date: d });
      });
    });
    return out.sort(function (a, b) { return a.date - b.date || a.c.start.localeCompare(b.c.start); });
  }

  var fmt = function (d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

  function update() {
    var t = read();
    var list = sessions(t);
    var skip = t.skip.trim() ? parseWeeks(t.skip, t.weeks) : new Set();
    $('s-count').textContent = list.length;
    $('s-weeks').textContent = (t.weeks - skip.size) + (skip.size ? ' (' + skip.size + ' skipped)' : '');
    var start = monday(t.start);
    if (start) {
      var end = new Date(start); end.setDate(end.getDate() + t.weeks * 7 - 3);
      $('s-dates').textContent = fmt(start) + ' to ' + fmt(end) + ' ' + end.getFullYear();
    } else {
      $('s-dates').textContent = 'Choose a start date';
    }
    var valid = t.classes.filter(function (c) { return c.name && c.start && c.end && c.end > c.start; });
    var weekend = valid.some(function (c) { return c.day > 4; });
    var days = weekend ? 7 : 5;
    var html = '<div class="week" style="--days:' + days + '">';
    for (var i = 0; i < days; i++) {
      var slots = valid.filter(function (c) { return c.day === i; }).sort(function (a, b) { return a.start.localeCompare(b.start); });
      html += '<div class="day"><h5>' + DAYS[i].slice(0, 3) + '</h5>' + slots.map(function (c) {
        return '<div class="slot"><b>' + esc(c.name) + '</b><span>' + esc(c.start) + '&ndash;' + esc(c.end) + '</span>' + (c.room ? '<span>' + esc(c.room) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    }
    html += '</div>';
    $('preview').innerHTML = valid.length ? html : '<p class="empty">Add a class to see your week.</p>';
    $('download').disabled = !list.length;
    try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {}
  }

  function stamp(d, hm) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    var parts = hm.split(':');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + 'T' + p(parts[0]) + p(parts[1]) + '00';
  }
  function icsText(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function fold(line) { var out = []; while (line.length > 74) { out.push(line.slice(0, 74)); line = ' ' + line.slice(74); } out.push(line); return out.join('\r\n'); }

  function download() {
    var t = read();
    var list = sessions(t);
    if (!list.length) return;
    var now = new Date();
    var dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var id = Math.random().toString(36).slice(2, 10);
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Unikit//Termcal 1.0//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', fold('X-WR-CALNAME:' + icsText(t.name + ' timetable'))];
    list.forEach(function (s, i) {
      var c = s.c;
      lines.push('BEGIN:VEVENT',
        'UID:termcal-' + id + '-' + i + '@unikit',
        'DTSTAMP:' + dtstamp,
        'DTSTART:' + stamp(s.date, c.start),
        'DTEND:' + stamp(s.date, c.end),
        fold('SUMMARY:' + icsText(c.name + (c.type && c.type !== 'Other' ? ' (' + c.type + ')' : ''))),
        fold('LOCATION:' + icsText(c.room)),
        fold('DESCRIPTION:' + icsText(t.name + ', week ' + s.week)),
        'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = t.name + ' timetable (Termcal).ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
    $('status').textContent = 'Saved ' + list.length + ' sessions. Open the file to add them to your calendar.';
  }

  function sample() {
    body.innerHTML = '';
    [
      { name: 'Introduction to Example Studies', type: 'Lecture', day: 0, start: '10:00', end: '12:00', room: 'Main Building G2', weeks: 'all' },
      { name: 'Introduction to Example Studies', type: 'Seminar', day: 2, start: '14:00', end: '15:00', room: 'Room 401', weeks: '2-11' },
      { name: 'Research Methods', type: 'Workshop', day: 3, start: '09:00', end: '11:00', room: 'Library L1', weeks: '1-5, 7-10' }
    ].forEach(row);
    update();
  }

  // Restore the last timetable on this device, or start with one empty row
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (saved && saved.classes) {
    $('t-name').value = saved.name || 'Term 1';
    $('t-start').value = saved.start || '';
    $('t-weeks').value = saved.weeks || 11;
    $('t-skip').value = saved.skip || '';
    (saved.classes.length ? saved.classes : [null]).forEach(row);
  } else {
    row();
  }
  document.querySelector('.app').addEventListener('input', update);
  document.querySelector('.app').addEventListener('change', update);
  $('add').onclick = function () { row(); update(); body.lastElementChild.querySelector('input').focus(); };
  $('sample').onclick = sample;
  $('download').onclick = download;
  update();
})();
