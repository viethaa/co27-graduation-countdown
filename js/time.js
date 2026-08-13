/* ============================================================
   TIME — every date is reckoned in GMT+7, never the visitor's
   clock, so a classmate abroad sees the same day number.
   ============================================================ */

(function (Roll) {
  'use strict';

  const DAY_MS = 86400000;
  const TZ = Roll.CONFIG.tzOffset;

  // A Date shifted so its UTC getters read as GMT+7 wall-clock time.
  function vnNow() {
    return new Date(Date.now() + TZ * 3600000);
  }

  // 'YYYY-MM-DD' -> whole days since epoch
  function dayIndex(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
  }

  // today's index, in GMT+7
  function todayIndex() {
    const n = vnNow();
    return Math.floor(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) / DAY_MS);
  }

  const FIRST_IDX  = dayIndex(Roll.CONFIG.firstDay);
  const LAST_IDX   = dayIndex(Roll.CONFIG.lastDay);
  const TOTAL_DAYS = LAST_IDX - FIRST_IDX + 1;

  // school day number (1-based) -> Date for that calendar day
  const dateOfDay = n => new Date((FIRST_IDX + n - 1) * DAY_MS);

  // which school day is it right now (clamped to the roll)
  const currentDayNumber = () =>
    Math.min(Math.max(todayIndex() - FIRST_IDX + 1, 1), TOTAL_DAYS);

  const fmt = (opts) => new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'UTC' }, opts));

  const fmtLong  = fmt({ weekday:'long',  day:'numeric', month:'long',  year:'numeric' });
  const fmtShort = fmt({ weekday:'short', day:'numeric', month:'long',  year:'numeric' });
  const fmtTiny  = fmt({ weekday:'short', day:'numeric', month:'short', year:'numeric' });

  // "Wed 12 Aug 2026" — no comma, for the mono film-edge type
  const tiny = d => fmtTiny.format(d).replace(',', '');

  const pad  = n => String(n).padStart(2, '0');
  const pad3 = n => String(n).padStart(3, '0');

  Roll.time = {
    DAY_MS, FIRST_IDX, LAST_IDX, TOTAL_DAYS,
    vnNow, dayIndex, todayIndex, dateOfDay, currentDayNumber,
    fmtLong, fmtShort, fmtTiny, tiny, pad, pad3
  };

})(window.Roll);
