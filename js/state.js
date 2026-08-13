/* ============================================================
   STATE — what day the page is looking at, and small shared
   helpers. `today` is the real school day; `selected` is the one
   the day panel is showing, which the visitor can walk back.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;

  const state = {
    today: T.currentDayNumber(),
    selected: T.currentDayNumber()
  };

  const listeners = [];

  // subscribe to "the selected or current day changed"
  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(fn => fn(state)); }

  function select(n) {
    const clamped = Math.min(Math.max(n, 1), state.today);
    if (clamped === state.selected) return;
    state.selected = clamped;
    emit();
  }

  // called when GMT+7 midnight rolls over
  function setToday(n) {
    const wasOnToday = state.selected === state.today;
    state.today = n;
    if (wasOnToday) state.selected = n;
    emit();
  }

  const photoFor = n => (Roll.PHOTOS && Roll.PHOTOS[n]) || null;

  // every day that has a picture, in order
  const shotDays = () => Object.keys(Roll.PHOTOS || {})
    .map(Number)
    .filter(n => Number.isInteger(n) && n >= 1 && n <= T.TOTAL_DAYS)
    .sort((a, b) => a - b);

  Roll.state = { state, onChange, emit, select, setToday, photoFor, shotDays };
  Roll.$ = id => document.getElementById(id);

})(window.Roll);
