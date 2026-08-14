/* ============================================================
   DAY PANEL — one school day at a time. Opens on today; the
   arrows walk back through every day already lived, down to 001.
   ============================================================ */

(function (Roll) {
  'use strict';

  const T  = Roll.time;
  const S  = Roll.state;
  const $  = Roll.$;

  function renderPlate(n) {
    const p     = S.photoFor(n);
    const inner = $('plateInner');

    if (p) {
      inner.innerHTML = '';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'plate__open';
      btn.setAttribute('aria-label', `Open the photo for day ${T.pad(n)}`);

      const img = document.createElement('img');
      img.src = p.file;
      img.alt = p.caption || `Day ${T.pad(n)} of senior year`;
      img.addEventListener('error', () => empty(n, 'Photo missing from the photos folder.'));

      btn.appendChild(img);
      btn.addEventListener('click', () => Roll.lightbox.open(n));
      inner.appendChild(btn);

      // no status line when there's a photo — the photo says it
      $('dayHint').textContent = '';
      $('plateCap').textContent = p.caption || '';
    } else {
      empty(n, n === S.state.today
        ? 'Not developed yet. Check back tonight.'
        : 'No photo for this day.');
    }
  }

  function empty(n, hint) {
    $('plateInner').innerHTML =
      '<span class="plate__empty">' +
        '<span class="plate__empty-mark" aria-hidden="true">⌁</span>' +
        '<span class="plate__empty-text">Undeveloped</span>' +
      '</span>';
    $('dayHint').textContent  = hint;
    $('plateCap').textContent = '';
  }

  function render() {
    const n = S.state.selected;

    $('dayNum').textContent  = T.pad(n);
    $('dayDate').textContent = T.fmtLong.format(T.dateOfDay(n));

    $('dayPrev').disabled = n <= 1;
    $('dayNext').disabled = n >= S.state.today;
    $('dayToday').hidden  = n === S.state.today;

    renderPlate(n);
  }

  function init() {
    $('dayPrev').addEventListener('click', () => S.select(S.state.selected - 1));
    $('dayNext').addEventListener('click', () => S.select(S.state.selected + 1));
    $('dayToday').addEventListener('click', () => S.select(S.state.today));

    S.onChange(render);
    render();
  }

  Roll.dayPanel = { init, render };

})(window.Roll);
