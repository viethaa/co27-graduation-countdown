/* ============================================================
   TOOLTIP — the date for a frame on the contact sheet. The native
   title attribute takes about a second to appear, which is too
   slow for scanning a grid, so this follows the cursor instead.
   ============================================================ */

(function (Roll) {
  'use strict';

  const $ = Roll.$;
  let el;

  function show(anchor, text) {
    if (!el) el = $('tip');
    el.textContent = text;
    el.hidden = false;

    const r = anchor.getBoundingClientRect();
    const t = el.getBoundingClientRect();

    // centred above the frame, nudged back inside the viewport at the edges
    let x = r.left + r.width / 2 - t.width / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - t.width - 8));

    let y = r.top - t.height - 10;
    el.classList.toggle('tip--below', y < 8);
    if (y < 8) y = r.bottom + 10;

    el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  function hide() {
    if (el) el.hidden = true;
  }

  // wire a cell once; works for both pointer and keyboard
  function attach(node, text) {
    node.addEventListener('mouseenter', () => show(node, text));
    node.addEventListener('mouseleave', hide);
    node.addEventListener('focus', () => show(node, text));
    node.addEventListener('blur', hide);
  }

  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);

  Roll.tooltip = { attach, hide };

})(window.Roll);
