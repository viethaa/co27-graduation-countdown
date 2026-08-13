/* ============================================================
   COUNTER — the countdown, and the date stamped on the film edge.

   days  = calendar days (GMT+7) from today to the last day of school
   clock = time left in today, running down to GMT+7 midnight

   Together these are exact: days + clock is precisely the time
   until the last school day ends. Because the day figure only
   turns over at Vietnam midnight, it reads the same all day
   wherever in the world the page is opened.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;
  const $ = Roll.$;

  function stampToday() {
    const n = T.vnNow();
    const d = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
    $('sheetDate').textContent = T.tiny(d).toUpperCase();
  }

  function tick() {
    const idx = T.todayIndex();

    const n = T.vnNow();
    const msIntoDay =
      ((n.getUTCHours() * 60 + n.getUTCMinutes()) * 60 + n.getUTCSeconds()) * 1000 +
      n.getUTCMilliseconds();
    const rem = T.DAY_MS - msIntoDay;

    $('dd').textContent = Math.max(0, T.LAST_IDX - idx);
    $('hh').textContent = T.pad(Math.floor(rem / 3600000));
    $('mm').textContent = T.pad(Math.floor(rem / 60000) % 60);
    $('ss').textContent = T.pad(Math.floor(rem / 1000) % 60);

    const day = T.currentDayNumber();
    if (day !== Roll.state.state.today) {
      Roll.state.setToday(day);
      stampToday();
    }
  }

  function start() {
    stampToday();
    tick();
    setInterval(tick, 1000);
  }

  Roll.counter = { start };

})(window.Roll);
