/* ============================================================
   CALENDAR SHEET — one frame per school day, and nothing else.

   Weekends and the dates in CONFIG.noSchool are left out entirely:
   they can never hold a photo, so a frame for them would be dead
   space. They still matter to js/time.js, which uses them to decide
   what counts as a school day in the first place.

   A frame's colour says where the day sits:
     completed   already lived — a photo fills it once you add one
     today       the day in progress
     remaining   still to come
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;
  const S = Roll.state;
  const $ = Roll.$;

  const cells = [];   // keyed by school day number

  function build() {
    const grid = $('grid');
    grid.innerHTML = '';
    cells.length = 0;

    const frag = document.createDocumentFragment();
    let lastMonth = null;

    for (let n = 1; n <= T.SCHOOL_DAYS; n++) {
      const date = T.dateOfDay(n);
      const past = n <= S.state.today;

      const cell = document.createElement(past ? 'button' : 'div');
      cell.className = 'cell';
      cell.setAttribute('role', 'listitem');

      // the first school day of each month, since the 1st itself is
      // often a weekend and wouldn't appear on this sheet at all
      const month = date.getUTCFullYear() * 12 + date.getUTCMonth();
      if (month !== lastMonth) {
        if (lastMonth !== null) cell.classList.add('cell--month');
        lastMonth = month;
      }

      const label = `Day ${T.pad(n)} · ${T.tiny(date)}`;

      const p = S.photoFor(n);
      if (p) {
        const img = document.createElement('img');
        img.src = p.thumb || p.file;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', () => cell.classList.add('is-broken'));
        cell.appendChild(img);
      }

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

    for (let n = 1; n <= T.SCHOOL_DAYS; n++) {
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
      // a rollover changes which frames exist as buttons
      if (S.state.today !== lastToday) { lastToday = S.state.today; build(); }
      else paint();
    });
  }

  Roll.sheet = { init };

})(window.Roll);
