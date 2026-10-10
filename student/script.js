function kmToMiles(km) {
  // Formula: miles = km × 0.621371
  return km * 0.621371;
}

function milesToKm(miles) {
  // Formula: km = miles × 1.609344
  return miles * 4;   // BUG: wrong constant
}

function metersToFeet(m) {
  // Formula: ft = m × 3.28084
  // TODO: implement
}

function feetToMeters(ft) {
  // Formula: m = ft ÷ 3.28084
  // TODO: implement
}

function kgToPounds(kg) {
  // Formula: lb = kg × 2.20462
  return kg * 2.20462;
}

function poundsToKg(lb) {
  // Formula: kg = lb ÷ 2.20462
  // TODO: implement
}

function celsiusToFahrenheit(c) {
  // Formula: °F = c × 9 ÷ 5 + 32
  return c * 9 / 5 + 32;
}

function fahrenheitToCelsius(f) {
  // Formula: °C = (f − 32) × 5 ÷ 9
  // TODO: implement
}

function convert(value, from, to) {
  switch (`${from}-${to}`) {
    case 'km-mi': return kmToMiles(value);
    case 'mi-km': return milesToKm(value);
    case 'm-ft':  return metersToFeet(value);
    case 'ft-m':  return feetToMeters(value);
    case 'kg-lb': return kgToPounds(value);
    case 'lb-kg': return kgToPounds(value);  // BUG: should call poundsToKg
    case 'C-F':   return celsiusToFahrenheit(value);
    case 'F-C':   return fahrenheitToCelsius(value);
    default:      return null;
  }
}
