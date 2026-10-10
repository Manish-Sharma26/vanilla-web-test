// ─── Mini Test Framework ─────────────────────────────────────────
var tests = [];

function test(id, name, category, weight, fn) {
  tests.push({ id: id, name: name, category: category, weight: weight, fn: fn });
}

function expect(actual) {
  return {
    toBe: function(expected) {
      if (actual !== expected)
        throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toBeTruthy: function() {
      if (!actual)
        throw new Error('Expected truthy, got ' + JSON.stringify(actual));
    },
    toBeCloseTo: function(expected, tolerance) {
      if (typeof actual !== 'number' || Math.abs(actual - expected) > tolerance)
        throw new Error('Expected ~' + expected + ' (±' + tolerance + '), got ' + actual);
    },
    toBeLessThan: function(expected) {
      if (typeof actual !== 'number' || actual >= expected)
        throw new Error('Expected < ' + expected + ', got ' + actual);
    },
    toBeGreaterThanOrEqual: function(expected) {
      if (typeof actual !== 'number' || actual < expected)
        throw new Error('Expected >= ' + expected + ', got ' + actual);
    },
    toContain: function(expected) {
      if (typeof actual !== 'string' || actual.indexOf(expected) === -1)
        throw new Error('Expected string containing "' + expected + '", got ' + JSON.stringify(actual));
    },
    toMatch: function(regex) {
      if (typeof actual !== 'string' || !regex.test(actual))
        throw new Error('Expected string matching ' + regex + ', got ' + JSON.stringify(actual));
    }
  };
}

function textOf(doc, sel) {
  var el = doc.querySelector(sel);
  return el ? el.textContent.trim() : '';
}

function numAfterEquals(text) {
  var m = text.split('=');
  if (m.length < 2) return NaN;
  var match = m[1].match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : NaN;
}

// ─── Visible Tests (85 pts) ─────────────────────────────────────

// T01: #app-header exists, is a <header>, first child of <body> (5 pts)
test('T01', '#app-header exists, is <header>, first child of <body>', 'HTML', 5, function(ctx) {
  var el = ctx.$('#app-header');
  expect(!!el).toBe(true);
  expect(el.tagName.toLowerCase()).toBe('header');
  expect(ctx.d.body.firstElementChild).toBe(el);
});

// T02: Header contains <h1> with text "Unit Converter" (5 pts)
test('T02', 'Header <h1> text is "Unit Converter"', 'HTML', 5, function(ctx) {
  var header = ctx.$('#app-header');
  expect(!!header).toBe(true);
  var h1 = header.querySelector('h1');
  expect(!!h1).toBe(true);
  expect(h1.textContent.trim().toLowerCase()).toBe('unit converter');
});

// T03: Header is full width (4 pts)
test('T03', 'Header is full viewport width', 'CSS', 4, function(ctx) {
  var header = ctx.$('#app-header');
  expect(!!header).toBe(true);
  var rect = header.getBoundingClientRect();
  var vw = ctx.d.documentElement.clientWidth;
  expect(Math.abs(rect.width - vw)).toBeLessThan(3);
});

// T04: Header has non-transparent background (4 pts)
test('T04', 'Header has visible background', 'CSS', 4, function(ctx) {
  var header = ctx.$('#app-header');
  expect(!!header).toBe(true);
  var s = ctx.css(header);
  var bg = s.backgroundColor;
  var bgImg = s.backgroundImage;
  var isTransparent = (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent');
  var hasImage = (bgImg && bgImg !== 'none');
  expect(!isTransparent || hasImage).toBe(true);
});

// T05: Header title text horizontally centered (Range-based) (5 pts)
test('T05', 'Header title text is horizontally centered', 'CSS', 5, function(ctx) {
  var header = ctx.$('#app-header');
  expect(!!header).toBe(true);
  var h1 = header.querySelector('h1');
  expect(!!h1).toBe(true);
  var range = ctx.d.createRange();
  range.selectNodeContents(h1);
  var rect = range.getBoundingClientRect();
  var textCenter = rect.left + rect.width / 2;
  var vw = ctx.d.documentElement.clientWidth;
  expect(Math.abs(textCenter - vw / 2)).toBeLessThan(6);
});

// T06: Footer background is rgb(30, 58, 138) (5 pts)
test('T06', 'Footer background is #1e3a8a', 'CSS', 5, function(ctx) {
  var footer = ctx.$('footer');
  expect(!!footer).toBe(true);
  var bg = ctx.css(footer).backgroundColor;
  expect(bg).toBe('rgb(30, 58, 138)');
});

// T07: #converter-card centered at 1280 and 800 px (4 pts)
test('T07', '#converter-card is horizontally centered', 'CSS', 4, async function(ctx) {
  var widths = [1280, 800];
  for (var i = 0; i < widths.length; i++) {
    await ctx.resize(widths[i]);
    var r = ctx.$('#converter-card').getBoundingClientRect();
    var vw = ctx.d.documentElement.clientWidth;
    expect(r.width).toBeLessThan(vw - 40);
    expect(r.left).toBeGreaterThanOrEqual(0);
    expect(Math.abs(r.left - (vw - r.right))).toBeLessThan(3);
  }
});

// T08: Controls in one row at 1280 px (3 pts)
test('T08', 'Input, selects and button in one row', 'CSS', 3, async function(ctx) {
  await ctx.resize(1280);
  var ids = ['#value-input', '#from-unit', '#to-unit', '#convert-btn'];
  var tops = [];
  for (var i = 0; i < ids.length; i++) {
    var el = ctx.$(ids[i]);
    expect(!!el).toBe(true);
    tops.push(el.getBoundingClientRect().top);
  }
  for (var j = 1; j < tops.length; j++) {
    expect(Math.abs(tops[j] - tops[0])).toBeLessThan(6);
  }
});

// T09: poundsToKg (4 pts)
test('T09', 'poundsToKg works correctly', 'JS', 4, function(ctx) {
  var fn = ctx.w.poundsToKg;
  expect(typeof fn).toBe('function');
  expect(fn(2.20462)).toBeCloseTo(1, 0.01);
  expect(fn(10)).toBeCloseTo(4.536, 0.01);
});

// T10: fahrenheitToCelsius (4 pts)
test('T10', 'fahrenheitToCelsius works correctly', 'JS', 4, function(ctx) {
  var fn = ctx.w.fahrenheitToCelsius;
  expect(typeof fn).toBe('function');
  expect(fn(32)).toBeCloseTo(0, 0.01);
  expect(fn(212)).toBeCloseTo(100, 0.01);
  expect(fn(-40)).toBeCloseTo(-40, 0.01);
});

// T11: metersToFeet (4 pts)
test('T11', 'metersToFeet works correctly', 'JS', 4, function(ctx) {
  var fn = ctx.w.metersToFeet;
  expect(typeof fn).toBe('function');
  expect(fn(1)).toBeCloseTo(3.281, 0.01);
  expect(fn(10)).toBeCloseTo(32.808, 0.01);
});

// T12: feetToMeters (4 pts)
test('T12', 'feetToMeters works correctly', 'JS', 4, function(ctx) {
  var fn = ctx.w.feetToMeters;
  expect(typeof fn).toBe('function');
  expect(fn(3.28084)).toBeCloseTo(1, 0.01);
  expect(fn(10)).toBeCloseTo(3.048, 0.01);
});

// T13: milesToKm (fixed bug) (5 pts)
test('T13', 'milesToKm works correctly (bug fixed)', 'JS', 5, function(ctx) {
  var fn = ctx.w.milesToKm;
  expect(typeof fn).toBe('function');
  expect(fn(1)).toBeCloseTo(1.609, 0.01);
  expect(fn(10)).toBeCloseTo(16.093, 0.01);
});

// T14: convert lb→kg, unsupported pair (5 pts)
test('T14', 'convert() lb→kg correct, unsupported returns null', 'JS', 5, function(ctx) {
  var fn = ctx.w.convert;
  expect(typeof fn).toBe('function');
  expect(fn(1, 'lb', 'kg')).toBeCloseTo(0.4536, 0.01);
  expect(fn(10, 'lb', 'kg')).toBeCloseTo(4.536, 0.01);
  expect(fn(1, 'km', 'kg')).toBe(null);
});

// T15: Pre-implemented functions still correct (4 pts)
test('T15', 'Pre-implemented functions still work', 'JS', 4, function(ctx) {
  expect(ctx.w.kmToMiles(10)).toBeCloseTo(6.214, 0.01);
  expect(ctx.w.celsiusToFahrenheit(100)).toBeCloseTo(212, 0.01);
  expect(ctx.w.kgToPounds(1)).toBeCloseTo(2.205, 0.01);
});

// T16: Wiring — fill 10, km→mi, click → result contains "6.21" (6 pts)
test('T16', 'Convert 10 km→mi shows result with 6.21', 'Wiring', 6, function(ctx) {
  ctx.fill('#value-input', '10');
  ctx.fill('#from-unit', 'km');
  ctx.fill('#to-unit', 'mi');
  ctx.click('#convert-btn');
  var result = textOf(ctx.d, '#result');
  expect(result).toContain('6.21');
});

// T17: Result format matches pattern (6 pts)
test('T17', 'Result format: "10 km = 6.21 mi"', 'Wiring', 6, function(ctx) {
  ctx.fill('#value-input', '10');
  ctx.fill('#from-unit', 'km');
  ctx.fill('#to-unit', 'mi');
  ctx.click('#convert-btn');
  var result = textOf(ctx.d, '#result');
  expect(result).toMatch(/10\s*km\s*=\s*6\.21\s*mi/i);
});

// T18: Second conversion updates result (4 pts)
test('T18', 'Second conversion updates result (100 C→F)', 'Wiring', 4, function(ctx) {
  ctx.fill('#value-input', '10');
  ctx.fill('#from-unit', 'km');
  ctx.fill('#to-unit', 'mi');
  ctx.click('#convert-btn');
  // Now do a second conversion
  ctx.fill('#value-input', '100');
  ctx.fill('#from-unit', 'C');
  ctx.fill('#to-unit', 'F');
  ctx.click('#convert-btn');
  var result = textOf(ctx.d, '#result');
  expect(result).toContain('212');
});

// T19: Unsupported pair → error, no result (4 pts)
test('T19', 'Unsupported pair shows error, clears result', 'Wiring', 4, function(ctx) {
  ctx.fill('#value-input', '10');
  ctx.fill('#from-unit', 'km');
  ctx.fill('#to-unit', 'kg');
  ctx.click('#convert-btn');
  var error = textOf(ctx.d, '#error').toLowerCase();
  expect(error).toContain('not supported');
  var result = textOf(ctx.d, '#result');
  expect(result).toBe('');
});

