/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

teardown(function () {
	m.resetToDefaultOptions();
});

suite('Measurement - find', function () {

	suite('helper functions', function () {

		test('general compare tests', function () {
			m._private.compare(null, null, function () {}).should.equal(0);
			m._private.compare(null, { key: 'test' }, function () {}).should.equal(-1);
			m._private.compare({ key: 'test' }, null, function () {}).should.equal(1);
			m._private.compare({ key: 'test' }, { key: 'test' }, function () {}).should.equal(0);
			m._private.compare({ key: 'test1' }, { key: 'test' }, function () {}).should.equal(-1);
			m._private.compare({ key: 'test' }, { key: 'test1' }, function () {}).should.equal(1);
		});

	});

	suite('find units', function () {

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
			testFailingParameters(m.findUnit, m.findUnits);
		});

		test('empty find unit partial should fail', function () {
			testFailingParameters(m.findUnitPartial, m.findUnitsPartial);
		});

		test('test unit filter function', function () {
			var unit = {
				key: 'test',
				rare: false,
				estimation: false,
				systems: [m.findSystem('metric')]
			};
			m.options.useEstimatedUnits = false;
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

	});

	suite('find dimension definitions', function () {

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
			testFailingParameters(m.findDimension, m.findDimensions);
		});

		test('empty find dimension partial should fail', function () {
			testFailingParameters(m.findDimensionPartial, m.findDimensionsPartial);
		});

		test('test dimension filter function', function () {
			var dimension = {
				key: 'test',
				vector: false,
			};
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
				m._private.dimensionCalculatePoints).should.be.below(0); // Same points, alphabetical
		});

	});

	suite('find measurement systems', function () {

		test('basic find measurement system', function () {
			should.not.exist(m.findSystem('xyz'));
			should.not.exist(m.findSystem('met'));
			m.findSystem('metric').key.should.equal('metric');
			m.findSystem('Planck Units').key.should.equal('planck');
		});

		test('find measurement system partial', function () {
			should.not.exist(m.findSystemPartial('xyz'));
			m.findSystemPartial('metric').key.should.equal('metric');
			m.findSystemPartial('met').key.should.equal('metric');
			m.findSystemPartial('hart').key.should.equal('hartree');
		});

		test('find measurement systems', function () {
			m.findSystemsPartial('xyz').length.should.equal(0);
			m.findSystemsPartial('unit').length.should.equal(27);
			m.findSystemsPartial('metric').length.should.equal(6);
			m.findSystemsPartial('metric')[0].key.should.equal('metric');
		});

		test('empty find measurement system should fail', function () {
			testFailingParameters(m.findSystem, m.findSystems);
		});

		test('empty find measurement system partial should fail', function () {
			testFailingParameters(m.findSystemPartial, m.findSystemsPartial);
		});

		test('test measurement system filter function', function () {
			var system = m.findSystem('siCommon');
			m._private.systemFilter(system).should.be.true;
			m.options.ignoredSystemsForUnits.push(system);
			m._private.systemFilter(system).should.be.false;
			m._private.systemFilter(system.parent).should.be.false;
			var australia = m.findSystem('australia');
			m._private.systemFilter(australia).should.be.true;
			m.options.allowedSystemsForUnits.push(australia);
			m.options.allowedSystemsForUnits.push(system.parent);
			m._private.systemFilter(system).should.be.false;
			m._private.systemFilter(system.parent).should.be.true;
			m._private.systemFilter(system.parent.parent).should.be.true;
		});

		test('test measurement system compare function', function () {
			var sys1 = m.findSystem('metric').clone();
			var sys2 = m.findSystem('metric').clone();
			m._private.compare(sys1, sys2, m._private.systemCalculatePoints).should.equal(0);

			m._private.compare(
				m.findSystem('imperial'),
				m.findSystem('englishUnits'),
				m._private.systemCalculatePoints).should.be.below(0); // Same points, alphabetical
		});

	});

	suite('find prefixes', function () {

		test('basic find prefix', function () {
			should.not.exist(m.findPrefix('xyz'));
			should.not.exist(m.findPrefix('mic'));
			m.findPrefix('kilo').key.should.equal('kilo');
			m.findPrefix('M').key.should.equal('mega');
			m.findPrefix('Ki').key.should.equal('kibi');
		});

		test('find prefix partial', function () {
			should.not.exist(m.findPrefixPartial('xyz'));
			m.findPrefixPartial('kil').key.should.equal('kilo');
			m.findPrefixPartial('to').key.should.equal('atto');
			m.findPrefixPartial('mi').key.should.equal('micro');
		});

		test('find prefixes', function () {
			m.findPrefixesPartial('xyz').length.should.equal(0);
			m.findPrefixesPartial('to').length.should.equal(4);
			m.findPrefixesPartial('to')[0].key.should.equal('atto');
			m.findPrefixesPartial('Mi')[0].key.should.equal('micro');
			m.findPrefixesPartial('Mi', false)[0].key.should.equal('mebi');
			m.findPrefixes('k').length.should.equal(1);
		});

		test('empty find prefix should fail', function () {
			testFailingParameters(m.findPrefix, m.findPrefixes);
		});

		test('empty find prefix partial should fail', function () {
			testFailingParameters(m.findPrefixPartial, m.findPrefixesPartial);
		});

		test('test prefix filter function', function () {
			var prefix = {
				key: 'test',
				symbol: 't',
				type: 'si',
				rare: false
			};
			m._private.prefixFilter(prefix).should.be.true;
			prefix.type = 'siBinary';
			m._private.prefixFilter(prefix).should.be.true;
			prefix.type = 'siUnofficial';
			m._private.prefixFilter(prefix).should.be.false;
			m.options.useUnofficalPrefixes = true;
			m._private.prefixFilter(prefix).should.be.true;
			prefix.rare = true;
			m._private.prefixFilter(prefix).should.be.false;
			m.options.useRarePrefixes = true;
			m._private.prefixFilter(prefix).should.be.true;
		});

		test('test prefix compare function', function () {
			var pre1 = m.findPrefix('kilo').clone();
			var pre2 = m.findPrefix('kilo').clone();
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(0);
			pre2.rare = true;
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(1);
			pre1.rare = true;
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(0);
			pre1.type = 'siBinary';
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(-1);
			pre2.type = 'siBinary';
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(0);
			pre2.type = 'siUnofficial';
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(1);
			pre1.type = 'siUnofficial';
			m._private.compare(pre1, pre2, m._private.prefixCalculatePoints).should.equal(0);

			m._private.compare(
				m.findPrefix('kilo'),
				m.findPrefix('mega'),
				m._private.prefixCalculatePoints).should.be.above(0); // Same points, alphabetical
		});

	});

});

// Helper Functions

function testFailingParameters(func, funcArr) {
	findParameterFail(function () { func() });
	findParameterFail(function () { func('') });
	findParameterFail(function () { func({}) });
	should.not.exist(func('8'));

	findParameterFail(function () { funcArr() });
	findParameterFail(function () { funcArr('') });
	findParameterFail(function () { funcArr({}) });
	funcArr('8').length.should.equal(0);
}

function findParameterFail(func) {
	try {
		func();
		should.fail('no error was thrown');
	} catch (e) {
		e.message.should.equal('Find parameter must be a string and at least one character');
	}
}
