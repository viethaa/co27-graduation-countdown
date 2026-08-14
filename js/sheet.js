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

      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.setAttribute('role', 'listitem');
      if (date.getUTCDate() === 1) cell.classList.add('cell--month');

      const booking = Roll.bookings && Roll.bookings.forDay(n);
      const bookable = !Roll.bookings || Roll.bookings.isBookable(n);
      const label = `Day ${T.pad(n)} · ${T.tiny(date)}` +
        (booking
          ? ` · Booked by: ${booking.student_name}`
          : bookable ? ' · Available' : ' · Unavailable for booking');
      cell.classList.toggle('cell--booked', Boolean(booking));
      cell.classList.toggle('cell--unavailable', !bookable);

      // a day's photo fills its frame, so the sheet reads as a strip of
      // film; days without one fall back to their status colour
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

      cell.type = 'button';
      cell.setAttribute('aria-label', `${label}. Show this day.`);
      cell.addEventListener('click', () => {
        S.select(n);
        $('day').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

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
    S.onChange(() => {
      paint();
    });
  }

  Roll.sheet = { init, build };

})(window.Roll);
