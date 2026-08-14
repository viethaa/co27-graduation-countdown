/* ============================================================
   MAIN — wire the pieces together and start the clock.
   Load order is set in index.html; this runs last.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;
  const $ = Roll.$;

  // the sticky masthead eats into every full-screen section
  function measureMasthead() {
    const h = $('masthead').offsetHeight;
    document.documentElement.style.setProperty('--masthead-h', h + 'px');
  }

  function init() {
    // anything printed in the HTML as a fallback gets corrected here,
    // so the page stays honest if the dates in config.js ever move
    $('finalDate').textContent = T.fmtShort.format(new Date(T.LAST_IDX * T.DAY_MS));

    $('repoLink').href = Roll.CONFIG.repoUrl;
    $('year').textContent = new Date().getUTCFullYear();

    measureMasthead();
    window.addEventListener('resize', measureMasthead);

    Roll.lightbox.init();
    Roll.dayPanel.init();
    Roll.sheet.init();
    Roll.counter.start();
    Roll.bookings.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window.Roll);
