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