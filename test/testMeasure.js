var m = window.measurement;

console.log(window);

test('construct measurement', function () {
	expect (1);

	deepEqual(m(12, 'length', 'metre').toJson(), '{\"value\":12,\"unit\":\"metre\"}');
});

test('basic conversion', function () {
	expect (1);

	var cQuantity = m(280, 'temperature', 'kelvin');
	var kQuantity = cQuantity.convert('celsius');
	deepEqual(kQuantity.value, 6.850000000000023);
});