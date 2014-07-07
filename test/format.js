/*jslint node: true */
'use strict';

var m = require('../built/measurement_full.js'),
	should = require('should');

// VALUES ONLY

test('simple format without any config', function () {
	m(4).format().should.equal('4');
});

test('format precision and fixed decimals', function () {
	m(15).format().should.equal('15');
	m(9.45456).format().should.equal('9.45456');

	m(15.23425463237).format({ fixed: 0 }).should.equal('15');
	m(456.1315454).format({ fixed: 2 }).should.equal('456.13');
	m(1.6456113).format({ fixed: 3 }).should.equal('1.646');
	m(1.6456113).format({ precision: 3 }).should.equal('1.65');
});

test('replacing decimal separator', function () {
	m(9.45456).format({ decimal: '?' }).should.equal('9?45456');
	m(9.45456).format({ decimal: '123' }).should.equal('912345456');
});

test('separator should add a character every three characters by default', function () {
	m(12.45456).format({ separator: ',' }).should.equal('12.45456');
	m(12349.45456).format({ separator: ',' }).should.equal('12,349.45456');
	m(1245456).format({ separator: ',' }).should.equal('1,245,456');
	m(1245456.2345).format({ separator: ',' }).should.equal('1,245,456.2345');
});

test('separator should also work if the decimal has been changed', function () {
	m(12349.45456).format({ separator: ',', decimal: ',' }).should.equal('12,349,45456');
	m(12349.45456).format({ separator: ',', decimal: '123' }).should.equal('12,34912345456');
});

test('separator of multiple characters should work', function () {
	m(1245456.2345).format({ separator: 'abc' }).should.equal('1abc245abc456.2345');
});

test('separator count should change the number of characters between each separator', function () {
	m(12349.45456).format({ separator: ',', separatorCount: 2 }).should.equal('1,23,49.45456');
});

test('expand exponent should remove the e notation and replace with x10^x notation', function () {
	m(5.2e120).format({ expandExponent: true }).should.equal('5.2 x 10¹²⁰');
	m(106.3e50).format({ expandExponent: true }).should.equal('1.063 x 10⁵²');
	m(7.45e-22).format({ expandExponent: true }).should.equal('7.45 x 10⁻²²');
	m(106).format({ expandExponent: true }).should.equal('106');
	m(106.3e-50).format({ expandExponent: true, ascii: true }).should.equal('1.063 x 10^-48');
});

// VALUES WITH DIMENSIONS

test('simple format without any config and with units', function () {
	m(4, 'hour').format().should.equal('4 h');
	m(32.5, 'second').format().should.equal('32.5 s');
});

test('simple format with multiple dimensions', function () {
	m(7, ['hour', 'metre']).format().should.equal('7 hm');
	m(7, ['second', 'metre']).format({ unitSeparator: '\u00B7' }).should.equal('7 s·m');
});

test('format with multiple dimensions with powers', function () {
	m(7, [{ unit: 'hour', power: 3}, { unit: 'metre', power: -1 }]).format({ unitSeparator: '\u00B7' }).should.equal('7 h³·m⁻¹');
	m(9, [{ unit: 'metre', power: -1 }, { unit: 'hour', power: 3}, { unit: 'kelvin', power: -2}]).format().should.equal('9 h³m⁻¹K⁻²');
});

test('full name with multiple dimensions with powers', function () {
	m(10, [{ unit: 'second', power: -1 }]).format({ fullName: true }).should.equal('10 per second');
	m(8, [{ unit: 'hour', power: 3}, { unit: 'metre', power: -1 }]).format({ fullName: true }).should.equal('8 hour cubed per metre');
});

test('sort false with multiple dimensions with powers', function () {
	m(9, [{ unit: 'metre', power: -1 }, { unit: 'hour', power: 3}]).format({ sort: false }).should.equal('9 m⁻¹h³');
	m(9, [{ unit: 'metre', power: -1 }, { unit: 'hour', power: 3}, { unit: 'kelvin', power: -2}]).format({ sort: false }).should.equal('9 m⁻¹h³K⁻²');
});

test('showAllPowers should always show powers', function () {
	m(21, ['hour', 'metre']).format({ showAllPowers: true }).should.equal('21 h¹m¹');
});

test('option ascii should show an ascii representation of the formatted quantity', function () {
	m(106.3e-50, [{ unit: 'metre', power: 2 }]).format({ expandExponent: true, ascii: true }).should.equal('1.063 x 10^-48 m^2');
	m(12.4, [{ unit: 'metre', power: -1 }, { unit: 'hour', power: 3}, { unit: 'kelvin', power: -2}]).format({ ascii: true }).should.equal('12.4 h^3m^-1K^-2');
	m(21, ['hour', 'metre']).format({ showAllPowers: true, ascii: true }).should.equal('21 h^1m^1');
});
