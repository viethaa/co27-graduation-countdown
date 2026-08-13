## File Structure

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
