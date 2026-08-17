/* ============================================================
   TIME — every date is reckoned in GMT+7, never the visitor's
   clock, so a classmate abroad sees the same day number.

   Two different things get counted here, and they are not the same:

     calendar days  every date from the first day to the last. The
                    countdown runs on these, because time passes on
                    weekends too.
     school days    only the weekdays that aren't in CONFIG.noSchool.
                    Day numbers and photos run on these.
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

  function todayIndex() {
    const n = vnNow();
    return Math.floor(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) / DAY_MS);
  }

  const FIRST_IDX = dayIndex(Roll.CONFIG.firstDay);
  const LAST_IDX  = dayIndex(Roll.CONFIG.lastDay);
  const CALENDAR_DAYS = LAST_IDX - FIRST_IDX + 1;

  const dateOfIndex = idx => new Date(idx * DAY_MS);

  /* ─── what kind of day is it ───────────────────────────── */

  // 1970-01-01 was a Thursday, so index + 4 mod 7 gives 0=Sun … 6=Sat
  const weekdayOf = idx => (idx + 4) % 7;
  const isWeekend = idx => weekdayOf(idx) === 0 || weekdayOf(idx) === 6;

  // expand CONFIG.noSchool — single dates and inclusive ranges — to a Set
  const noSchool = new Set();
  (Roll.CONFIG.noSchool || []).forEach(entry => {
    if (Array.isArray(entry)) {
      const a = dayIndex(entry[0]);
      const b = dayIndex(entry[1]);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) noSchool.add(i);
    } else {
      noSchool.add(dayIndex(entry));
    }
  });

  const isBreak = idx => noSchool.has(idx);

  const isSchoolDay = idx =>
    idx >= FIRST_IDX && idx <= LAST_IDX && !isWeekend(idx) && !isBreak(idx);

  const KIND = { SCHOOL: 'school', WEEKEND: 'weekend', BREAK: 'break' };
  const kindOf = idx =>
    isWeekend(idx) ? KIND.WEEKEND : isBreak(idx) ? KIND.BREAK : KIND.SCHOOL;

  /* ─── school day numbering ─────────────────────────────── */

  // every school day in order; its position + 1 is its number
  const schoolDays = [];
  for (let i = FIRST_IDX; i <= LAST_IDX; i++) if (isSchoolDay(i)) schoolDays.push(i);
  const SCHOOL_DAYS = schoolDays.length;

  const indexOfSchoolDay = n => schoolDays[n - 1];

  const numberOfIndex = idx => {
    const p = schoolDays.indexOf(idx);
    return p < 0 ? null : p + 1;
  };

  // the latest school day on or before idx, so a weekend or a break
  // still shows the last day that actually happened
  function schoolDayOnOrBefore(idx) {
    let lo = 0, hi = schoolDays.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (schoolDays[mid] <= idx) { found = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return found < 0 ? 1 : found + 1;
  }

  const currentSchoolDay = () => schoolDayOnOrBefore(todayIndex());

  // date for school day n
  const dateOfDay = n => dateOfIndex(indexOfSchoolDay(n));

  /* ─── formatting ───────────────────────────────────────── */

  const fmt = opts => new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'UTC' }, opts));

  const fmtLong  = fmt({ weekday:'long',  day:'numeric', month:'long',  year:'numeric' });
  const fmtShort = fmt({ weekday:'short', day:'numeric', month:'long',  year:'numeric' });
  const fmtTiny  = fmt({ weekday:'short', day:'numeric', month:'short', year:'numeric' });

  // "Wed 12 Aug 2026" — no comma, for the mono film-edge type
  const tiny = d => fmtTiny.format(d).replace(',', '');

  // two digits: 01 … 99, then 100 upward as they come
  const pad = n => String(n).padStart(2, '0');

  Roll.time = {
    DAY_MS, FIRST_IDX, LAST_IDX, CALENDAR_DAYS, SCHOOL_DAYS, KIND,
    vnNow, dayIndex, todayIndex, dateOfIndex, dateOfDay,
    isWeekend, isBreak, isSchoolDay, kindOf,
    indexOfSchoolDay, numberOfIndex, schoolDayOnOrBefore, currentSchoolDay,
    fmtLong, fmtShort, fmtTiny, tiny, pad
  };

})(window.Roll);
