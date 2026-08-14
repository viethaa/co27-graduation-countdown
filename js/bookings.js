(function (Roll) {
  'use strict';

  const T = Roll.time;
  const S = Roll.state;
  const $ = Roll.$;
  const records = new Map();
  let busy = false;

  const isoForDay = n => new Date(T.dateOfDay(n)).toISOString().slice(0, 10);
  const dayForIso = iso => T.dayIndex(iso) - T.FIRST_IDX + 1;
  const forDay = n => records.get(n) || null;
  const isBookable = n => n >= Roll.CONFIG.firstBookableDay;

  function message(text, error) {
    $('bookingMessage').textContent = text || '';
    $('bookingMessage').classList.toggle('is-error', Boolean(error));
  }

  function setBusy(value) {
    busy = value;
    $('bookingSubmit').disabled = value;
    $('uploadSubmit').disabled = value;
    $('photoFile').disabled = value;
  }

  function render() {
    const booking = forDay(S.state.selected);
    const ready = Roll.backend.configured && Roll.backend.user;
    $('bookingForm').hidden = !ready || Boolean(booking) || !isBookable(S.state.selected);
    $('uploadForm').hidden = !ready || !booking || booking.user_id !== Roll.backend.user.id;

    if (!Roll.backend.configured) {
      $('bookingStatus').textContent = 'Booking is not configured yet.';
    } else if (!Roll.backend.user) {
      $('bookingStatus').textContent = 'Loading bookings...';
    } else if (!isBookable(S.state.selected)) {
      $('bookingStatus').textContent = 'This day is unavailable for booking';
    } else if (booking) {
      $('bookingStatus').textContent = `Booked by: ${booking.student_name}`;
    } else {
      $('bookingStatus').textContent = 'This day is available';
    }
  }

  async function load() {
    const { data, error } = await Roll.backend.client
      .from('bookings')
      .select('id,date,student_name,user_id,photo_url,photo_path');
    if (error) throw error;
    records.clear();
    data.forEach(row => {
      const n = dayForIso(row.date);
      if (n >= 1 && n <= T.TOTAL_DAYS) records.set(n, row);
    });
  }

  async function book(event) {
    event.preventDefault();
    if (busy || forDay(S.state.selected) || !isBookable(S.state.selected)) return;
    const name = $('studentName').value.trim();
    if (!name) return;
    setBusy(true);
    message('Booking...');
    const row = { date: isoForDay(S.state.selected), student_name: name, user_id: Roll.backend.user.id };
    const { data, error } = await Roll.backend.client.from('bookings').insert(row).select().single();
    if (error) {
      message(error.code === '23505' ? 'Booking failed: this day was just booked by someone else.' : 'Booking failed. Please try again.', true);
      await load().catch(() => {});
    } else {
      records.set(S.state.selected, data);
      $('studentName').value = '';
      message('Booking successful');
    }
    setBusy(false);
    render();
    Roll.sheet.build();
  }

  async function init() {
    $('bookingForm').addEventListener('submit', book);
    $('photoFile').addEventListener('change', () => {
      $('photoName').textContent = $('photoFile').files[0]?.name || 'No file chosen';
    });
    if (!Roll.backend.configured) { render(); return; }
    try {
      let { data } = await Roll.backend.client.auth.getUser();
      if (!data.user) {
        const result = await Roll.backend.client.auth.signInAnonymously();
        if (result.error) throw result.error;
        data = result.data;
      }
      Roll.backend.user = data.user;
      await load();
      message('');
      render();
      Roll.dayPanel.render();
      Roll.sheet.build();
    } catch (error) {
      console.error(error);
      $('bookingStatus').textContent = 'Bookings could not be loaded.';
      message('Booking failed. Check the setup and try again.', true);
    }
  }

  Roll.bookings = { init, render, forDay, isBookable, records, setBusy, message };
})(window.Roll);
