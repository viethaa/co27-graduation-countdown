/* ============================================================
   CONTACT SHEET — one frame per school day for the whole year.

   A frame's colour is its status, not whether it has a picture:
     completed  every day already lived
     today      the day in progress
     remaining  still to come
   A photo, when there is one, fills its frame.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;
  const S = Roll.state;
  const $ = Roll.$;

  const cells = [];

  function build() {
    const grid = $('grid');
    grid.innerHTML = '';
    cells.length = 0;

    const frag = document.createDocumentFragment();

    for (let n = 1; n <= T.TOTAL_DAYS; n++) {
      const date = T.dateOfDay(n);
      const past = n <= S.state.today;

      const cell = document.createElement(past ? 'button' : 'div');
      cell.className = 'cell';
      cell.setAttribute('role', 'listitem');
      if (date.getUTCDate() === 1) cell.classList.add('cell--month');

      // no thumbnails here on purpose — a frame's colour is its status,
      // and 297 tiny photos read as noise rather than progress
      const label = `Day ${T.pad3(n)} · ${T.tiny(date)}`;

      if (past) {
        cell.type = 'button';
        cell.setAttribute('aria-label', `${label}. Show this day.`);
        cell.addEventListener('click', () => {
          S.select(n);
          $('day').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }

      Roll.tooltip.attach(cell, label);

      cells[n] = cell;
      frag.appendChild(cell);
    }

    grid.appendChild(frag);
    paint();
  }

  // status classes only — cheap enough to run on every selection change
  function paint() {
    const { today, selected } = S.state;

    for (let n = 1; n <= T.TOTAL_DAYS; n++) {
      const c = cells[n];
      if (!c) continue;
      c.classList.toggle('cell--done',      n <  today);
      c.classList.toggle('cell--today',     n === today);
      c.classList.toggle('cell--remaining', n >  today);
      c.classList.toggle('is-selected',     n === selected);
    }
  }

  function init() {
    build();
    let lastToday = S.state.today;
    S.onChange(() => {
      // a midnight rollover changes which frames exist as buttons
      if (S.state.today !== lastToday) { lastToday = S.state.today; build(); }
      else paint();
    });
  }

  Roll.sheet = { init };

})(window.Roll);
