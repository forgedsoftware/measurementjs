/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

teardown(function () {
	m.resetToDefaultOptions();
});

// Helper Tests

test('general compare tests', function () {
	m._private.compare(null, null, function () {}).should.equal(0);
	m._private.compare(null, { key: 'test' }, function () {}).should.equal(-1);
	m._private.compare({ key: 'test' }, null, function () {}).should.equal(1);
	m._private.compare({ key: 'test' }, { key: 'test' }, function () {}).should.equal(0);
	m._private.compare({ key: 'test1' }, { key: 'test' }, function () {}).should.equal(-1);
	m._private.compare({ key: 'test' }, { key: 'test1' }, function () {}).should.equal(1);
});

// Test Find Units

test('basic find unit', function () {
	should.not.exist(m.findUnit('xyz'));
	should.not.exist(m.findUnit('met'));
	m.findUnit('metre').key.should.equal('metre');
	m.findUnit('metre').dimension.key.should.equal('length');
	m.findUnit('au').key.should.equal('astronomicalUnit');
	m.findUnit('m').key.should.equal('metre');
	m.findUnit('s').key.should.equal('second');
	m.findUnit('second').dimension.key.should.equal('time');
	m.findUnit('second', 'planeAngle').dimension.key.should.equal('planeAngle');
});

test('find unit partial', function () {
	should.not.exist(m.findUnitPartial('xyz'));
	m.findUnitPartial('metre').key.should.equal('metre');
	m.findUnitPartial('metre').dimension.key.should.equal('length');
	m.findUnitPartial('am').key.should.equal('ampere');
	m.findUnitPartial('hou').key.should.equal('hour');
	m.findUnitPartial('f').key.should.equal('farad');
});

test('find units', function () {
	m.findUnits('xyz').length.should.equal(0);
	m.findUnits('metre').length.should.equal(1);
	m.findUnitsPartial('metre').length.should.equal(24);
	m.findUnitsPartial('metre')[0].key.should.equal('metre');
});

test('find base unit', function () {
	should.not.exist(m.findBaseUnit('xyz'));
	m.findBaseUnit('length').key.should.equal('metre');
	m.findBaseUnitPartial('len').key.should.equal('metre');
});

test('empty find unit should fail', function () {
	findParameterFail(function () { m.findUnit() });
	findParameterFail(function () { m.findUnit('') });
	findParameterFail(function () { m.findUnit({}) });
	should.not.exist(m.findUnit('8'));

	findParameterFail(function () { m.findUnits() });
	findParameterFail(function () { m.findUnits('') });
	findParameterFail(function () { m.findUnits({}) });
	m.findUnits('8').length.should.equal(0);
});

test('empty find unit partial should fail', function () {
	findParameterFail(function () { m.findUnitPartial() });
	findParameterFail(function () { m.findUnitPartial('') });
	findParameterFail(function () { m.findUnitPartial({}) });
	should.not.exist(m.findUnitPartial('8'));

	findParameterFail(function () { m.findUnitsPartial() });
	findParameterFail(function () { m.findUnitsPartial('') });
	findParameterFail(function () { m.findUnitsPartial({}) });
	m.findUnitsPartial('8').length.should.equal(0);
});

test('test unit filter function', function () {
	var unit = {
		key: 'test',
		rare: false,
		estimation: false,
		systems: [m.findSystem('metric')]
	}
	m._private.unitFilter(unit).should.be.true;
	unit.rare = true;
	m._private.unitFilter(unit).should.be.false;
	m.options.useRareUnits = true;
	m._private.unitFilter(unit).should.be.true;
	unit.estimation = true;
	m._private.unitFilter(unit).should.be.false;
	m.options.useEstimatedUnits = true;
	m._private.unitFilter(unit).should.be.true;
	m.options.ignoredSystemsForUnits.push(m.findSystem('metric'));
	m._private.unitFilter(unit).should.be.false;
});

test('test unit compare function', function () {
	var unit1 = m.findUnit('metre').clone();
	var unit2 = m.findUnit('metre').clone();
	m._private.compare(unit1, unit2, m._private.unitCalculatePoints).should.equal(0);
	unit1.rare = true;
	m._private.compare(unit1, unit2, m._private.unitCalculatePoints).should.equal(-1);
	unit2.rare = true;
	m._private.compare(unit1, unit2, m._private.unitCalculatePoints).should.equal(0);
	unit2.estimation = true;
	m._private.compare(unit1, unit2, m._private.unitCalculatePoints).should.equal(1);
	unit1.estimation = true;
	m._private.compare(unit1, unit2, m._private.unitCalculatePoints).should.equal(0);
});

