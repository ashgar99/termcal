<p align="center"><img src="docs/logo.svg" width="72" height="72" alt=""></p>
<h3 align="center">Termcal</h3>
<p align="center">Turn your weekly university timetable into calendar events for the whole term, skipping reading weeks.</p>

<p align="center">
  <a href="LICENSE"><img alt="MIT licence" src="https://img.shields.io/github/license/ashgar99/termcal?color=brightgreen" /></a>
  <img alt="Runs in your browser" src="https://img.shields.io/badge/runs-in%20your%20browser-blue" />
  <img alt="No sign-up" src="https://img.shields.io/badge/sign--up-not%20required-blue" />
</p>

<p align="center"><a href="https://ashgar99.github.io/termcal/"><b>Open Termcal</b></a></p>


## Features ✨

- Enter each weekly class once, with its day, time, room and the weeks it runs.
- Week ranges such as `1-5, 7-11`, and skip weeks for reading week, are handled for you.
- Shows a preview of your week and how many sessions the term contains.
- Downloads one standard calendar file (`.ics`) for Apple Calendar, Google Calendar and Outlook.
- Remembers your timetable in your browser, so next term you only need to change the dates.
- Runs entirely in your browser. Nothing is uploaded.


## Usage 🛠

1. Open [Termcal](https://ashgar99.github.io/termcal/).
2. Enter the date teaching week 1 starts (any day in that week works), the number of weeks, and any weeks to skip.
3. Add each class. Use **Weeks** for classes that do not run every week, for example `2-11`.
4. Click **Download calendar file** and open it to add the classes to your calendar.

If your university's timetable system offers a calendar subscription link, use that instead, as it updates automatically when rooms or times change.

| Calendar | How |
| --- | --- |
| Apple Calendar | Double-click the file and choose a calendar. On iPhone, open it from Files or Mail. |
| Google Calendar | On a computer, go to **Settings > Import and export**, choose the file and a calendar. |
| Outlook | Double-click the file, or in Outlook on the web choose **Add calendar > Upload from file**. |

Tip: import into a separate calendar called "Timetable", so you can hide or replace it all at once.


## Browser support 🌐

Works in current versions of Chrome, Edge, Brave, Firefox and Safari, on computers, tablets and phones.

## Troubleshooting 🔧

| Problem | Solution |
| --- | --- |
| A class is missing | Check its end time is after its start time, and that its weeks are not all skip weeks. |
| Classes appear an hour out | Times are saved as local time. Check your calendar app's time zone matches yours. |
| Importing twice made duplicates | Delete the calendar you imported into and import once more. |


## Privacy and security 🔒

Termcal is a single page with no server. Your timetable is stored only in your own browser's local storage on that device, and the calendar file is created on your computer.


## Development 🧩

The whole app lives in [`docs/`](docs): `index.html` for the page and `termcal.js` for the logic. There is no build step.


## Unikit 🎒

Termcal is part of Unikit, a set of free tools for students: [Modzip](https://ashgar99.github.io/moodle-module-downloader/), [Subzip](https://ashgar99.github.io/subzip/), [Duecal](https://ashgar99.github.io/duecal/), [Gradewise](https://ashgar99.github.io/gradewise/), [Wordfair](https://ashgar99.github.io/wordfair/) and [Readable](https://ashgar99.github.io/readable/).

Termcal is not affiliated with or endorsed by Moodle or any university.


## Licence 📑

[MIT](LICENSE)
