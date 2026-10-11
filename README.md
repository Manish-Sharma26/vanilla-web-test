# ⚡ WebIDE Assessment Platform

> A lightweight, zero-dependency, in-browser frontend assessment platform modeling campus & intern online assessments (e.g. Accenture OA Frontend rounds).

## 🚀 Live Demo & GitHub Pages

This project is **100% static vanilla HTML, CSS, and JavaScript**. It requires no build step, no backend server, and can be deployed directly to **GitHub Pages**.

- **Homepage (`index.html`)**: Interactive Challenge Hub with challenge cards and overview.
- **Unit Converter (`unit-converter.html`)**: VS Code–style Web IDE, live iframe preview, in-IDE console, automated test suite (85 visible pts + 15 hidden pts).
- **Todo List (`todo.html`)**: Build & fix an accessible Todo application with localStorage persistence, live preview, in-IDE console, and auto-graded tests (85 visible pts + 15 hidden pts).

---

## 🛠 Local Development

To run the platform locally, serve the repository root with any static HTTP server:

```bash
# Using Python
python -m http.server 3000

# Or using Node / npm
npm start
# or
npm run serve
```

Then open `http://localhost:3000` in your browser.

---

## 📁 Repository Structure

```
├── index.html            ← Challenge Hub (Landing Page for GitHub Pages)
├── unit-converter.html   ← Interactive Web IDE for Unit Converter
├── todo.html             ← Interactive Web IDE for Todo List
├── student/              ← Standalone student starter folder for Unit Converter
│   ├── index.html        ← Incomplete HTML starter
│   ├── style.css         ← Starter CSS
│   ├── script.js         ← Starter JS with stubs & planted bugs
│   ├── runner.html       ← Standalone test runner UI
│   ├── tests.js          ← Visible test suite (85 pts)
│   └── README.md         ← Student-facing instructions
├── hidden/               ← Hidden test cases (15 pts)
│   └── hidden-tests.js
├── solution/             ← Reference 100/100 solutions
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── alt-css.css       ← Proves tests are approach-agnostic
├── dev/                  ← Dev verification scripts (Playwright)
│   └── verify.mjs
├── FACILITATOR.md        ← Guide for assessment administrators
└── package.json          ← Dev dependencies & convenience scripts
```

---

## 🧪 Testing & Verification

- **In-Browser Tests**: Inside each challenge IDE, click the **⚡ Run Tests** button or press `Ctrl + Enter` to run visible and hidden assertions live in an isolated sandboxed iframe.
- **Headless Dev Verification**: Run `node dev/verify.mjs` (requires Playwright) to test starter code (expected 4/100) and reference solutions (expected 100/100).

---

## 📄 License
ISC
