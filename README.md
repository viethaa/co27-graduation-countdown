# The Roll

A countdown to the last day of senior year, built as a 297-exposure roll of film.
One frame per school day. The number counting down *is* the number of school days
not yet lived.

**Concordia Hanoi · Class of 2027 · 12 Aug 2026 → 4 Jun 2027 · 297 days · GMT+7**

## It's read-only

The page has no upload, no login, no storage. Visitors can look at the roll, walk
back through past days and open photos — nothing else. Only you add photos, by
editing `data/photos.js`. Safe to send to the whole class.

## Structure

```
index.html            markup only — no styles, no logic

css/
  base.css            design tokens, reset, page canvas, shared button
  masthead.css        the header
  counter.css         the countdown
  day-panel.css       school day number, its arrows, the photo plate
  sheet.css           the contact sheet and its frames
  lightbox.css        full-size photo view
  tooltip.css         the date-on-hover bubble
  footer.css
  responsive.css      all media queries — loaded last so it wins

js/
  config.js           the three dates. Start here.
  time.js             all GMT+7 date maths
  state.js            which day is today, which day is on screen
  counter.js          the countdown and the date on the film edge
  day-panel.js        the school-day panel and its arrows
  sheet.js            builds and paints the 297 frames
  tooltip.js          hover/focus date bubble
  lightbox.js         full-size photo view
  main.js             boots everything

data/
  photos.js           YOUR PHOTO LIST — the only file you edit day to day

photos/               the image files themselves
logo.png              school mark shown in the banner
```

Load order is fixed in `index.html`: config → time → data → state → views → boot.
Plain scripts sharing one `Roll` namespace, no build step and no modules, so it
runs from any static host.

## Run it locally

```bash
cd ~/Documents/senior-countdown
python3 -m http.server 8747
```

Open <http://localhost:8747>.

## Adding today's photo

1. Save the photo into `photos/` named by day number — `photos/002.jpg` for
   day 2. Resize the long edge to ~1600px first.
2. Open `data/photos.js` and add the line:

   ```js
   2: { file: 'photos/002.jpg', caption: 'Something that happened.' },
   ```

3. Save and refresh.

Days without a photo still count as completed once they pass. The calendar sheet
shows status by colour only — green completed, orange today, grey remaining — so
photos appear in the day panel and the lightbox, not in the grid.

## Sharing it

Any static host works, no build step. Drag the folder onto
[netlify.com/drop](https://app.netlify.com/drop) for an instant link, or push to
GitHub and turn on Pages. Re-upload whenever you add photos.

## Changing the dates

`js/config.js`:

```js
window.Roll.CONFIG = {
  firstDay: '2026-08-12',   // day 1 of school
  lastDay : '2027-06-04',   // the last day of school
  tzOffset: 7               // GMT+7, Indochina Time
};
```

The frame count, day numbers, countdown, grid, page title and film-edge markings
all derive from these three values.

## How the countdown works

- **Days** — calendar days in GMT+7 from today to the last day of school. It
  turns over at Vietnam midnight, so it reads the same all day and shows the same
  number to a classmate opening it from anywhere in the world.
- **Hours, minutes, seconds** — the time left in today, running down to GMT+7
  midnight.

Together they're exact: `days + hh:mm:ss` is precisely the time remaining until
the last school day ends.
