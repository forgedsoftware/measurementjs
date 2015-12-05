/*jslint node: true */
/* global suite */
/* global test */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

suite('Measurement - serialize', function () {

	test('serialize unit', function () {
		var serialized = m.dimensions.time.units.second.serialize();
		serialized.should.have.property('key', 'second');
		serialized.should.have.property('name', 'second');
		serialized.should.have.property('plural', 'seconds');
		serialized.should.have.property('multiplier', 1);
		serialized.should.have.property('offset', 0);
		
		serialized.should.not.have.property('rare');
		serialized.should.not.have.property('prefixName');
		serialized.should.not.have.property('prefixFreeName');

		serialized.should.have.property('otherSymbols', [ 'sec' ]);
	});

	test('serialize dimension definition', function () {
		var serialized = m.dimensions.time.serialize();
		serialized.should.have.property('key', 'time');
		serialized.should.have.property('name', 'time');
		serialized.should.have.property('symbol', 'T');
		serialized.should.have.property('baseUnitKey', 'second');
		serialized.should.have.property('otherNames', [ 'duration' ]);
		serialized.should.have.property('units');
		serialized.units.should.be.instanceof(Array).and.have.lengthOf(19);

		serialized.should.not.have.property('derived');
		serialized.should.not.have.property('inheritedUnitsFrom');
		serialized.should.not.have.property('dimensionless');
		serialized.should.not.have.property('vector');
	});

	test('serialize dimension definition - verbose mode', function () {
		var serialized = m.dimensions.speed.serialize(true);
		serialized.should.have.property('key', 'speed');

		serialized.units.should.be.instanceof(Object);
		Object.keys(serialized.units).length.should.equal(18);
		serialized.units.speedOfLight.symbol.should.equal('c');
	});

	test('serialize prefix', function () {
		var serialized = m.prefixes.bronto.serialize();
		serialized.should.have.property('key', 'bronto');
		serialized.should.have.property('symbol', 'B');
		serialized.should.have.property('type', 'siUnofficial');
		serialized.should.have.property('multiplier', 1e27);
		serialized.should.have.property('rare', true);

		serialized.should.not.have.property('base');
		serialized.should.not.have.property('power');
	});

	test('serialize measurement system', function () {
		var serialized = m.allSystems.si.serialize();
		serialized.should.have.property('key', 'si');
		serialized.should.have.property('name', 'International System of Units');
		serialized.should.have.property('parent', 'metric');
		serialized.should.have.property('children', [ 'astronomical', 'siCommon']);

		serialized.should.not.have.property('historical');
	});

});