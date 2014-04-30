var m = window.measurement;

console.log(window);

test('construct measurement', function () {
	expect (1);

	deepEqual(m(12, 'length', 'metre').toJson(), '{\"value\":12,\"unit\":\"metre\"}');
});