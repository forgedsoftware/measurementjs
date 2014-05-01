var m = window.measurement;

console.log(window);

test('construct measurement', function () {
	expect (1);

	deepEqual(m(12, 'length', 'metre').toJson(), '{\"value\":12,\"unit\":\"metre\"}');
});

test('simple conversion from base unit to other unit', function () {
	expect (1);

	var cQuantity = m(280, 'temperature', 'kelvin');
	var kQuantity = cQuantity.convert('celsius');
	deepEqual(kQuantity.value, 6.850000000000023);
});

test('conversion from unit to other unit', function () {
	expect (2);

	deepEqual(m(15, 'time', 'hour').convert('minute').value, 15 * 60);
	deepEqual(m(0, 'temperature', 'celsius').convert('fahrenheit').value, 32.000000003999965); // TODO: Deal with rounding...
});

test('formatting of units when printed in short form', function () {
	expect (6);

	deepEqual(m(15, 'time', 'hour').toShortFixed(), '15 h');

	deepEqual(m(15.23425463237, 'temperature', 'celsius').toShortFixed(), '15 C');
	deepEqual(m(9.45456, 'temperature', 'fahrenheit').toShortPrecision(), '9.45456 F');

	deepEqual(m(456.1315454, 'temperature', 'fahrenheit').toShortFixed(2), '456.13 F');
	deepEqual(m(1.6456113, 'temperature', 'fahrenheit').toShortFixed(3), '1.646 F');
	deepEqual(m(1.6456113, 'temperature', 'fahrenheit').toShortPrecision(3), '1.65 F');
});