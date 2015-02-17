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
});

test('empty find unit partial should fail', function () {
	findParameterFail(function () { m.findUnitPartial() });
	findParameterFail(function () { m.findUnitPartial('') });
	findParameterFail(function () { m.findUnitPartial({}) });
	should.not.exist(m.findUnitPartial('8'));
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

// Helper Functions

function findParameterFail(func) {
	try {
		func();
		should.fail('no error was thrown');
	} catch (e) {
		e.message.should.equal('Find parameter must be a string and at least one character');
	}
}
