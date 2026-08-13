/* ============================================================
   YOUR PHOTO MANIFEST — the only file you edit day to day.

   To add a day:
     1. Put the photo in  photos/  named by day number:
        photos/002.jpg
     2. Add or uncomment its line below.
     3. Save, refresh.

   Days not listed here still count as completed once they pass —
   the calendar sheet shows status by colour, not by picture.
   Nobody but you can add photos; the page has no upload.
   ============================================================ */

window.Roll = window.Roll || {};

// placeholder standing in for both days until the real photos exist
const PLACEHOLDER = 'https://hearts2hands.s3.ap-southeast-2.amazonaws.com/pop/day1.jpg';

window.Roll.PHOTOS = {

  1: { file: PLACEHOLDER, caption: 'First day of our senior year!' },
  2: { file: PLACEHOLDER, caption: '' },

  // 3: { file: 'photos/003.jpg', caption: '' },

};
