/* ============================================================
   STATE — what day the page is looking at.

   `today`    the school day number in progress. On a weekend or a
              break it holds at the last day that actually happened.
   `todayIdx` the real calendar date, which the sheet marks even when
              it isn't a school day.
   `selected` the school day the panel is showing, which a visitor
              can walk back through.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;

  const state = {
    todayIdx: T.todayIndex(),
    today: T.currentSchoolDay(),
    selected: T.currentSchoolDay()
  };

  const listeners = [];

  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(fn => fn(state)); }

  function select(n) {
    const clamped = Math.min(Math.max(n, 1), state.today);
    if (clamped === state.selected) return;
    state.selected = clamped;
    emit();
  }

  // called when GMT+7 midnight rolls over
  function setToday(idx) {
    const wasOnToday = state.selected === state.today;
    state.todayIdx = idx;
    state.today = T.schoolDayOnOrBefore(idx);
    if (wasOnToday) state.selected = state.today;
    emit();
  }

  // is the real calendar date a school day, or are we off?
  const isSchoolToday = () => T.isSchoolDay(state.todayIdx);

  const photoFor = n => (Roll.PHOTOS && Roll.PHOTOS[n]) || null;

  // every school day that has a picture, in order
  const shotDays = () => Object.keys(Roll.PHOTOS || {})
    .map(Number)
    .filter(n => Number.isInteger(n) && n >= 1 && n <= T.SCHOOL_DAYS)
    .sort((a, b) => a - b);

  Roll.state = { state, onChange, emit, select, setToday, isSchoolToday, photoFor, shotDays };
  Roll.$ = id => document.getElementById(id);

})(window.Roll);