// Test Dimension Definition Find

test('basic find dimension', function () {
	should.not.exist(m.findDimension('xyz'));
	should.not.exist(m.findDimension('len'));
	m.findDimension('length').key.should.equal('length');
	m.findDimension('Q').key.should.equal('electricCharge');
	m.findDimension('Φb').key.should.equal('magneticFlux');
});

test('find dimension partial', function () {
	should.not.exist(m.findDimensionPartial('xyz'));
	m.findDimensionPartial('len').key.should.equal('length');
	m.findDimensionPartial('flux').key.should.equal('luminousFlux');
	m.findDimensionPartial('Q').key.should.equal('electricCharge');
});

test('find dimensions', function () {
	m.findDimensionsPartial('xyz').length.should.equal(0);
	m.findDimensionsPartial('flux').length.should.equal(2);
	m.findDimensionsPartial('flux')[0].key.should.equal('luminousFlux');
	m.findDimensions('Q').length.should.equal(2);
	m.findDimensions('Q')[0].key.should.equal('electricCharge');
});

test('empty find dimension should fail', function () {
	findParameterFail(function () { m.findDimension() });
	findParameterFail(function () { m.findDimension('') });
	findParameterFail(function () { m.findDimension({}) });
	should.not.exist(m.findDimension('8'));

	findParameterFail(function () { m.findDimensions() });
	findParameterFail(function () { m.findDimensions('') });
	findParameterFail(function () { m.findDimensions({}) });
	m.findDimensions('8').length.should.equal(0);
});

test('empty find dimension partial should fail', function () {
	findParameterFail(function () { m.findDimensionPartial() });
	findParameterFail(function () { m.findDimensionPartial('') });
	findParameterFail(function () { m.findDimensionPartial({}) });
	should.not.exist(m.findDimensionPartial('8'));

	findParameterFail(function () { m.findDimensionsPartial() });
	findParameterFail(function () { m.findDimensionsPartial('') });
	findParameterFail(function () { m.findDimensionsPartial({}) });
	m.findDimensionsPartial('8').length.should.equal(0);
});

test('test dimension filter function', function () {
	var dimension = {
		key: 'test',
		vector: false,
	}
	m._private.dimensionFilter(dimension).should.be.true;
	dimension.vector = true;
	m._private.dimensionFilter(dimension).should.be.false;
	m.options.allowVectorDimensions = true;
	m._private.dimensionFilter(dimension).should.be.true;
	m.options.allowVectorDimensions = false;

	var dim = m.findDimension('volume');
	m._private.dimensionFilter(dim).should.be.true;
	m.options.allowDerivedDimensions = false;
	m._private.dimensionFilter(dim).should.be.false;
	m.options.allowDerivedDimensions = true;
	m._private.dimensionFilter(dim).should.be.true;
	m.options.ignoredDimensions.push(dim);
	m._private.dimensionFilter(dim).should.be.false;
});

test('test dimension compare function', function () {
	var dim1 = m.findDimension('area').clone();
	var dim2 = m.findDimension('area').clone();
	m._private.compare(dim1, dim2, m._private.dimensionCalculatePoints).should.equal(0);
	dim1.vector = true;
	m._private.compare(dim1, dim2, m._private.dimensionCalculatePoints).should.equal(-1);
	dim2.vector = true;
	m._private.compare(dim1, dim2, m._private.dimensionCalculatePoints).should.equal(0);
	dim2.dimensionless = true;
	m._private.compare(dim1, dim2, m._private.dimensionCalculatePoints).should.equal(1);
	dim1.dimensionless = true;
	m._private.compare(dim1, dim2, m._private.dimensionCalculatePoints).should.equal(0);

	m._private.compare(
		m.findDimension('time'),
		m.findDimension('length'),
		m._private.dimensionCalculatePoints).should.equal(-8); // Same points, alphabetical
});

// Test Measurement System Find

// TODO

// Test Prefix Find

// TODO

// Helper Functions

function findParameterFail(func) {
	try {
		func();
		should.fail('no error was thrown');
	} catch (e) {
		e.message.should.equal('Find parameter must be a string and at least one character');
	}
}
