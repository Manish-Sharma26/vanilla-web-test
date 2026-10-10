# Facilitator Guide – Unit Converter Mock Assessment

## Overview

This is a mock of the "fix and extend an existing web project" round of a campus SDE-intern online assessment. Students receive a partly broken Unit Converter page and must fix bugs, implement missing functions, add HTML/CSS, and wire up event handling.

---

## Repo Structure

```
unit-converter-mock/
├── index.html                ← Interactive Web IDE (VS Code-style editor + live preview)
├── student/                  ← what students receive
│   ├── index.html            ← starter (incomplete — no header)
│   ├── style.css             ← starter (incomplete — no centering, grey footer)
│   ├── script.js             ← starter (4 stubs, 2 planted bugs, no click handler)
│   ├── editor.html           ← Web IDE for student folder
│   ├── runner.html           ← test runner UI (students don't edit)
│   ├── tests.js              ← visible tests + mini framework (students don't edit)
│   └── README.md             ← student-facing task statement
├── hidden/
│   └── hidden-tests.js       ← hidden tests (add to student/ at the end)
├── solution/
│   ├── index.html            ← reference solution (100/100)
│   ├── style.css             ← reference CSS
│   ├── script.js             ← reference JS
│   └── alt-css.css           ← alternate CSS approach (proves tests are approach-agnostic)
├── dev/
│   └── verify.mjs            ← Playwright headless verification (dev only)
└── FACILITATOR.md            ← this file
```

---

## Hosting

The student project is **100% static** — no backend, no build step, no npm. Options:

1. **GitHub Pages**: push `student/` to a repo, enable Pages.
2. **Netlify / Vercel**: drag-and-drop the `student/` folder.
3. **Local**: `cd student && python -m http.server 8080` or `npx serve`.

> ⚠️ Files must be served over HTTP. The `file://` protocol won't work due to `fetch()` calls in the test runner.

---

## Running Tests

### Visible Tests (85 points)
Students open `runner.html` and click **Run tests**. Tests are defined in `tests.js`.

### Hidden Tests (15 points)
1. Copy `hidden/hidden-tests.js` into `student/`.
2. Refresh `runner.html`. The "Run hidden tests" button will auto-enable.
3. Click **Run hidden tests** to run all 24 tests (visible + hidden).

---

## Scoring

| Category | Points |
|----------|--------|
| Visible  | 85     |
| Hidden   | 15     |
| **Total**| **100**|

**Expected scores:**
- Starter code: **4 / 100** (only T15 — pre-implemented functions — passes)
- Reference solution: **100 / 100**

---

## Test IDs & Weights

### Visible Tests (in `tests.js`)

| ID | Category | Test | Pts |
|---|---|---|---|
| T01 | HTML | `#app-header` exists, is `<header>`, first child of `<body>` | 5 |
| T02 | HTML | Header `<h1>` text is "Unit Converter" | 5 |
| T03 | CSS | Header full width | 4 |
| T04 | CSS | Header non-transparent background | 4 |
| T05 | CSS | Header title centered (Range-based) | 5 |
| T06 | CSS | Footer background is `rgb(30, 58, 138)` | 5 |
| T07 | CSS | `#converter-card` centered at 1280 & 800 px | 4 |
| T08 | CSS | Controls in one row | 3 |
| T09 | JS | `poundsToKg` correct | 4 |
| T10 | JS | `fahrenheitToCelsius` correct | 4 |
| T11 | JS | `metersToFeet` correct | 4 |
| T12 | JS | `feetToMeters` correct | 4 |
| T13 | JS | `milesToKm` correct (bug fixed) | 5 |
| T14 | JS | `convert()` lb→kg & unsupported | 5 |
| T15 | JS | Pre-implemented functions still work | 4 |
| T16 | Wiring | Convert 10 km→mi shows 6.21 | 6 |
| T17 | Wiring | Result format `10 km = 6.21 mi` | 6 |
| T18 | Wiring | Second conversion updates result | 4 |
| T19 | Wiring | Unsupported pair → error, no result | 4 |

### Hidden Tests (in `hidden/hidden-tests.js`)

| ID | Test | Pts |
|---|---|---|
| H1 | Empty input → "valid number" error | 3 |
| H2 | Non-numeric "abc" → same error | 3 |
| H3 | Same unit km→km → result = input | 3 |
| H4 | Negative temperature -40 C→F | 3 |
| H5 | Stale state: error clears result, valid clears error | 3 |

---

## Design Assumptions

- **Outcome-based testing only**: Tests check rendered/computed results, never grep source code. Any valid CSS/JS approach that achieves the correct outcome will pass.
- **Centering tests**: Use `getBoundingClientRect()` at two widths (1280 & 800 px) to reject hard-coded offsets.
- **Header text centering**: Uses `Range.getBoundingClientRect()` to measure actual text position — works with `text-align`, flexbox, grid, or any other method.
- **One-row check**: Compares `top` positions of all 4 control elements (tolerance: 5 px).
- **Footer colour**: Compares computed `backgroundColor` against `rgb(30, 58, 138)`.
- **Same-unit conversion** (`km→km`): Returns the input value unchanged. The starter's `convert()` doesn't handle this (returns `null`), so students must add it.
- **No external dependencies**: The entire project runs as static files. The only dev dependency (Playwright) is for the facilitator's headless verification, never shipped to students.

---

## Dev Verification

The `dev/verify.mjs` script uses Playwright to headlessly verify:
1. Starter code scores exactly 4/100 (only T15 passes).
2. Solution code scores 100/100.
3. Alt-CSS solution passes all CSS tests.

```bash
# One-time setup
npm install playwright
npx playwright install chromium

# Run verification
node dev/verify.mjs
```

---

## Tips for Facilitators

- **Timing**: Suggest 60 minutes. Most students finish visible tasks in 30–45 min.
- **Difficulty tuning**: Remove some stubs (make them pre-implemented) to make it easier, or add more hidden tests to make it harder.
- **Group use**: Each student gets their own copy of `student/`. They work independently and share scores at the end.
- **Post-assessment**: Copy `hidden-tests.js` into each student's folder and re-run to get final scores.

