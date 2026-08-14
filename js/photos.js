(function (Roll) {
  'use strict';

  const $ = Roll.$;
  const MAX_BYTES = 10 * 1024 * 1024;
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  async function upload(event) {
    event.preventDefault();
    const file = $('photoFile').files[0];
    const booking = Roll.bookings.forDay(Roll.state.state.selected);
    if (!file || !booking || booking.user_id !== Roll.backend.user.id) return;
    if (!allowed.includes(file.type) || file.size > MAX_BYTES) {
      Roll.bookings.message('Upload failed: choose a JPG, PNG, or WebP image under 10 MB.', true);
      return;
    }

    Roll.bookings.setBusy(true);
    Roll.bookings.message('Uploading photo...');
    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = `${Roll.backend.user.id}/${booking.date}.${ext}`;
    const storage = Roll.backend.client.storage.from(Roll.CONFIG.photoBucket);
    const result = await storage.upload(path, file, { upsert: true, contentType: file.type });
    if (result.error) {
      Roll.bookings.message('Upload failed. Please try again.', true);
    } else {
      const publicUrl = `${storage.getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
      const updated = await Roll.backend.client.from('bookings')
        .update({ photo_path: path, photo_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', booking.id).select().single();
      if (updated.error) {
        Roll.bookings.message('Upload failed while saving the photo. Please try again.', true);
      } else {
        Roll.bookings.records.set(Roll.state.state.selected, updated.data);
        $('photoFile').value = '';
        $('photoName').textContent = 'No file chosen';
        Roll.bookings.message('Photo uploaded successfully');
        Roll.dayPanel.render();
        Roll.sheet.build();
      }
    }
    Roll.bookings.setBusy(false);
    Roll.bookings.render();
  }

  $('uploadForm').addEventListener('submit', upload);
})(window.Roll);
