/**
 * Dev verification script (Playwright).
 * 
 * Serves the student/ folder (and a temp copy with solution/ overlaid + hidden tests),
 * then runs the test runner headlessly and asserts expected scores.
 *
 * Usage:
 *   npm install playwright
 *   npx playwright install chromium
 *   node dev/verify.mjs
 */

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─── Simple static file server ──────────────────────────────────
function createServer(dir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.md': 'text/plain',
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
    if (filePath.endsWith(path.sep) || filePath.endsWith('/')) filePath += 'index.html';

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, url: `http://127.0.0.1:${port}` });
    });
  });
}

// ─── Copy directory recursively ─────────────────────────────────
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── Run tests via Playwright ───────────────────────────────────
async function runTestsOn(page, url, includeHidden) {
  await page.goto(url + '/runner.html', { waitUntil: 'networkidle' });
  
  // Wait for hidden tests script to load if needed
  if (includeHidden) {
    await page.waitForTimeout(500);
  }

  const result = await page.evaluate((inclHidden) => {
    return window.runTests({ includeHidden: inclHidden });
  }, includeHidden);

  return result;
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  const studentDir = path.join(ROOT, 'student');
  const solutionDir = path.join(ROOT, 'solution');
  const hiddenDir = path.join(ROOT, 'hidden');
  
  // Create temp directory for solution overlay
  const tmpBase = path.join(ROOT, 'dev', '.tmp-verify');
  const tmpSolution = path.join(tmpBase, 'solution');
  const tmpAltCss = path.join(tmpBase, 'alt-css');
  
  // Clean up any previous temp
  if (fs.existsSync(tmpBase)) fs.rmSync(tmpBase, { recursive: true });
  
  // Build solution overlay: student/ base + solution/ files + hidden-tests.js
  copyDir(studentDir, tmpSolution);
  // Overlay solution files
  for (const file of ['index.html', 'style.css', 'script.js']) {
    const src = path.join(solutionDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tmpSolution, file));
    }
  }
  // Add hidden tests
  const hiddenSrc = path.join(hiddenDir, 'hidden-tests.js');
  if (fs.existsSync(hiddenSrc)) {
    fs.copyFileSync(hiddenSrc, path.join(tmpSolution, 'hidden-tests.js'));
  }
  
  // Build alt-css overlay: same as solution but with alt-css.css as style.css
  copyDir(tmpSolution, tmpAltCss);
  const altCssSrc = path.join(solutionDir, 'alt-css.css');
  if (fs.existsSync(altCssSrc)) {
    fs.copyFileSync(altCssSrc, path.join(tmpAltCss, 'style.css'));
  }
  
  // Start servers
  const starterServer = await createServer(studentDir);
  const solutionServer = await createServer(tmpSolution);
  const altCssServer = await createServer(tmpAltCss);
  
  console.log(`Starter server:  ${starterServer.url}`);
  console.log(`Solution server: ${solutionServer.url}`);
  console.log(`Alt-CSS server:  ${altCssServer.url}`);
  
  const browser = await chromium.launch();
  let allPassed = true;
  
  try {
    // ── Test 1: Starter should score 4/100 ──
    console.log('\n════════════════════════════════════════');
    console.log('  STARTER CODE');
    console.log('════════════════════════════════════════');
    
    const starterPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const starterResult = await runTestsOn(starterPage, starterServer.url, false);
    await starterPage.close();
    
    printResults(starterResult);
    
    if (starterResult.score !== 4) {
      console.error(`❌ FAIL: Starter expected 4/${starterResult.total}, got ${starterResult.score}/${starterResult.total}`);
      allPassed = false;
    } else {
      console.log(`✅ PASS: Starter scores 4/${starterResult.total} as expected`);
    }
    
    // Verify only T15 passes
    const starterPassed = starterResult.results.filter(r => r.passed).map(r => r.id);
    if (starterPassed.length !== 1 || starterPassed[0] !== 'T15') {
      console.error(`❌ FAIL: Expected only T15 to pass, got: ${starterPassed.join(', ') || 'none'}`);
      allPassed = false;
    }
    
    // ── Test 2: Solution should score 100/100 ──
    console.log('\n════════════════════════════════════════');
    console.log('  SOLUTION (all tests including hidden)');
    console.log('════════════════════════════════════════');
    
    const solutionPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const solutionResult = await runTestsOn(solutionPage, solutionServer.url, true);
    await solutionPage.close();
    
    printResults(solutionResult);
    
    if (solutionResult.score !== 100) {
      console.error(`❌ FAIL: Solution expected 100/${solutionResult.total}, got ${solutionResult.score}/${solutionResult.total}`);
      const failed = solutionResult.results.filter(r => !r.passed);
      for (const f of failed) {
        console.error(`   ✗ [${f.id}] ${f.name}: ${f.message}`);
      }
      allPassed = false;
    } else {
      console.log(`✅ PASS: Solution scores 100/100`);
    }
    
    // ── Test 3: Alt-CSS should pass all CSS tests ──
    console.log('\n════════════════════════════════════════');
    console.log('  ALT-CSS SOLUTION');
    console.log('════════════════════════════════════════');
    
    const altPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const altResult = await runTestsOn(altPage, altCssServer.url, true);
    await altPage.close();
    
    printResults(altResult);
    
    const cssTests = altResult.results.filter(r => r.category === 'CSS');
    const failedCss = cssTests.filter(r => !r.passed);
    if (failedCss.length > 0) {
      console.error(`❌ FAIL: Alt-CSS failed ${failedCss.length} CSS test(s):`);
      for (const f of failedCss) {
        console.error(`   ✗ [${f.id}] ${f.name}: ${f.message}`);
      }
      allPassed = false;
    } else {
      console.log(`✅ PASS: Alt-CSS passes all ${cssTests.length} CSS tests`);
    }
    
  } finally {
    await browser.close();
    starterServer.server.close();
    solutionServer.server.close();
    altCssServer.server.close();
    
    // Clean up temp
    if (fs.existsSync(tmpBase)) fs.rmSync(tmpBase, { recursive: true });
  }
  
  console.log('\n════════════════════════════════════════');
  if (allPassed) {
    console.log('  ✅ ALL CHECKS PASSED');
  } else {
    console.log('  ❌ SOME CHECKS FAILED');
    process.exit(1);
  }
  console.log('════════════════════════════════════════\n');
}

function printResults(data) {
  const maxName = Math.max(...data.results.map(r => (`[${r.id}] ${r.name}`).length));
  for (const r of data.results) {
    const label = `[${r.id}] ${r.name}`.padEnd(maxName + 2);
    const icon = r.passed ? '✓' : '✗';
    const pts = `${r.weight} pts`.padStart(6);
    const msg = r.passed ? '' : ` — ${r.message}`;
    console.log(`  ${icon} ${label} ${pts}${msg}`);
  }
  console.log(`  Score: ${data.score} / ${data.total}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

