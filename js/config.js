/* ============================================================
   CONFIG — the three values everything else derives from.
   Change a date here and the frame count, day numbers, grid,
   countdown and page title all follow.
   ============================================================ */

window.Roll = window.Roll || {};

window.Roll.CONFIG = {
  firstDay: '2026-08-12',   // day 1 of school
  lastDay : '2027-06-04',   // the last day of school
  tzOffset: 7,              // GMT+7, Indochina Time

  // where the "View on GitHub" button in the footer points
  repoUrl: 'https://github.com/viethaa/co27-graduation-countdown',

  /* Days with no school — breaks, holidays, teacher days.
     A single date, or ['first', 'last'] for an inclusive range:

       noSchool: [
         '2026-09-02',                  // one day off
         ['2026-11-25', '2026-11-27'],  // a whole break, ends included
       ]

     Saturdays and Sundays are removed automatically — never list them
     here. Everything else follows: school day numbers skip these dates,
     and the calendar sheet marks them as no-school. */
  noSchool: [

  ]
};
