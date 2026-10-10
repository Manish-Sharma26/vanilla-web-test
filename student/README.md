# Unit Converter – Mock Assessment

## Overview

You have a partly broken **Unit Converter** web page. Your job is to fix the bugs, implement missing functionality, and style it according to the requirements below.

**Time limit:** 60 minutes (suggested).

---

## Your Files

Edit **only** these three files:

| File | What it does |
|---|---|
| `index.html` | Page structure |
| `style.css` | Styling |
| `script.js` | Conversion logic & wiring |

Do **not** edit `runner.html` or `tests.js`.

---

## How to Run

1. Serve this folder over HTTP (pick one):
   - VS Code **Live Server** extension
   - `npx serve`
   - `python -m http.server`
2. Open either:
   - `editor.html` – Integrated VS Code-style editor with live split-screen preview and real-time test runner.
   - `runner.html` – Standalone test runner interface.
3. Click **Run tests** to see your score.

> ⚠️ Do **not** open files directly via `file://` — fetch-based test loading won't work.

---

## Tasks

| # | Area | Task |
|---|---|---|
| 1 | HTML | Add a `<header id="app-header">` as the **first element inside `<body>`**, containing an `<h1>` with the text `Unit Converter`. |
| 2 | CSS | Header spans the full page width, has a visible (non-transparent) background, and its title text is horizontally centered. |
| 3 | CSS | Footer background colour must be exactly `#1e3a8a`. |
| 4 | CSS | `#converter-card` must be horizontally centered on the page (any method). |
| 5 | CSS | The input, both dropdowns and the Convert button must sit **in one row**. |
| 6 | JS | Implement the four stub functions (`poundsToKg`, `fahrenheitToCelsius`, `metersToFeet`, `feetToMeters`). The formula is in each function's comment. |
| 7 | JS | Fix the bug in `milesToKm` and the wrong wiring for `lb → kg` in `convert()`. |
| 8 | JS | Make **Convert** work: attach a click listener to `#convert-btn`, read the three inputs, call `convert()`, and show the result in `#result` as `10 km = 6.21 mi` (rounded to at most 2 decimals). |
| 9 | JS | For an unsupported pair (e.g. `km → kg`), show `Conversion not supported` in `#error` and leave `#result` empty. |

---

## Rules

- **No external libraries.** No CDN links, no npm packages.
- **No ES modules.** Everything runs as classic `<script>` tags.
- **Keep these IDs/names** (tests depend on them):
  `#app-header`, `header`, `main`, `footer`, `#converter-card`, `#value-input`, `#from-unit`, `#to-unit`, `#convert-btn`, `#result`, `#error`, `convert()`, and all eight conversion function names (`kmToMiles`, `milesToKm`, `metersToFeet`, `feetToMeters`, `kgToPounds`, `poundsToKg`, `celsiusToFahrenheit`, `fahrenheitToCelsius`).

---

## Heads Up

More (hidden) checks may be run at the end — for example, testing unusual inputs, edge cases, and state management. Think beyond the listed tasks!

---

Good luck! 🚀

