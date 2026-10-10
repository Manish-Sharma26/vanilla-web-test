// ─── Hidden Tests (15 pts) ──────────────────────────────────────
// This file uses the same `test`, `expect`, `textOf`, `numAfterEquals`
// functions defined in tests.js. Tests are pushed into `hiddenTests` array.

var hiddenTests = (typeof window !== 'undefined' && window.hiddenTests) ? window.hiddenTests : (typeof hiddenTests !== 'undefined' ? hiddenTests : []);
if (typeof window !== 'undefined') window.hiddenTests = hiddenTests;

(function() {
  function htest(id, name, category, weight, fn) {
    hiddenTests.push({ id: id, name: name, category: category, weight: weight, fn: fn });
  }

  // H1: Empty input → error "valid number", result empty (3 pts)
  htest('H1', 'Empty input shows "valid number" error', 'Hidden', 3, function(ctx) {
    ctx.fill('#value-input', '');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'mi');
    ctx.click('#convert-btn');
    var error = textOf(ctx.d, '#error').toLowerCase();
    expect(error).toContain('valid number');
    var result = textOf(ctx.d, '#result');
    expect(result).toBe('');
  });

  // H2: Input "abc" → same as H1 (3 pts)
  htest('H2', 'Non-numeric input "abc" shows error', 'Hidden', 3, function(ctx) {
    ctx.fill('#value-input', 'abc');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'mi');
    ctx.click('#convert-btn');
    var error = textOf(ctx.d, '#error').toLowerCase();
    expect(error).toContain('valid number');
    var result = textOf(ctx.d, '#result');
    expect(result).toBe('');
  });

  // H3: Same unit km→km, value 10 → result contains 10 (3 pts)
  htest('H3', 'Same unit (km→km) returns input value', 'Hidden', 3, function(ctx) {
    ctx.fill('#value-input', '10');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'km');
    ctx.click('#convert-btn');
    var result = textOf(ctx.d, '#result');
    var num = numAfterEquals(result);
    expect(num).toBeCloseTo(10, 0.01);
  });

  // H4: -40 C→F → -40 (3 pts)
  htest('H4', 'Negative temperature: -40 C → -40 F', 'Hidden', 3, function(ctx) {
    ctx.fill('#value-input', '-40');
    ctx.fill('#from-unit', 'C');
    ctx.fill('#to-unit', 'F');
    ctx.click('#convert-btn');
    var result = textOf(ctx.d, '#result');
    var num = numAfterEquals(result);
    expect(num).toBeCloseTo(-40, 0.01);
  });

  // H5: Stale state clearing (3 pts)
  htest('H5', 'Error clears old result; valid conversion clears old error', 'Hidden', 3, function(ctx) {
    // First: trigger an error
    ctx.fill('#value-input', '10');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'kg');
    ctx.click('#convert-btn');
    // Verify error is shown
    var error1 = textOf(ctx.d, '#error');
    expect(error1.length > 0).toBe(true);

    // Second: do a valid conversion → error should clear
    ctx.fill('#value-input', '10');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'mi');
    ctx.click('#convert-btn');
    var error2 = textOf(ctx.d, '#error');
    expect(error2).toBe('');

    // Third: trigger unsupported → result should clear
    ctx.fill('#value-input', '10');
    ctx.fill('#from-unit', 'km');
    ctx.fill('#to-unit', 'kg');
    ctx.click('#convert-btn');
    var result3 = textOf(ctx.d, '#result');
    expect(result3).toBe('');
  });
})();
