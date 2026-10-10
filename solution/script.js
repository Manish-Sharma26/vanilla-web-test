function kmToMiles(km) {
  // Formula: miles = km × 0.621371
  return km * 0.621371;
}

function milesToKm(miles) {
  // Formula: km = miles × 1.609344
  return miles * 1.609344;
}

function metersToFeet(m) {
  // Formula: ft = m × 3.28084
  return m * 3.28084;
}

function feetToMeters(ft) {
  // Formula: m = ft ÷ 3.28084
  return ft / 3.28084;
}

function kgToPounds(kg) {
  // Formula: lb = kg × 2.20462
  return kg * 2.20462;
}

function poundsToKg(lb) {
  // Formula: kg = lb ÷ 2.20462
  return lb / 2.20462;
}

function celsiusToFahrenheit(c) {
  // Formula: °F = c × 9 ÷ 5 + 32
  return c * 9 / 5 + 32;
}

function fahrenheitToCelsius(f) {
  // Formula: °C = (f − 32) × 5 ÷ 9
  return (f - 32) * 5 / 9;
}

function convert(value, from, to) {
  if (from === to) return value;

  switch (`${from}-${to}`) {
    case 'km-mi': return kmToMiles(value);
    case 'mi-km': return milesToKm(value);
    case 'm-ft':  return metersToFeet(value);
    case 'ft-m':  return feetToMeters(value);
    case 'kg-lb': return kgToPounds(value);
    case 'lb-kg': return poundsToKg(value);
    case 'C-F':   return celsiusToFahrenheit(value);
    case 'F-C':   return fahrenheitToCelsius(value);
    default:      return null;
  }
}

document.getElementById('convert-btn').addEventListener('click', function() {
  var input = document.getElementById('value-input').value.trim();
  var from = document.getElementById('from-unit').value;
  var to = document.getElementById('to-unit').value;
  var resultEl = document.getElementById('result');
  var errorEl = document.getElementById('error');

  // Clear previous
  resultEl.textContent = '';
  errorEl.textContent = '';

  // Validate input
  if (input === '' || !Number.isFinite(parseFloat(input))) {
    errorEl.textContent = 'Please enter a valid number';
    return;
  }

  var value = parseFloat(input);
  var converted = convert(value, from, to);

  if (converted === null) {
    errorEl.textContent = 'Conversion not supported';
    return;
  }

  resultEl.textContent = Number(value) + ' ' + from + ' = ' + Number(converted.toFixed(2)) + ' ' + to;
});
