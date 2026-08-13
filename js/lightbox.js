/* ============================================================
   LIGHTBOX — a photo at full size, with the arrows stepping
   between days that actually have one.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T = Roll.time;
  const S = Roll.state;
  const $ = Roll.$;

  let day = null;
  let lastFocus = null;

  function open(n) {
    const p = S.photoFor(n);
    if (!p) return;

    day = n;
    lastFocus = document.activeElement;

    $('lbImg').src = p.file;
    $('lbImg').alt = p.caption || `Day ${T.pad3(n)} of senior year`;
    $('lbDay').textContent  = `Day ${T.pad3(n)}`;
    $('lbDate').textContent = T.fmtLong.format(T.dateOfDay(n));
    $('lbCap').textContent  = p.caption || '';

    const shots = S.shotDays();
    const i = shots.indexOf(n);
    $('lbPrev').disabled = i <= 0;
    $('lbNext').disabled = i < 0 || i >= shots.length - 1;

    $('lightbox').hidden = false;
    $('lbClose').focus();
  }

  function close() {
    $('lightbox').hidden = true;
    day = null;
    if (lastFocus) lastFocus.focus();
  }

  function step(dir) {
    const shots = S.shotDays();
    const next = shots[shots.indexOf(day) + dir];
    if (next !== undefined) open(next);
  }

  function init() {
    $('lbClose').addEventListener('click', close);
    $('lbPrev').addEventListener('click', () => step(-1));
    $('lbNext').addEventListener('click', () => step(1));
    $('lightbox').addEventListener('click', e => {
      if (e.target === $('lightbox')) close();
    });

    document.addEventListener('keydown', e => {
      if ($('lightbox').hidden) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  Roll.lightbox = { init, open, close };

})(window.Roll);
