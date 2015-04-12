(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity - add', function () {

	test('simple add with no units', function () {
		m(10).add(m(5)).should.have.property('value', 15);
		m(-10).add(m(-5)).should.have.property('value', -15);
	});

	test('simple add with different single units should produce error', function () {
		(function () {
			m(10, 'metre').add(m(5, 'second'));
		}).should.throw('In order to convert based upon a quantity they must be commensurable');
	});

	test('simple add with the same single units should add correctly', function () {
		var q1 = m(10, 'metre').add(m(5, 'metre'));

		q1.should.have.property('value', 15);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].should.have.property('power', 1);
	});

	test('simple add with the single units in the same system should add correctly', function () {
		var q1 = m(10, 'second').add(m(5, 'minute'));

		q1.should.have.property('value', 310);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].unit.should.have.property('key', 'second');
		q1.dimensions[0].should.have.property('power', 1);
	});

	test('simple add of a smaller unit in the same system should add correctly', function () {
		var q1 = m(2, 'hour').add(m(30, 'minute'));

		q1.should.have.property('value', 2.5);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].unit.should.have.property('key', 'hour');
		q1.dimensions[0].should.have.property('power', 1);
	});

});

},{"../lib/measurement.js":17,"should":39}],2:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity - dimensionless', function () {

	test('create a basic dimensionless quantity', function () {
		m(2).should.have.property('dimensions').with.lengthOf(0);
		m(2).should.have.property('value', 2);
	});

	test('creating a dimensionless quantity with NaN should be valid', function () {
		m(Number.NaN).value.should.be.NaN;
	});

	test('test multiplying dimensionless quantities', function () {
		m(2).multiply(3).should.have.property('value', 6);
		m(-3).multiply(-4).should.have.property('value', 12);
		m(6).multiply(-5).should.have.property('value', -30);
		m(-2.345).multiply(4.0392).value.should.be.approximately(-9.4719240, DELTA);
	});

	test('test dividing dimensionless quantities', function () {
		m(2).divide(4).should.have.property('value', 0.5);
		m(150).divide(10).should.have.property('value', 15);
		m(110).divide(-5).should.have.property('value', -22);
		m(-81).divide(-9).should.have.property('value', 9);
		m(-2.345).divide(4.0392).value.should.be.approximately(-0.58056050703, DELTA);
	});

	test('test adding dimensionless quantities', function () {
		m(2).add(3).should.have.property('value', 5);
		m(-10).add(20).should.have.property('value', 10);
		m(-10).add(-20).should.have.property('value', -30);
		m(-5.4567).add(5.4567).should.have.property('value', 0);
	});

	test('test subtracting dimensionless quantities', function () {
		m(18).subtract(5).should.have.property('value', 13);
		m(10).subtract(-20).should.have.property('value', 30);
		m(-10).subtract(-20).should.have.property('value', 10);
		m(-5.4567).subtract(5.4567).should.have.property('value', -10.9134);
	});

	test('math aliases', function () {
		m(2).times(2).should.have.property('value', 4);
		m(2).plus(1).should.have.property('value', 3);
		m(2).minus(7).should.have.property('value', -5);
	});

	test('js math library with no params using dimensionless quantities', function () {
		m(4).abs().should.have.property('value', 4);
		m(-4).abs().should.have.property('value', 4);
		m(0.1).acos().value.should.be.approximately(1.4706289056333368, DELTA);
		m(2).exp().value.should.be.approximately(7.38905609893065, DELTA);
		m(9).sqrt().should.have.property('value', 3);
	});

	test('js math library with params using dimensionless quantities', function () {
		m(9).atan2(2).value.should.be.approximately(0.21866894587394195, DELTA);

		m(2).pow().value.should.be.NaN;
		m(2).pow(4).should.have.property('value', 16);

		m(2.45).max(1,2,3,4,5,6).should.have.property('value', 6);
		m(9).max(1,2,3,4,5,6).should.have.property('value', 9);

		m(-3).min(1,2,3,4,5,6).should.have.property('value', -3);
		m(9).min(1,2,3,4,5,6).should.have.property('value', 1);
	});

	test('chaining math using dimensionless quantities', function () {
		m(-4).add(1).abs().multiply(3).times(2).divide(9).should.have.property('value', 2);
	});

	test('simplify on dimensionless quantities should return same value', function () {
		m(10).simplify().should.have.property('value', 10);
		m(-5.454).simplify().should.have.property('value', -5.454);
	});

	test('serialising dimensionless quantities should produce sensible result', function () {
		m(-12).serialised().should.eql({ value: -12 });
		m(2).toJson().should.equal('{"value":2}');
	});

	test('isDimensionless method should only be true if a scalar', function () {
		m(10).isDimensionless().should.be.true;
		m(-4).isDimensionless().should.be.true;
		m(10, 'metre').isDimensionless().should.be.false;
	});

});

},{"../lib/measurement.js":17,"should":39}],3:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity - divide', function () {

	test('simple divide with no units', function () {
		m(14).divide(m(2)).should.have.property('value', 7);
		m(-24).divide(m(8)).should.have.property('value', -3);
	});

	test('simple divide with different single units', function () {
		var q1 = m(14, 'metre').divide(m(2, 'second'));

		q1.should.have.property('value', 7);
		q1.should.have.property('dimensions').with.lengthOf(2);

		q1.dimensions[0].should.have.property('power', 1);
		q1.dimensions[0].unit.should.have.property('key', 'metre');

		q1.dimensions[1].should.have.property('power', -1);
		q1.dimensions[1].unit.should.have.property('key', 'second');
	});

	test('multiply with different units with single simplification', function () {
		var q1 = m(14, ['metre', 'second']).divide(m(2, 'second'));

		q1.should.have.property('value', 7);
		q1.should.have.property('dimensions').with.lengthOf(1);

		q1.dimensions[0].should.have.property('power', 1);
		q1.dimensions[0].unit.should.have.property('key', 'metre');
	});

});

},{"../lib/measurement.js":17,"should":39}],4:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	Unit = require('../lib/entities/unit.js'),
	DimensionDefinition = require('../lib/entities/dimension_definition.js'),
	should = require('should');

suite('Measurement - entities', function () {

	test('use measurement', function () {
		Object.keys(m.allSystems).length.should.equal(38);
		var q = new m.Quantity(23);
		var d = new m.Dimension('metre');
		var q2 = m(45);
	});

	test('create unit', function () {
		var dim = new DimensionDefinition('dimKey', {
			name: 'dimName'
		});
		var unit = new Unit('testKey', {
			name: 'testName'
		}, dim);
	});

});

},{"../lib/entities/dimension_definition.js":12,"../lib/entities/unit.js":15,"../lib/measurement.js":17,"should":39}],5:[function(require,module,exports){
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

},{"../lib/measurement.js":17,"should":39}],6:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

suite('Quantity - format values', function () {

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
		m(106.3e-50).format({ expandExponent: true, asciiOnly: true }).should.equal('1.063 x 10^-48');
	});

});

suite('Quantity - format values with dimensions', function () {

	test('simple format without any config and with units', function () {
		m(4, 'hour').format().should.equal('4 h');
		m(32.5, 'second').format().should.equal('32.5 s');
	});

	test('simple format with multiple dimensions', function () {
		m(7, ['hour', 'metre']).format().should.equal('7 hm');
		m(7, ['second', 'metre']).format({ unitSeparator: '\u00B7' }).should.equal('7 s·m');
	});

	test('format with multiple dimensions with powers', function () {
		m(7, [new m.D('hour', 3), new m.D('metre', -1)]).format({ unitSeparator: '\u00B7' }).should.equal('7 h³·m⁻¹');
		m(9, [new m.D('metre', -1), new m.D('hour', 3), new m.D('kelvin', -2)]).format().should.equal('9 h³m⁻¹°K⁻²');
	});

	test('full name with multiple dimensions with powers', function () {
		m(10, [new m.D('second', -1)]).format({ textualDescription: true }).should.equal('10 per second');
		m(8, [new m.D('hour', 3), new m.D('metre', -1)]).format({ textualDescription: true }).should.equal('8 hour cubed per metre');
	});

	test('sort false with multiple dimensions with powers', function () {
		m(9, [new m.D('metre', -1), new m.D('hour', 3)]).format({ sort: false }).should.equal('9 m⁻¹h³');
		m(9, [new m.D('metre', -1), new m.D('hour', 3), new m.D('kelvin', -2)]).format({ sort: false }).should.equal('9 m⁻¹h³°K⁻²');
	});

	test('showAllPowers should always show powers', function () {
		m(21, ['hour', 'metre']).format({ showAllPowers: true }).should.equal('21 h¹m¹');
	});

	test('option asciiOnly should show an ascii representation of the formatted quantity', function () {
		m(106.3e-50, [new m.Dimension('metre', 2)]).format({ expandExponent: true, asciiOnly: true }).should.equal('1.063 x 10^-48 m^2');
		m(12.4, [new m.Dimension('metre', -1), new m.Dimension('hour', 3), new m.Dimension('kelvin', -2)]).format({ asciiOnly: true }).should.equal('12.4 h^3m^-1°K^-2');
		m(21, ['hour', 'metre']).format({ showAllPowers: true, asciiOnly: true }).should.equal('21 h^1m^1');
	});

});

},{"../lib/measurement.js":17,"should":39}],7:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity - multiply', function () {

	test('simple multiply with no units', function () {
		m(14).multiply(m(2)).should.have.property('value', 28);
		m(-3).multiply(m(8)).should.have.property('value', -24);
	});

	test('simple multiply with different single units', function () {
		var q1 = m(14, 'metre').multiply(m(2, 'second'));

		q1.should.have.property('value', 28);
		q1.should.have.property('dimensions').with.lengthOf(2);

		q1.dimensions[0].should.have.property('power', 1);
		q1.dimensions[0].unit.should.have.property('key', 'metre');

		q1.dimensions[1].should.have.property('power', 1);
		q1.dimensions[1].unit.should.have.property('key', 'second');
	});

	test('multiply with different units with single simplification', function () {
		var q1 = m(14, ['metre', 'second']).multiply(m(2, 'second'));

		q1.should.have.property('value', 28);
		q1.should.have.property('dimensions').with.lengthOf(2);

		q1.dimensions[0].should.have.property('power', 1);
		q1.dimensions[0].unit.should.have.property('key', 'metre');

		q1.dimensions[1].should.have.property('power', 2);
		q1.dimensions[1].unit.should.have.property('key', 'second');
	});

});

},{"../lib/measurement.js":17,"should":39}],8:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity', function () {

	test('construct quantity with system', function () {
		m(12, 'metre').should.have.property('value', 12);
		m(12, 'metre').should.have.property('dimensions').with.lengthOf(1);
		m(12, 'metre').serialised().should.eql(JSON.parse('{\"value\":12,\"dimension\":\"length\",\"unit\":\"metre\"}'));
	});

	test('construct quantity with multiple dimensions', function () {
		var q1 = m(12, [ new m.D('metre', 'length'), new m.D('second', 'time') ]);

		q1.should.have.property('value', 12);
		q1.should.have.property('dimensions').with.lengthOf(2);
	});

	test('construct quantity with multiple dimensions with no systems', function () {
		var q1 = m(12, [ 'metre', 'second' ]);
		
		q1.should.have.property('value', 12);
		q1.should.have.property('dimensions').with.lengthOf(2);
	});

	test('simple conversion from base unit to other unit', function () {
		var cQuantity, kQuantity;

		cQuantity = m(280, 'kelvin');
		kQuantity = cQuantity.convert('celsius');
		kQuantity.value.should.be.approximately(6.85, DELTA);
	});

	test('conversion from unit to other unit', function () {

		m(15, 'hour').convert('minute').value.should.equal(15 * 60);
		m(0, 'celsius').convert('fahrenheit').value.should.be.approximately(32, DELTA);
	});

	test('can create a new quantity from a json string', function () {
		m('{ \"value\": 25, \"dimension\": \"time\", \"unit\":\"month\"}').format().should.equal('25 month');
	});

	test('json string used to create quantity equivalent to json string from serialising quantity', function () {
		var json, cQuantity;

		json = '{ \"value\": 25, \"dimension\": \"time\", \"unit\":\"month\"}';
		JSON.parse(m(json).toJson()).should.eql(JSON.parse(json));
	});

});

suite('Quantity - simplify dimensions', function () {

	test('simple combine of dimensions', function () {
		var q1, q2;

		q1 = m(12, [ 'second', 'second' ]);
		q1.should.have.property('value', 12);
		q1.should.have.property('dimensions').with.lengthOf(2);

		q2 = q1.simplify();
		q2.should.have.property('dimensions').with.lengthOf(1);
		q2.dimensions[0].should.have.property('power', 2);
	});

	test('simplify dimensions with power 0', function () {
		var q1, q2;

		q1 = m(12, [new m.Dimension('second'), new m.Dimension('second', -1), new m.Dimension('metre')]);
		q1.should.have.property('value', 12);
		q1.should.have.property('dimensions').with.lengthOf(3);

		q2 = q1.simplify();
		q2.should.have.property('dimensions').with.lengthOf(1);
		q2.dimensions[0].should.have.property('power', 1);
		q2.dimensions[0].unit.should.have.property('key', 'metre');
	});

});

},{"../lib/measurement.js":17,"should":39}],9:[function(require,module,exports){
/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

var DELTA = 1e-8;

suite('Quantity - subtract', function () {

	test('simple subtract with no units', function () {
		m(10).subtract(m(5)).should.have.property('value', 5);
		m(-10).subtract(m(5)).should.have.property('value', -15);
		m(-10).subtract(m(-5)).should.have.property('value', -5);
	});

	test('simple subtract with different single units should produce error', function () {
		(function () {
			m(10, 'metre').subtract(m(5, 'second'));
		}).should.throw("In order to convert based upon a quantity they must be commensurable");
	});

	test('simple subtract with the same single units should subtract correctly', function () {
		var q1 = m(80, 'metre').subtract(m(22, 'metre'));

		q1.should.have.property('value', 58);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].should.have.property('power', 1);
	});

	test('simple subtract with the single units in the same system should subtract correctly', function () {
		var q1 = m(10, 'second').subtract(m(5, 'minute'));

		q1.should.have.property('value', -290);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].unit.should.have.property('key', 'second');
		q1.dimensions[0].should.have.property('power', 1);
	});

	test('simple subtract of a smaller unit in the same system should subtract correctly', function () {
		var q1 = m(2, 'hour').subtract(m(30, 'minute'));

		q1.should.have.property('value', 1.5);
		q1.should.have.property('dimensions').with.lengthOf(1);
		q1.dimensions[0].unit.should.have.property('key', 'hour');
		q1.dimensions[0].should.have.property('power', 1);
	});

});

},{"../lib/measurement.js":17,"should":39}],10:[function(require,module,exports){
module.exports={
	"systems": {
		"metric": {
			"name": "Metric System",
			"notes": "Should become a category!"
		},
		"si": {
			"name": "International System of Units",
			"inherits": "metric"
		},
		"astronomical": {
			"name": "Astronomical Units",
			"inherits": "si"
		},
		"siCommon": {
			"name": "Common Non-Scientific Metric (SI)",
			"inherits": "si"
		},
		"australia": {
			"name": "Common Australian Metric (SI)",
			"inherits": "siCommon"
		},
		"canada": {
			"name": "Common Canadian Metric (SI)",
			"inherits": "siCommon"
		},
		"legacyMetric": {
			"name": "Legacy Metric Systems",
			"historical": true,
			"inherits": "metric"
		},
		"cgs": {
			"name": "Centimetre-Gram-Second Unit System",
			"historical": true,
			"inherits": "legacyMetric"
		},
		"mts": {
			"name": "Metre-Tonne-Second Unit System",
			"historical": true,
			"inherits": "legacyMetric"
		},
		"mks": {
			"name": "Metre-Kilogramme-Second Unit System",
			"historical": true,
			"inherits": "legacyMetric"
		},
		"gravitational": {
			"name": "Gravitational Metric System",
			"historical": true,
			"inherits": "legacyMetric"
		},
		"naturalUnitSystems": {
			"name": "Natural Unit Systems",
			"category": true,
			"notes": "A set of systems that hold certain universal constants to 1"
		},
		"planck": {
			"name": "Planck Units",
			"inherits": "naturalUnitSystems",
			"notes": "Sets c = G = ħ = kB = 1"
		},
		"natural": {
			"name": "Natural Units",
			"inherits": "naturalUnitSystems",
			"notes": "Sets c = ħ = kB = 1"
		},
		"stoney": {
			"name": "Stoney Units",
			"inherits": "naturalUnitSystems",
			"notes": "Sets c = G = e = kB = 1; c = 1/α"
		},
		"hartree": {
			"name": "Hartree Atomic Units",
			"inherits": "naturalUnitSystems",
			"notes": "Sets e = mₑ = ħ = kB = 1; c = 1/α"
		},
		"rydberg": {
			"name": "Rydberg Atomic Units",
			"inherits": "naturalUnitSystems",
			"notes": "Sets e/√2 = 2mₑ = ħ = kB = 1; c = 2/α"
		},
		"qcd": {
			"name": "Quantum Chromodynamics Units (QCD)",
			"inherits": "naturalUnitSystems",
			"notes": "Sets c = mp = ħ = kB = 1"
		},
		"internationalNautical": {
			"name": "International Nautical Measure"
		},
		"imperial": {
			"name": "UK Imperial Units"
		},
		"imperialNautical": {
			"name": "Imperial Nautical Units",
			"historical": true,
			"inherits": "imperial"
		},
		"englishEngineering": {
			"name": "English Engineering System",
			"historical": true,
			"inherits": "imperial"
		},
		"britishGravitational": {
			"name": "British Gravitational System",
			"historical": true,
			"inherits": "imperial"
		},
		"absoluteEnglish": {
			"name": "Absolute English System",
			"historical": true,
			"inherits": "imperial"
		},
		"usCustomary": {
			"name": "US Customary Units",
			"notes": "The American System of Measures"
		},
		"avoirdupois": {
			"name": "Avoirdupois Units",
			"inherits": "usCustomary"
		},
		"usSurvey": {
			"name": "US Survey Units",
			"inherits": "usCustomary"
		},
		"usNautical": {
			"name": "International Nautical Units",
			"inherits": "usCustomary"
		},
		"usFoodNutrition": {
			"name": "US Food Nutrition Labeling Units",
			"inherits": "usCustomary"
		},
		"englishUnits": {
			"name": "Traditional English Units",
			"historical": true
		},
		"apothecaries": {
			"name": "Apothecaries' Units",
			"historical": true,
			"inherits": "englishUnits"
		},
		"troy": {
			"name": "Troy Weight",
			"historical": true,
			"inherits": "englishUnits"
		},
		"nonStandard": {
			"name": "Non-Standard Units",
			"notes": "Units that don't fit into a specific system"
		},
		"traditionalChinese": {
			"name": "Traditional Chinese Units",
			"historical": true
		},
		"oldEuropean":{
			"name": "Old European Units",
			"historical": true
		},
		"ancient": {
			"name": "Ancient Units",
			"historical": true
		},
		"biblical": {
			"name": "Biblical Units",
			"historical": true,
			"inherits": "ancient"
		},
		"ancientRoman": {
			"name": "Ancient Roman Units",
			"historical": true,
			"inherits": "ancient"
		}
	},
	"dimensions": {
		"time": {
			"name": "time",
			"otherNames": [ "duration" ],
			"symbol": "T",
			"baseUnit": "second",
			"vector": false,
			"units": {
				"second": {
					"name": "second",
					"plural": "seconds",
					"symbol": "s",
					"otherSymbols": ["sec"],
					"type": "si",
					"systems": ["metric", "imperial", "usCustomary", "englishUnits"],
					"tags": ["cooking"],
					"notes": "1/60 of minute"
				},
				"minute": {
					"name": "minute",
					"plural": "minutes",
					"symbol": "min",
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"tags": ["cooking"],
					"multiplier": 60,
					"notes": "1/60 of hour"
				},
				"hour": {
					"name": "hour",
					"plural": "hours",
					"otherNames": ["horae"],
					"symbol": "h",
					"otherSymbols": ["hr"],
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits", "ancient"],
					"tags": ["cooking"],
					"multiplier": 3600,
					"notes": "1/24 of day. The hour was developed by astrologers in Classical antiquity."
				},
				"day": {
					"name": "day",
					"plural": "days",
					"symbol": "d",
					"type": "customary",
					"multiplier": 86400,
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits", "ancient"],
					"notes": "Possible Base"
				},
				"week": {
					"name": "week",
					"plural": "weeks",
					"symbol": "wk",
					"otherSymbols": ["w"],
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 604800,
					"notes": "7 days"
				},
				"month": {
					"name": "month",
					"plural": "months",
					"type": "customary",
					"estimation": true,
					"multiplier": 2629800,
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"notes": "1/12 of Julian year."
				},
				"year": {
					"name": "year",
					"plural": "years",
					"otherNames": ["annus", "Julian year"],
					"symbol": "yr",
					"otherSymbols": ["y", "a", "aj"],
					"type": "si",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 31557600,
					"notes": "365.25 days of 86400 seconds"
				},
				"commonYear": {
					"name": "common year",
					"plural": "common years",
					"symbol": "common yr",
					"otherSymbols": ["y"],
					"type": "customary",
					"multiplier": 31536000,
					"systems": ["nonStandard"],
					"notes": "Common Year - 365 days of 86400 seconds. Maybe si."
				},
				"leapYear": {
					"name": "leap year",
					"plural": "leap years",
					"symbol": "leap yr",
					"type": "customary",
					"multiplier": 31622400,
					"systems": ["nonStandard"],
					"notes": "Leap Year - 366 days of 86400 seconds"
				},
				"gregorianYear": {
					"name": "Gregorian year",
					"plural": "Gregorian years",
					"otherNames": ["year"],
					"symbol": "yr",
					"otherSymbols": ["y"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 31556952,
					"notes": "365.2425 days of 86400 seconds. Maybe si."
				},
				"tropicalYear": {
					"name": "tropical year",
					"plural": "tropical years",
					"otherNames": ["year"],
					"symbol": "yr",
					"otherSymbols": ["y"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 31556925.216,
					"notes": "365.24219 days of 86400 seconds. Maybe si."
				},
				"ke": {
					"name": "ke",
					"type": "customary",
					"systems": ["traditionalChinese"],
					"multiplier": 864
				},
				"decade": {
					"name": "decade",
					"plural": "decades",
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 315576000,
					"notes": "10 Julian years"
				},
				"century": {
					"name": "century",
					"plural": "centuries",
					"symbol": "C",
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 3155760000,
					"notes": "100 Julian years"
				},
				"millennium": {
					"name": "millennium",
					"plural": "millennia",
					"symbol": "M",
					"type": "customary",
					"systems": ["siCommon", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 31557600000,
					"notes": "1000 Julian years"
				},
				"minuta": {
					"name": "minuta",
					"type": "customary",
					"systems": ["ancient"],
					"multiplier": 1440,
					"notes": "1/60 of day. Used by ancient astrologers."
				},
				"secunda": {
					"name": "secunda",
					"type": "customary",
					"systems": ["ancient"],
					"multiplier": 24,
					"notes": "1/3600 of day. Used by ancient astrologers."
				},
				"planckTime": {
					"name": "Planck time",
					"symbol": "t\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 5.39106e-44,
					"uncertainty": 0.00032e-44
				},
				"naturalTime": {
					"name": "inverse electron volt of time",
					"plural": "inverse electron volts of time",
					"symbol": "1/E",
					"otherSymbols": ["E⁻¹", "eV⁻¹", "eV⁻¹ of time"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 6.58e-16,
					"uncertainty": 0.01e-16
				}
			}
		},
		"length": {
			"name": "length",
			"otherNames": [ "distance", "radius", "wavelength" ],
			"symbol": "L",
			"baseUnit": "metre",
			"vector": false,
			"units": {
				"metre": {
					"name": "metre",
					"plural": "metres",
					"otherNames": ["meter", "meters"],
					"symbol": "m",
					"type": "si",
					"systems": ["si", "mts", "mks", "gravitational"],
					"tags": ["cooking"]
				},
				"angstrom": {
					"name": "ångström",
					"plural": "ångströms",
					"otherNames": ["angstrom", "angstroms"],
					"symbol": "Å",
					"otherSymbols": ["A"],
					"systems": ["legacyMetric"],
					"type": "customary",
					"multiplier": 1e-10
				},
				"centimetre": {
					"name": "centimetre",
					"plural": "centimetres",
					"otherNames": ["centimeter","centimeters"],
					"symbol": "cm",
					"systems": ["cgs"],
					"type": "customary",
					"multiplier": 0.01
				},
				"mile": {
					"name": "mile",
					"plural": "miles",
					"symbol": "mi",
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 1609.344
				},
				"usSurveyMile": {
					"name": "US Survey mile",
					"plural": "US Survey miles",
					"otherNames": ["statute mile", "mile", "miles"],
					"symbol": "mi",
					"type": "customary",
					"systems": ["usSurvey"],
					"rare": true,
					"multiplier": 1609.3472,
					"notes": "Used exclusively for land survey. Used to be statute mile"
				},
				"yard": {
					"name": "yard",
					"plural": "yards",
					"symbol": "yd",
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 0.9144
				},
				"foot": {
					"name": "foot",
					"plural": "feet",
					"symbol": "ft",
					"otherSymbols": ["'"],
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 0.3048
				},
				"usSurveyFoot": {
					"name": "US Survey foot",
					"plural": "US Survey feet",
					"otherNames": ["foot", "feet"],
					"symbol": "ft",
					"otherSymbols": ["'"],
					"type": "customary",
					"systems": ["usSurvey"],
					"rare": true,
					"multiplier": 0.3048006096,
					"notes": "Used exclusively for land survey. Used to be statute foot"
				},
				"inch": {
					"name": "inch",
					"plural": "inches",
					"symbol": "in",
					"otherSymbols": ["\""],
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 0.0254
				},
				"nauticalMile": {
					"name": "nautical mile",
					"plural": "nautical miles",
					"symbol": "M",
					"otherSymbols": ["NM", "nmi", "naut.mi"],
					"type": "customary",
					"systems": ["legacyMetric", "siCommon", "internationalNautical", "usNautical", "imperialNautical"],
					"multiplier": 1852
				},
				"fathom": {
					"name": "fathom",
					"plural": "fathoms",
					"symbol": "ftm",
					"otherSymbols": ["f", "fath", "fm", "fth", "fthm"],
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 1.8288,
					"notes": "The nautical use and definition of fathom varied widely"
				},
				"cableLengthInternational": {
					"name": "cable",
					"plural": "cables",
					"otherNames": ["cable length", "cable lengths", "cable's length", "cable's lengths"],
					"type": "customary",
					"systems": ["internationalNautical"],
					"multiplier": 185.2					
				},
				"cableLengthImperial": {
					"name": "cable",
					"plural": "cables",
					"otherNames": ["cable length", "cable lengths", "cable's length", "cable's lengths"],
					"type": "customary",
					"systems": ["imperialNautical"],
					"multiplier": 185.32
				},
				"cableLengthUS": {
					"name": "cable",
					"plural": "cables",
					"otherNames": ["cable length", "cable lengths", "cable's length", "cable's lengths"],
					"type": "customary",
					"systems": ["usNautical"],
					"multiplier": 219.456
				},
				"furlong": {
					"name": "furlong",
					"plural": "furlongs",
					"symbol": "fur",
					"type": "customary",
					"systems": ["imperial", "usCustomary", "englishUnits"],
					"multiplier": 201.168
				},
				"cubitBiblical": {
					"name": "cubit",
					"plural": "cubits",
					"type": "customary",
					"estimation": true,
					"systems": ["biblical"],
					"multiplier": 0.45,
					"notes": "Distance from fingers to elbow"
				},
				"digitus": {
					"name": "digitus",
					"otherNames": ["digitus transversus"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.0185,
					"notes": "finger - 1/16 pes. Based on 1 pes = 0.296m"
				},
				"uncia": {
					"name": "uncia",
					"otherNames": ["pollex"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.0246,
					"notes": "inch/thumb - 1/12 pes. Based on 1 pes = 0.296m"
				},
				"palmus": {
					"name": "palmus",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.074,
					"notes": "palm width - 1/4 pes. Based on 1 pes = 0.296m"
				},
				"palmusMajor": {
					"name": "palmus major",
					"type": "customary",
					"estimation": true,
					"rare": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.222,
					"notes": "palm length - 3/4 pes - in late period only. Based on 1 pes = 0.296m"
				},
				"pes": {
					"name": "pes",
					"plural": "pedes",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.296,
					"notes": "foot. Based on 1 pes = 0.296m"
				},
				"palmipes": {
					"name": "palmipes",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.37,
					"notes": "1 1/4 pedes. Based on 1 pes = 0.296m"
				},
				"cubitus": {
					"name": "cubitus",
					"otherNames": ["cubit"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.444,
					"notes": "cubit - 1 1⁄2 pedes. Based on 1 pes = 0.296m"
				},
				"gradus": {
					"name": "gradus",
					"otherNames": ["pes sestertius"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 0.74,
					"notes": "step - 2 1/2 pedes. Based on 1 pes = 0.296m"
				},
				"passus": {
					"name": "passus",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 1.48,
					"notes": "(double) pace - 5 pedes. Based on 1 pes = 0.296m"
				},
				"pertica": {
					"name": "pertica",
					"otherNames": ["decempeda"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 2.96,
					"notes": "perch - 10 pedes. Based on 1 pes = 0.296m"
				},
				"actus": {
					"name": "actus",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 35.5,
					"notes": "120 pedes. Based on 1 pes = 0.296m"
				},
				"stadium": {
					"name": "stadium",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 185,
					"notes": "furlong - 625 pedes. Based on 1 pes = 0.296m"
				},
				"millePassuum": {
					"name": "mille passum",
					"otherNames": ["milliarium"],
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 1480,
					"notes": "mile - 5000 pedes. Based on 1 pes = 0.296m"
				},
				"gallicLeuga": {
					"name": "Gallic leuga",
					"type": "customary",
					"estimation": true,
					"systems": ["ancientRoman"],
					"multiplier": 2220,
					"notes": "league - 7500 pedes. Based on 1 pes = 0.296m"
				},
				"ell": {
					"name": "ell",
					"plural": "ells",
					"type": "customary",
					"rare": true,
					"systems": ["oldEuropean"],
					"multiplier": 1.143,
					"notes": "This is the English ell, lengths vary from 0.5m (cubit) to 1.372m"
				},
				"ellScotish": {
					"name": "ell",
					"plural": "ells",
					"type": "customary",
					"rare": true,
					"systems": ["oldEuropean"],
					"multiplier": 0.941318,
					"notes": "This is the Scotish ell, lengths vary from 0.5m (cubit) to 1.372m"
				},
				"chain": {
					"name": "chain",
					"plural": "chains",
					"symbol": "ch",
					"type": "customary",
					"systems": ["oldEuropean", "englishUnits", "usCustomary"],
					"multiplier": 20.1168
				},
				"finger": {
					"name": "finger",
					"plural": "fingers",
					"otherNames": ["fingerbreadth", "finger's breadth"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 0.022225
				},
				"fingerCloth": {
					"name": "finger",
					"plural": "fingers",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 0.1143
				},
				"hand": {
					"name": "hand",
					"plural": "hands",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 0.1016
				},
				"rod": {
					"name": "rod",
					"plural": "rods",
					"symbol": "rd",
					"otherNames": ["pole", "poles", "perch"],
					"type": "customary",
					"systems": ["oldEuropean", "englishUnits", "usCustomary"],
					"multiplier": 5.0292
				},
				"rope": {
					"name": "rope",
					"plural": "ropes",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 6.096
				},
				"span": {
					"name": "span",
					"plural": "spans",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 0.2286
				},
				"league": {
					"name": "league",
					"plural": "leagues",
					"symbol": "lea",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 4828.02,
					"notes": "Originally meant the distance a person could walk in an hour"
				},
				"leagueNautical": {
					"name": "league",
					"plural": "leagues",
					"otherNames": ["nautical league", "nautical leagues"],
					"symbol": "lea",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 5556
				},
				"astronomicalUnit": {
					"name": "astronomical unit",
					"plural": "astronomical units",
					"symbol": "au",
					"otherSymbols": ["AU", "a.u.", "ua"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 1.4960e11,
					"notes": "Non-SI unit accepted for use with the SI, and whose value in SI units must be obtained experimentally"
				},
				"lightSecond": {
					"name": "light-second",
					"plural": "light-seconds",
					"otherNames": ["light second", "light seconds"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 299792458,
					"notes": "Distance light travels in vacuum in 1 second"
				},
				"lightMinute": {
					"name": "light-minute",
					"plural": "light-minutes",
					"otherNames": ["light minute", "light minutes"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 1.798754748e10,
					"notes": "Distance light travels in vacuum in 60 seconds"
				},
				"lightHour": {
					"name": "light-hour",
					"plural": "light-hours",
					"otherNames": ["light hour", "light hours"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 1.079252849e12,
					"notes": "Distance light travels in vacuum in 3600 seconds"
				},
				"lightDay": {
					"name": "light-day",
					"plural": "light-days",
					"otherNames": ["light day", "light days"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 2.590206837e13,
					"notes": "Distance light travels in vacuum in 24 light-hours, 86,400 light-seconds"
				},
				"lightWeek": {
					"name": "light-week",
					"plural": "light-weeks",
					"otherNames": ["light week", "light weeks"],
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 1.813144786e14,
					"notes": "Distance light travels in vacuum in 7 light-days, 604,800 light-seconds"
				},
				"lightYear": {
					"name": "light-year",
					"plural": "light-years",
					"otherNames": ["light year", "light years"],
					"symbol": "ly",
					"type": "customary",
					"systems": ["astronomical"],
					"multiplier": 9.4607304725808e15,
					"notes": "Distance light travels in vacuum in 365.25 days"
				},
				"planckLength": {
					"name": "Planck length",
					"symbol": "l\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 1.616199e-35,
					"uncertainty": 0.000097e-35
				},
				"naturalLength": {
					"name": "inverse electron volt of length",
					"plural": "inverse electron volts of length",
					"symbol": "1/E",
					"otherSymbols": ["E⁻¹", "eV⁻¹", "eV⁻¹ of length"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 1.97e-7,
					"uncertainty": 0.01e-7
				}
			}
		},
		"mass": {
			"name": "mass",
			"symbol": "M",
			"baseUnit": "kilogram",
			"vector": false,
			"units": {
				"kilogram": {
					"name": "kilogram",
					"plural": "kilograms",
					"symbol": "kg",
					"otherNames": ["kilogramme"],
					"type": "si",
					"systems": ["si"],
					"tags": ["cooking"],
					"prefixName": "kilo",
					"prefixFreeName": "gram"
				},
				"grave": {
					"name": "grave",
					"plural": "graves",
					"symbol": "G",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 1,
					"notes": "Replaced by the kilogram"
				},
				"ounce": {
					"name": "ounce",
					"plural": "ounces",
					"symbol": "oz",
					"otherSymbols": ["oz av"],
					"type": "customary",
					"systems": ["imperial", "avoirdupois"],
					"tags": ["cooking"],
					"multiplier": 0.028349523125
				},
				"pound": {
					"name": "pound",
					"plural": "pounds",
					"symbol": "lb",
					"otherSymbols": ["lb av"],
					"type": "customary",
					"systems": ["imperial", "avoirdupois"],
					"tags": ["cooking"],
					"multiplier": 0.45359237
				},
				"stone": {
					"name": "stone",
					"symbol": "st",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 6.35029318,
					"notes": "The plural 'stones' is not used in representing quantities."
				},
				"tonLong": {
					"name": "ton",
					"plural": "tons",
					"otherNames": ["long ton", "long tons", "imperial ton", "weight ton"],
					"symbol": "ton",
					"otherSymbols": ["long tn", "tn"],
					"type": "customary",
					"systems": ["imperial", "avoirdupois"],
					"multiplier": 1016.0469088
				},
				"tonShort": {
					"name": "ton",
					"plural": "tons",
					"otherNames": ["short ton", "short tons"],
					"symbol": "ton",
					"otherSymbols": ["sh tn", "tn"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 907.18474
				},
				"tonne": {
					"name": "tonne",
					"plural": "tonnes",
					"otherNames": ["metric ton", "metric tons"],
					"symbol": "t",
					"otherSymbols": ["T", "mT", "MT", "mt", "Te"],
					"type": "si",
					"systems": ["siCommon", "legacyMetric"],
					"multiplier": 1000
				},
				"grain": {
					"name": "grain",
					"plural": "grains",
					"symbol": "gr",
					"otherNames": ["troy grain"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 64.79891e-6
				},
				"mite": {
					"name": "mite",
					"plural": "mites",
					"type": "customary",
					"systems": ["oldEuropean", "troy"],
					"multiplier": 3.2399455e-6,
					"notes": "1/20 grain"
				},
				"carat": {
					"name": "carat",
					"plural": "carats",
					"otherNames": ["metric carat"],
					"symbol": "ct",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 200e-6
				},
				"pennyweight": {
					"name": "pennyweight",
					"plural": "pennyweights",
					"symbol": "dwt",
					"otherSymbols": ["pwt", "PW"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 1.55517384e-3
				},
				"hundredweightLong": {
					"name": "hundredweight",
					"plural": "hundredweights",
					"otherNames": ["long hundredweight", "centum weight"],
					"symbol": "cwt",
					"otherSymbols": ["long cwt"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 50.802345
				},
				"hundredweightShort": {
					"name": "hundredweight",
					"plural": "hundredweights",
					"otherNames": ["short hundredweight", "cental", "centum weight"],
					"symbol": "sh cwt",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 45.359237
				},
				"kip": {
					"name": "kip",
					"plural": "kips",
					"symbol": "kip",
					"rare": true,
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 453.59237,
					"notes": "Half a short ton"
				},
				"atomicMassUnit": {
					"name": "atomic mass unit",
					"plural": "atomic mass units",
					"otherNames": ["dalton", "unified atomic mass unit"],
					"symbol": "amu",
					"otherSymbols": ["Da"],
					"type": "si",
					"systems": ["si"],
					"multiplier": 1.66053892173e-27,
					"notes": "Non-SI unit accepted for use with the SI, and whose value in SI units must be obtained experimentally"
				},
				"electronMass": {
					"name": "electron mass",
					"plural": "electron masses",
					"otherNames": ["electron rest mass"],
					"symbol": "mₑ",
					"type": "si",
					"systems": ["si"],
					"multiplier": 9.1093821545e-31
				},
				"siliqua": {
					"name": "siliqua",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 0.19e-3,
					"notes": "1/144 uncia. Based on 1 libra = 328.9 g"
				},
				"obolus": {
					"name": "obolus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 0.57e-3,
					"notes": "1/48 uncia. Based on 1 libra = 328.9 g"
				},
				"scrupulum": {
					"name": "scrupulum",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1.14e-3,
					"notes": "1/24 uncia. Based on 1 libra = 328.9 g"
				},
				"semisextula": {
					"name": "semisextula",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 2.28e-3,
					"notes": "1/12 uncia. Based on 1 libra = 328.9 g"
				},
				"sextula": {
					"name": "sextula",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 4.57e-3,
					"notes": "1/6 uncia. Based on 1 libra = 328.9 g"
				},
				"sicilicius": {
					"name": "sicilicius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 6.85e-3,
					"notes": "1/4 uncia. Based on 1 libra = 328.9 g"
				},
				"duella": {
					"name": "duella",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 9.14e-3,
					"notes": "1/3 uncia. Based on 1 libra = 328.9 g"
				},
				"semuncia": {
					"name": "semuncia",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 13.7e-3,
					"notes": "1/2 uncia. Based on 1 libra = 328.9 g"
				},
				"uncia": {
					"name": "uncia",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 27.4e-3,
					"notes": "Roman ounce. 1/12 libra. Based on 1 libra = 328.9 g"
				},
				"sescuncia": {
					"name": "secuncia",
					"otherNames": ["sescunx"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 41.1e-3,
					"notes": "1/8 libra. Based on 1 libra = 328.9 g"
				},
				"sextans": {
					"name": "sextans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 54.8e-3,
					"notes": "1/6 libra. Based on 1 libra = 328.9 g"
				},
				"quadrans": {
					"name": "quadrans",
					"otherNames": ["teruncius"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 82.2e-3,
					"notes": "1/4 libra. Based on 1 libra = 328.9 g"
				},
				"triens": {
					"name": "triens",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 109.6e-3,
					"notes": "1/3 libra. Based on 1 libra = 328.9 g"
				},
				"quincunx": {
					"name": "quincunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 137e-3,
					"notes": "5/12 libra. Based on 1 libra = 328.9 g"
				},
				"semis": {
					"name": "semis",
					"otherNames": ["semissis"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 164.5e-3,
					"notes": "1/2 libra. Based on 1 libra = 328.9 g"
				},
				"septunx": {
					"name": "septunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 191.9e-3,
					"notes": "7/12 libra. Based on 1 libra = 328.9 g"
				},
				"bes": {
					"name": "bes",
					"otherNames": ["bessis"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 219.3e-3,
					"notes": "2/3 libra. Based on 1 libra = 328.9 g"
				},
				"dodrans": {
					"name": "dodrans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 246.7e-3,
					"notes": "3/4 libra. Based on 1 libra = 328.9 g"
				},
				"dextans": {
					"name": "dextans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 274.1e-3,
					"notes": "5/6 libra. Based on 1 libra = 328.9 g"
				},
				"deunx": {
					"name": "deunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 301.5e-3,
					"notes": "11/12 libra. Based on 1 libra = 328.9 g"
				},
				"libra": {
					"name": "libra",
					"otherNames": ["as"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 328.9e-3,
					"notes": "Roman pound. Based on 1 libra = 328.9 g"
				},
				"planckMass": {
					"name": "Planck mass",
					"symbol": "m\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 2.17651e-8,
					"uncertainty": 0.00013e-8
				},
				"naturalMass": {
					"name": "electron volt of mass",
					"plural": "electron volts of mass",
					"symbol": "E",
					"otherSymbols": ["E", "eV", "eV of mass"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 1.78e-36,
					"uncertainty": 0.01e-36
				}
			}
		},
		"electricCurrent": {
			"name": "electric current",
			"symbol": "I",
			"baseUnit": "ampere",
			"vector": false,
			"units": {
				"ampere": {
					"name": "ampere",
					"plural": "amperes",
					"otherNames": ["amp", "amps"],
					"symbol": "A",
					"type": "si",
					"systems": ["metric"]
				},
				"abampere": {
					"name": "abampere",
					"plural": "abamperes",
					"otherNames": ["electromagnetic unit"],
					"symbol": "abamp",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 10
				},
				"statampere": {
					"name": "statampere",
					"plural": "statamperes",
					"otherNames": ["ESU per second"],
					"symbol": "statamp",
					"otherSymbols": ["esu/s"],
					"type": "customary",
					"systems": ["cgs"],
					"estimation": true,
					"multiplier": 3.335641e-10
				},
				"planckCurrent": {
					"name": "Planck current",
					"symbol": "I\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 3.4789e25,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"temperature": {
			"name": "temperature",
			"symbol": "Θ",
			"baseUnit": "kelvin",
			"vector": false,
			"units": {
				"kelvin": {
					"name": "kelvin",
					"otherNames": ["degree kelvin", "degrees kelvin"],
					"symbol": "°K",
					"type": "si",
					"systems": ["si"],
					"notes": "As a postpositional adjective, the plural kelvin is used instead of kelvins"
				},
				"celsius": {
					"name": "celsius",
					"otherNames": ["degree celsius", "degrees celsius"],
					"symbol": "°C",
					"type": "si",
					"systems": ["siCommon"],
					"tags": ["cooking"],
					"offset": 273.15
				},
				"fahrenheit": {
					"name": "fahrenheit",
					"otherNames": ["degree fahrenheit", "degrees fahrenheit"],
					"symbol": "°F",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"tags": ["cooking"],
					"multiplier": 0.5555555555555556,
					"offset": 255.37222222
				},
				"rankine": {
					"name": "rankine",
					"otherNames": ["degree rankine", "degrees rankine"],
					"symbol": "°R",
					"otherSymbols": ["Ra"],
					"type": "customary",
					"systems": ["nonStandard"],
					"rare": true,
					"multiplier": 1.8,
					"notes": "Check values"
				},
				"romer": {
					"name": "romer",
					"otherNames": ["degree romer", "degrees romer"],
					"symbol": "°Rø",
					"otherSymbols": ["°R"],
					"type": "customary",
					"systems": ["nonStandard"],
					"rare": true,
					"multiplier": 0.525,
					"offset": 135.90375,
					"notes": "Technically Rømer (or Roemer). Check values"
				},
				"newton": {
					"name": "newton",
					"otherNames": ["degree newton", "degrees newton"],
					"symbol": "°N",
					"type": "customary",
					"systems": ["nonStandard"],
					"rare": true,
					"multiplier": 0.33,
					"offset": 90.13949999999998,
					"notes": "May have rounding error. Check values"
				},
				"delisle": {
					"name": "delisle",
					"otherNames": ["degree delisle", "degrees delisle"],
					"symbol": "°D",
					"otherSymbols": ["°De"],
					"type": "customary",
					"systems": ["nonStandard"],
					"rare": true,
					"multiplier": -1.5,
					"offset": -559.7249999999999,
					"notes": "May have rounding error. Check values"
				},
				"reaumur": {
					"name": "reaumur",
					"otherNames": ["degree reaumur", "degrees reaumur"],
					"symbol": "°Ré",
					"otherSymbols": ["°Re", "°R"],
					"type": "customary",
					"systems": ["nonStandard"],
					"rare": true,
					"multiplier": -1.5,
					"offset": -559.7249999999999,
					"notes": "Technically Réaumur. Check values"
				},
				"planckTemperature": {
					"name": "Planck temperature",
					"symbol": "T\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 1.416833e32,
					"uncertainty": 0.000085e32
				},
				"naturalTemperature": {
					"name": "electron volt of temperature",
					"plural": "electron volts of temperature",
					"symbol": "E",
					"otherSymbols": ["E", "eV", "eV of temperature"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 1.16e4,
					"uncertainty": 0.01e4
				}
			}
		},
		"amountOfSubstance": {
			"name": "amount of substance",
			"symbol": "N",
			"baseUnit": "mole",
			"vector": false,
			"units": {
				"mole": {
					"name": "mole",
					"symbol": "mol",
					"type": "si",
					"systems": ["metric"]
				}
			}
		},
		"luminousIntensity": {
			"name": "luminous intensity",
			"symbol": "J",
			"baseUnit": "candela",
			"vector": false,
			"units": {
				"candela": {
					"name": "candela",
					"plural": "candelas",
					"symbol": "cd",
					"type": "si",
					"systems": ["si"]
				},
				"candlepowerNew": {
					"name": "candlepower",
					"symbol": "cp",
					"type": "customary",
					"systems": ["legacyMetric", "englishUnits"],
					"rare": true,
					"multiplier": 1
				},
				"candlepowerOld": {
					"name": "candlepower",
					"symbol": "cp",
					"type": "customary",
					"systems": ["oldEuropean"],
					"estimation": true,
					"multiplier": 0.981
				}
			}
		},
		"solidAngle": {
			"name": "solid angle",
			"symbol": "Ω",
			"dimensionless": true,
			"baseUnit": "steradian",
			"vector": false,
			"units": {
				"steradian": {
					"name": "steradian",
					"plural": "steradians",
					"symbol": "sr",
					"type": "si",
					"systems": ["si"]
				},
				"squareDegree": {
					"name": "square degree",
					"plural": "square degrees",
					"symbol": "deg²",
					"type": "customary",
					"otherSymbols": ["sq.deg.", "(°)²"],
					"systems": ["legacyMetric"],
					"estimation": true,
					"multiplier": 0.30462e-3,
					"notes": "More information needed on systems"
				}
			}
		},
		"planeAngle": {
			"name": "plane angle",
			"otherNames": ["angle"],
			"symbol": "θ",
			"otherSymbols": ["α", "β", "γ", "φ", "a", "b", "c", "d", "e"],
			"dimensionless": true,
			"baseUnit": "radian",
			"vector": false,
			"units": {
				"radian": {
					"name": "radian",
					"plural": "radians",
					"symbol": "rad",
					"otherSymbols": ["㎭", "ᶜ"],
					"type": "si",
					"systems": ["si"],
					"acceptedPrefixes": ["milli", "micro", "nano"],
					"notes": "Accepted prefixes still not accepted in pure math"
				},
				"mil": {
					"name": "mil",
					"plural": "mils",
					"otherNames": ["angular mil", "angular mils"],
					"symbol": "µ",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 0.981748e-3,
					"notes": "More information needed on systems"
				},
				"minute": {
					"name": "minute",
					"plural": "minutes",
					"otherNames": ["minute of arc", "arcminute", "arcminutes", "arc minute", "arc minutes"],
					"symbol": "'",
					"otherSymbols": ["arcmin", "amin", "am", "MOA"],
					"type": "si",
					"systems": ["metric"],
					"multiplier": 0.290888e-3
				},
				"second": {
					"name": "second",
					"plural": "seconds",
					"otherNames": ["second of arc", "arc second", "arcsecond", "arc seconds", "arcseconds"],
					"symbol": "\"",
					"otherSymbols": ["arcsec", "asec", "as"],
					"type": "si",
					"systems": ["metric"],
					"multiplier": 4.848137e-6
				},
				"centesimalMinuteOfArc": {
					"name": "centesimal minute of arc",
					"plural": "centesimal minutes of arc",
					"symbol": "'",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 0.157080e-3,
					"notes": "More details on systems needed"
				},
				"centesimalSecondOfArc": {
					"name": "centesimal second of arc",
					"plural": "centesimal seconds of arc",
					"symbol": "\"",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.570796e-6,
					"notes": "More details on systems needed"
				},
				"degree": {
					"name": "degree",
					"plural": "degrees",
					"otherNames": ["degrees of arc", "degree of arc", "arc degree", "arc degrees", "arcdegree", "arcdegrees"],
					"symbol": "°",
					"otherSymbols": ["deg"],
					"type": "customary",
					"systems": ["ancient", "metric", "imperial", "usCustomary", "englishUnits"],
					"multiplier": 17.453293e-3
				},
				"grad": {
					"name": "grad",
					"plural": "grads",
					"otherNames": ["gradian", "gon"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 15.707963e-3,
					"notes": "More details on systems needed"
				},
				"octant": {
					"name": "octant",
					"plural": "octants",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.785398,
					"notes": "45° More details on systems needed"
				},
				"quadrant": {
					"name": "quadrant",
					"plural": "quadrants",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 1.570796,
					"notes": "90° More details on systems needed"
				},
				"sextant": {
					"name": "sextant",
					"plural": "sextants",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 1.047198,
					"notes": "60° More details on systems needed"
				},
				"sign": {
					"name": "sign",
					"plural": "signs",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.523599,
					"notes": "30° More details on systems needed"
				}
			}
		},
		"volume": {
			"name": "volume",
			"symbol": "V",
			"baseUnit": "cubicMetre",
			"derived": "length*length*length",
			"vector": false,
			"units": {
				"cubicMetre": {
					"name": "cubic metre",
					"plural": "cubic metres",
					"otherNames": ["cubic meter", "cubic meters", "metre cubed", "metres cubed", "meter cubed", "meters cubed"],
					"symbol": "m³",
					"type": "customary",
					"systems": ["si"]
				},
				"acreFoot": {
					"name": "acre-foot",
					"plural": "acre-feet",
					"otherNames": ["acre foot", "acre feet"],
					"symbol": "ac ft",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1233.48183754752
				},
				"acreInch": {
					"name": "acre-inch",
					"plural": "acre-inches",
					"otherNames": ["acre inch", "acre inches"],
					"symbol": "ac in",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 102.79015312896
				},
				"barrelImperial": {
					"name": "barrel",
					"plural": "barrels",
					"symbol": "bl",
					"otherSymbols": ["bl (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.16365924
				},
				"barrelPetroleum": {
					"name": "barrel",
					"plural": "barrels",
					"otherNames": ["barrel of petroleum", "barrels of petroleum"],
					"symbol": "bl",
					"otherSymbols": ["bbl"],
					"type": "customary",
					"systems": ["nonStandard"],
					"tags": ["fluid-only"],
					"multiplier": 0.158987294928
				},
				"barrelUSDry": {
					"name": "barrel",
					"plural": "barrels",
					"symbol": "bl",
					"otherSymbols": ["bl (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["dry-only"],
					"multiplier": 0.115628198985075
				},
				"barrelUSFluid": {
					"name": "barrel",
					"plural": "barrels",
					"otherNames": ["fluid barrel", "fluid barrels"],
					"symbol": "fl bl",
					"otherSymbols": ["bl", "fl bl (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["fluid-only"],
					"multiplier": 0.119240471196
				},
				"boardFoot": {
					"name": "board-foot",
					"plural": "board-feet",
					"otherNames": ["foot, board measure"],
					"symbol": "FBM",
					"otherSymbols": ["fbm", "BDFT", "BF"],
					"type": "customary",
					"systems": ["usCustomary", "canada"],
					"multiplier": 2.359737216e-3
				},
				"thousandBoardFoot": {
					"name": "thousand board-foot",
					"plural": "thousand board-feet",
					"symbol": "MFBM",
					"otherSymbols": ["Mfbm", "MBFT", "MBF"],
					"type": "customary",
					"systems": ["usCustomary", "canada"],
					"multiplier": 2.359737216
				},
				"millionBoardFoot": {
					"name": "million board-foot",
					"plural": "million board-feet",
					"symbol": "MMFBM",
					"otherSymbols": ["MMfbm", "MMBFT", "MMBF"],
					"type": "customary",
					"systems": ["usCustomary", "canada"],
					"multiplier": 2.359737216e3
				},
				"bucket": {
					"name": "bucket",
					"plural": "buckets",
					"symbol": "bkt",
					"otherSymbols": ["bk", "UK bk"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.01818436
				},
				"bushelImperial": {
					"name": "bushel",
					"plural": "bushels",
					"otherNames": ["bushel imperial"],
					"symbol": "bu",
					"otherSymbols": ["bu (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.03636872
				},
				"bushelUSDryHeaped": {
					"name": "bushel",
					"plural": "bushels",
					"symbol": "bu",
					"otherSymbols": ["bu (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["dry-only"],
					"multiplier": 0.0440488377086
				},
				"bushelUSDryLevel": {
					"name": "bushel",
					"plural": "bushels",
					"symbol": "bu",
					"otherSymbols": ["bu (US lvl)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["dry-only"],
					"multiplier": 0.03523907016688
				},
				"butt": {
					"name": "butt",
					"plural": "butts",
					"otherNames": ["pipe", "pipes"],
					"type": "customary",
					"systems": ["englishUnits", "imperial"],
					"multiplier": 0.476961884784
				},
				"coomb": {
					"name": "coomb",
					"plural": "coombs",
					"type": "customary",
					"systems": ["oldEuropean", "nonStandard"],
					"multiplier": 0.14547488
				},
				"cordFirewood": {
					"name": "cord",
					"plural": "cords",
					"otherNames": ["cord of firewood", "cords of firewood", "cord (timber)", "cords (timber)"],
					"type": "customary",
					"systems": ["usCustomary", "canada", "nonStandard"],
					"multiplier": 3.624556363776
				},
				"cordFoot": {
					"name": "cord foot",
					"plural": "cord feet",
					"otherNames": ["cord foot (timber)", "cord feet (timber)"],
					"type": "customary",
					"systems": ["usCustomary", "nonStandard"],
					"multiplier": 0.453069545472
				},
				"cubicFathom": {
					"name": "cubic fathom",
					"plural": "cubic fathoms",
					"otherNames": ["fathom cubed", "fathoms cubed"],
					"symbol": "cu fm",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"tags": ["fluid-only"],
					"multiplier": 6.116438863872
				},
				"cubicFoot": {
					"name": "cubic foot",
					"plural": "cubic feet",
					"otherNames": ["foot cubed", "feet cubed", "timber foot", "timber feet"],
					"symbol": "cu ft",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 0.028316846592
				},
				"cubicInch": {
					"name": "cubic inch",
					"plural": "cubic inches",
					"otherNames": ["inch cubed", "inches cubed"],
					"symbol": "cu in",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 16.387064e-6
				},
				"cubicMile": {
					"name": "cubic mile",
					"plural": "cubic miles",
					"otherNames": ["mile cubed", "miles cubed"],
					"symbol": "cu mi",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 4168181825.440579584
				},
				"cubicYard": {
					"name": "cubic yard",
					"plural": "cubic yards",
					"otherNames": ["yard cubed", "yards cubed"],
					"symbol": "cu yd",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 0.764554857984
				},
				"cupBreakfast": {
					"name": "cup",
					"plural": "cups",
					"otherNames": ["breakfast cup", "breakfast cups"],
					"symbol": "c",
					"otherSymbols": ["c (breakfast)"],
					"type": "customary",
					"systems": ["nonStandard"],
					"tags": ["cooking"],
					"multiplier": 284.130625e-6
				},
				"cupCanadian": {
					"name": "cup",
					"plural": "cups",
					"symbol": "c",
					"otherSymbols": ["c (CA)"],
					"type": "customary",
					"systems": ["canada"],
					"tags": ["cooking"],
					"multiplier": 227.3045e-6
				},
				"cup": {
					"name": "cup",
					"plural": "cups",
					"otherNames": ["metric cup", "metric cups"],
					"symbol": "c",
					"type": "customary",
					"systems": ["metric"],
					"excludedSystems": ["canada"],
					"tags": ["cooking"],
					"multiplier": 250.0e-6
				},
				"cupUSCustomary": {
					"name": "cup",
					"plural": "cups",
					"symbol": "c",
					"otherSymbols": ["c (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 236.5882365e-6
				},
				"cupUSFoodNutritionLabeling": {
					"name": "cup",
					"plural": "cups",
					"symbol": "c",
					"otherSymbols": ["c (US)"],
					"type": "customary",
					"systems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 240.0e-6
				},
				"dashImperial": {
					"name": "dash",
					"plural": "dashes",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 369.9617513020833333e-9
				},
				"dashUS": {
					"name": "dash",
					"plural": "dashes",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 308.057599609375e-9
				},
				"dessertspoon": {
					"name": "dessertspoon",
					"plural": "dessertspoons",
					"otherNames": ["dessert spoon", "dessert spoons"],
					"symbol": "dstspn.",
					"type": "customary",
					"rare": true,
					"systems": ["metric", "imperial", "usCustomary"],
					"tags": ["cooking"],
					"multiplier": 10.0e-6
				},
				"dropImperial": {
					"name": "drop",
					"plural": "drops",
					"symbol": "drop",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 98.6564670138888889e-9
				},
				"dropMedical": {
					"name": "drop",
					"plural": "drops",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 83.03333333e-9
				},
				"drop": {
					"name": "drop",
					"plural": "drops",
					"otherNames": ["metric drop", "metric drops"],
					"type": "customary",
					"systems": ["metric"],
					"tags": ["cooking"],
					"multiplier": 50.0e-9
				},
				"dropUS": {
					"name": "drop",
					"plural": "drops",
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking"],
					"multiplier": 82.14869322916666667e-9
				},
				"fifth": {
					"name": "fifth",
					"plural": "fifths",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 757.0823568e-6
				},
				"firkin": {
					"name": "firkin",
					"plural": "firkins",
					"otherNames": ["rundlet", "rundlets"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.04091481
				},
				"fluidDrachm": {
					"name": "fluid drachm",
					"plural": "fluid drachms",
					"otherNames": ["fluidrachm", "fluidrachms"],
					"symbol": "fl dr",
					"otherSymbols": ["ƒ 3", "fʒ"],
					"type": "customary",
					"systems": ["imperial", "apothecaries"],
					"multiplier": 3.5516328125e-6
				},
				"fluidDram": {
					"name": "fluid dram",
					"plural": "fluid drams",
					"otherNames": ["fluidram", "fluidrams"],
					"symbol": "fl dr",
					"otherSymbols": ["ƒ 3", "fʒ"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3.6966911953125e-6
				},
				"fluidScruple": {
					"name": "fluid scruple",
					"plural": "fluid scruples",
					"symbol": "fl s",
					"otherSymbols": ["fl. scruple"],
					"type": "customary",
					"systems": ["imperial", "apothecaries"],
					"multiplier": 1.1838776041666667e-6
				},
				"gallonBeer": {
					"name": "beer gallon",
					"plural": "beer gallons",
					"otherNames": ["ale gallon", "ale gallons"],
					"symbol": "beer gal",
					"type": "customary",
					"systems": ["englishUnits"],
					"multiplier": 4.621152048e-3
				},
				"gallonImperial": {
					"name": "gallon",
					"plural": "gallons",
					"symbol": "gal",
					"otherSymbols": ["gal (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 4.54609e-3
				},
				"gallonUSDry": {
					"name": "gallon",
					"plural": "gallons",
					"symbol": "gal",
					"otherSymbols": ["gal (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "dry-only"],
					"multiplier": 4.40488377086e-3
				},
				"gallonUSFluid": {
					"name": "gallon",
					"plural": "gallons",
					"symbol": "gal",
					"otherSymbols": ["gal (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 3.785411784e-3
				},
				"gillImperial": {
					"name": "gill",
					"plural": "gills",
					"otherNames": ["noggin"],
					"symbol": "gi",
					"otherSymbols": ["gi (imp)", "nog"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 142.0653125e-6
				},
				"gillUS": {
					"name": "gill",
					"plural": "gills",
					"symbol": "gi",
					"otherSymbols": ["gi (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 118.29411825e-6
				},
				"hogsheadImperial": {
					"name": "hogshead",
					"plural": "hogsheads",
					"symbol": "hhd",
					"otherSymbols": ["hhd (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.32731848
				},
				"hogsheadUS": {
					"name": "hogshead",
					"plural": "hogsheads",
					"symbol": "hhd",
					"otherSymbols": ["hhd (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.238480942392
				},
				"kilderkin": {
					"name": "kilderkin",
					"plural": "kilderkins",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.08182962,
					"notes": "Name from Dutch for 'small cask'"
				},
				"lambda": {
					"name": "lambda",
					"plural": "lambdas",
					"symbol": "λ",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 1e-9
				},
				"last": {
					"name": "last",
					"otherNames": ["łaszt"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 2.9094976
				},
				"litre": {
					"name": "litre",
					"plural": "litres",
					"otherNames": ["liter", "liters", "Cadil"],
					"symbol": "L",
					"otherSymbols": ["l"],
					"type": "si",
					"systems": ["siCommon", "legacyMetric"],
					"tags": ["cooking"],
					"multiplier": 0.001,
					"notes": "A litre was originally the metric base unit for volume. Now non-SI metric."
				},
				"load": {
					"name": "load",
					"plural": "loads",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 1.4158423296
				},
				"minimImperial": {
					"name": "minim",
					"plural": "minims",
					"symbol": "min",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 59.19388020833333e-9
				},
				"minimUS": {
					"name": "minim",
					"plural": "minims",
					"symbol": "min",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 61.611519921875e-9
				},
				"fluidOunceImperial": {
					"name": "fluid ounce",
					"plural": "fluid ounces",
					"symbol": "fl oz",
					"otherSymbols": ["fl oz (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 28.4130625e-6
				},
				"fluidOunceUSCustomary": {
					"name": "fluid ounce",
					"plural": "fluid ounces",
					"symbol": "fl oz",
					"otherSymbols": ["fl oz (US)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 29.5735295625e-6
				},
				"fluidOunceUSFoodNutritionLabeling": {
					"name": "fluid ounce",
					"plural": "fluid ounces",
					"symbol": "fl oz",
					"otherSymbols": ["fl oz (US)"],
					"type": "customary",
					"systems": ["usFoodNutrition"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 3.0e-5
				},
				"peckImperial": {
					"name": "peck",
					"plural": "pecks",
					"symbol": "pk",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 9.09218e-3
				},
				"peckUSDry": {
					"name": "peck",
					"plural": "pecks",
					"symbol": "pk",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 8.80976754172e-3
				},
				"perch": {
					"name": "perch",
					"plural": "perches",
					"symbol": "per",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 0.700841953152
				},
				"pinchImperial": {
					"name": "pinch",
					"plural": "pinches",
					"symbol": "pn",
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 739.9235026041666667e-9
				},
				"pinchUS": {
					"name": "pinch",
					"plural": "pinches",
					"symbol": "pn",
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking"],
					"multiplier": 616.11519921875e-9
				},
				"pintImperial": {
					"name": "pint",
					"plural": "pints",
					"symbol": "pt",
					"otherSymbols": ["pt (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 568.26125e-6
				},
				"pintUSDry": {
					"name": "pint",
					"plural": "pints",
					"symbol": "pt",
					"otherSymbols": ["pt (US dry)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "dry-only"],
					"multiplier": 550.6104713575e-6
				},
				"pintUSFluid": {
					"name": "pint",
					"plural": "pints",
					"symbol": "pt",
					"otherSymbols": ["pt (US fl)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 473.176473e-6
				},
				"pony": {
					"name": "pony",
					"plural": "ponies",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 22.180147171875e-6
				},
				"pottle": {
					"name": "pottle",
					"plural": "pottles",
					"otherNames": ["quartern", "quarterns"],
					"type": "customary",
					"systems": ["englishUnits"],
					"multiplier": 2.273045e-3
				},
				"quartImperial": {
					"name": "quart",
					"plural": "quart",
					"symbol": "qt",
					"otherSymbols": ["qt (imp)"],
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 1.1365225e-3
				},
				"quartUSDry": {
					"name": "quart",
					"plural": "quart",
					"symbol": "qt",
					"otherSymbols": ["qt (US dry)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "dry-only"],
					"multiplier": 1.101220942715e-3
				},
				"quartUSFluid": {
					"name": "quart",
					"plural": "quart",
					"symbol": "qt",
					"otherSymbols": ["qt (US fl)"],
					"type": "customary",
					"systems": ["usCustomary"],
					"tags": ["cooking", "fluid-only"],
					"multiplier": 946.352946e-6
				},
				"pail": {
					"name": "pail",
					"plural": "pails",
					"otherNames": ["quarter", "quarters", "kenning", "kennings"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.29094976
				},
				"registerTon": {
					"name": "register ton",
					"plural": "register tons",
					"otherNames": ["gross register tonnage"],
					"symbol": "GRT",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 2.8316846592
				},
				"sackImperial": {
					"name": "sack",
					"plural": "sacks",
					"otherNames": ["bag", "bags"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.10910616
				},
				"sackUS": {
					"name": "sack",
					"plural": "sacks",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.10571721050064
				},
				"seam": {
					"name": "seam",
					"plural": "seams",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.28191256133504
				},
				"shot": {
					"name": "shot",
					"plural": "shots",
					"otherNames": ["jigger", "jiggers", "measure", "measures"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 44e-6,
					"notes": "Shot sizes vary worldwide. In the US shot sizes are between 1.25-1.5 fl. oz. Utah legislates 1.5 fl. oz."
				},
				"strikeImperial": {
					"name": "strike",
					"plural": "strikes",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.07273744
				},
				"strikeUS": {
					"name": "strike",
					"plural": "strikes",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.07047814033376
				},
				"tablespoonAustralian": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["australia"],
					"tags": ["cooking"],
					"multiplier": 20e-6
				},
				"tablespoonCanadian": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["canada"],
					"tags": ["cooking"],
					"multiplier": 14.20653125e-6
				},
				"tablespoonImperial": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 17.7581640625e-6
				},
				"tablespoon": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["metric"],
					"excludedSystems": ["australia", "canada"],
					"tags": ["cooking"],
					"multiplier": 15e-6
				},
				"tablespoonUSCustomary": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 14.7867647825e-6
				},
				"tablespoonUSFoodNutritionLabeling": {
					"name": "tablespoon",
					"plural": "tablespoons",
					"symbol": "tbsp",
					"type": "customary",
					"systems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 1.5e-5
				},
				"teaspoonCanadian": {
					"name": "teaspoon",
					"plural": "teaspoons",
					"symbol": "tsp",
					"type": "customary",
					"systems": ["canada"],
					"tags": ["cooking"],
					"multiplier": 4.73551041666667e-6
				},
				"teaspoonImperial": {
					"name": "teaspoon",
					"plural": "teaspoons",
					"symbol": "tsp",
					"type": "customary",
					"systems": ["imperial"],
					"tags": ["cooking"],
					"multiplier": 5.919388020833333e-6
				},
				"teaspoon": {
					"name": "teaspoon",
					"plural": "teaspoons",
					"symbol": "tsp",
					"type": "customary",
					"systems": ["metric"],
					"excludedSystems": ["canada"],
					"tags": ["cooking"],
					"multiplier": 5.0e-6
				},
				"teaspoonUSCustomary": {
					"name": "teaspoon",
					"plural": "teaspoons",
					"symbol": "tsp",
					"type": "customary",
					"systems": ["usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 4.928921595e-6
				},
				"teaspoonUSFoodNutritionLabeling": {
					"name": "teaspoon",
					"plural": "teaspoons",
					"symbol": "tsp",
					"type": "customary",
					"systems": ["usFoodNutrition"],
					"tags": ["cooking"],
					"multiplier": 5.0e-6
				},
				"tonDisplacement": {
					"name": "ton displacement",
					"symbol": "ton (disp)",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 0.99108963072,
					"notes": "More details needed on systems"
				},
				"tonFreight": {
					"name": "ton of freight",
					"otherNames": ["ton"],
					"symbol": "ton",
					"otherSymbols": ["ton (freight)"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.13267386368,
					"notes": "More details needed on systems"
				},
				"tonWater": {
					"name": "ton of water",
					"otherNames": ["ton"],
					"symbol": "ton",
					"otherSymbols": ["ton (water)"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.01832416,
					"notes": "More details needed on systems"
				},
				"tun": {
					"name": "tun",
					"plural": "tuns",
					"symbol": "tu",
					"otherSymbols": ["US tu"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.953923769568,
					"notes": "Fluid only"
				},
				"wey": {
					"name": "wey",
					"plural": "weys",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 1.4095628066752
				},
				"ligula": {
					"name": "ligula",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 11.4e-6,
					"notes": "Liquid, Dry. 1/48 sextarius. Based on 1 pes = 0.296m"
				},
				"cyathus": {
					"name": "cyathus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 45e-6,
					"notes": "Liquid, Dry. 1/12 sextarius. Based on 1 pes = 0.296m"
				},
				"acetabulum": {
					"name": "acetabulum",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 68e-6,
					"notes": "Liquid, Dry. 1/8 sextarius. Based on 1 pes = 0.296m"
				},
				"quartarius": {
					"name": "quartarius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 136e-6,
					"notes": "Liquid, Dry. 1/4 sextarius. Based on 1 pes = 0.296m"
				},
				"hemina": {
					"name": "hemina",
					"otherNames": ["cotyla"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 273e-6,
					"notes": "Liquid, Dry. 1/2 sextarius. Based on 1 pes = 0.296m"
				},
				"sextarius": {
					"name": "sextarius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 546e-6,
					"notes": "Liquid, Dry. 1/6 congius. Based on 1 pes = 0.296m"
				},
				"congius": {
					"name": "congius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 3.27e-3,
					"tags": ["fluid-only"],
					"notes": "Liquid. 6 sextarii. Based on 1 pes = 0.296m"
				},
				"urna": {
					"name": "urna",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 13.1e-3,
					"tags": ["fluid-only"],
					"notes": "Liquid. 4 congii. Based on 1 pes = 0.296m"
				},
				"amphoraQuadrantal": {
					"name": "amphora quadrantal",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 26.2e-3,
					"tags": ["fluid-only"],
					"notes": "Liquid. 8 congii. One cubic pes. Standard amphora size. Based on 1 pes = 0.296m"
				},
				"culeus": {
					"name": "culeus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 524e-3,
					"tags": ["fluid-only"],
					"notes": "Liquid. 160 congii. Based on 1 pes = 0.296m"
				},
				"semimodius": {
					"name": "semimodius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 4.36e-3,
					"tags": ["dry-only"],
					"notes": "Dry. 8 sextarii. Based on 1 pes = 0.296m"
				},
				"modius": {
					"name": "modius",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 8.73e-3,
					"tags": ["dry-only"],
					"notes": "Dry. 16 sextarii. Alt: 8.62e-3. Based on 1 pes = 0.296m"
				},
				"modiusCastrensis": {
					"name": "modius castrensis",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 13.08e-3,
					"tags": ["dry-only"],
					"notes": "Dry. 24 sextarii. Alt: 12.93e-3. Based on 1 pes = 0.296m"
				},
				"planckVolume": {
					"name": "Planck volume",
					"symbol": "l³\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 4.2217e-105,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"area": {
			"name": "area",
			"symbol": "A",
			"baseUnit": "squareMetre",
			"derived": "length*length",
			"vector": false,
			"units": {
				"squareMetre": {
					"name": "square metre",
					"plural": "square metres",
					"otherNames": ["centiare", "square meter", "square meters", "metre squared", "metres squared", "meter squared", "meters squared"],
					"symbol": "m²",
					"otherSymbols": ["ca"],
					"type": "si",
					"systems": ["metric"]
				},
				"squareInch": {
					"name": "square inch",
					"plural": "square inches",
					"symbol": "in²",
					"otherSymbols": ["square in", "sq inches", "sq inch", "sq in", "sq.in"],
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 0.00064516
				},
				"squareFoot": {
					"name": "square foot",
					"plural": "square feet",
					"symbol": "ft²",
					"otherSymbols": ["sq ft", "sq.ft"],
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 0.09290304
				},
				"squareYard": {
					"name": "square yard",
					"plural": "square yards",
					"symbol": "yd²",
					"otherSymbols": ["yds²", "sq yd", "sq.yd"],
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 0.83612736
				},
				"squareMile": {
					"name": "square mile",
					"plural": "square miles",
					"symbol": "mi²",
					"otherSymbols": ["sq mi", "sq.mi"],
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 2589988.110336
				},
				"are": {
					"name": "are",
					"plural": "ares",
					"symbol": "a",
					"type": "si",
					"systems": ["legacyMetric"],
					"acceptedPrefixes": ["centi", "deci"],
					"multiplier": 100,
					"notes": "Not an si unit in it's own right."
				},
				"decare": {
					"name": "decare",
					"plural": "decares",
					"symbol": "daa",
					"type": "si",
					"systems": ["legacyMetric"],
					"multiplier": 1000
				},
				"hectare": {
					"name": "hectare",
					"plural": "hectares",
					"symbol": "ha",
					"type": "si",
					"systems": ["siCommon", "legacyMetric"],
					"multiplier": 10000,
					"notes": "Technically and are with hect prefix but is only version of are accepted within broader si context."
				},
				"acre": {
					"name": "acre",
					"plural": "acres",
					"symbol": "ac",
					"type": "customary",
					"systems": ["englishUnits", "imperial", "usCustomary"],
					"multiplier": 4046.8564224
				},
				"squareRod": {
					"name": "square rod",
					"plural": "square rods",
					"symbol": "sq rd",
					"otherNames": ["square perch", "square perches", "square pole", "square poles"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 25.29285264
				},
				"squarePerche": {
					"name": "square perche",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 42.21,
					"notes": "The french version of a square perch"
				},
				"rood": {
					"name": "rood",
					"plural": "roods",
					"otherNames": ["rod", "rods"],
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 1011.7141056
				},
				"stremma": {
					"name": "stremma",
					"type": "customary",
					"systems": ["ancient"],
					"multiplier": 1000,
					"notes": "Ancient Greek"
				},
				"barn": {
					"name": "barn",
					"symbol": "b",
					"type": "si",
					"systems": ["metric"],
					"multiplier": 1e-28
				},
				"pesQuadratus": {
					"name": "pes quadratus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 0.0876,
					"notes": "square foot - 1 pes^2. Based on 1 pes = 0.296m"
				},
				"scrupulum": {
					"name": "scrupulum",
					"otherNames": ["decempeda quadrata"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 8.76,
					"notes": "the square of the standard 10-foot measuring rod. Jugerum division. 100 pedes^2 - 1/288 jugerum. Based on 1 pes = 0.296m"
				},
				"actusSimplex": {
					"name": "actus simplex",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 42.1,
					"notes": "4 x 120 pedes = 480 pedes^2. Based on 1 pes = 0.296m"
				},
				"uncia": {
					"name": "uncia",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 210,
					"notes": "Jugerum division. 2400 pedes^2 - 1/12 jugerum. Based on 1 pes = 0.296m"
				},
				"clima": {
					"name": "clima",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 315,
					"notes": "60 x 60 pedes = 3600 pedes^2. Based on 1 pes = 0.296m"
				},
				"actusQuadratus": {
					"name": "actus quadratus",
					"otherNames": ["acnua", "arpennis", "semis"],
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1262,
					"notes": "Jugerum division. 14400 pedes^2 - 1/2 jugerum. Based on 1 pes = 0.296m"
				},
				"jugerum": {
					"name": "jugerum",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 2523,
					"notes": "28800 pedes^2 - 1 jugerum. Based on 1 pes = 0.296m"
				},
				"heredium": {
					"name": "heredium",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 5047,
					"notes": "2 jugerum. Based on 1 pes = 0.296m"
				},
				"centuria": {
					"name": "centuria",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 504700,
					"notes": "200 jugerum. Was 100 jugera. Based on 1 pes = 0.296m"
				},
				"saltus": {
					"name": "saltus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 2019000,
					"notes": "800 jugerum. Based on 1 pes = 0.296m"
				},
				"dimidiumScrupulum": {
					"name": "dimidium scrupulum",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 4.38,
					"notes": "Jugerum division. 50 pedes^2 - 1/576 jugerum. Based on 1 pes = 0.296m"
				},
				"duoScrupula": {
					"name": "duo scrupula",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 17.5,
					"notes": "Jugerum division. 200 pedes^2 - 1/144 jugerum. Based on 1 pes = 0.296m"
				},
				"sextula": {
					"name": "sextula",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 35,
					"notes": "Jugerum division. 400 pedes^2 - 1/72 jugerum. Based on 1 pes = 0.296m"
				},
				"sicilicus": {
					"name": "sicilicus",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 52.6,
					"notes": "Jugerum division. 600 pedes^2 - 1/48 jugerum. Based on 1 pes = 0.296m"
				},
				"semiuncia": {
					"name": "semiuncia",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 105,
					"notes": "Jugerum division. 1200 pedes^2 - 1/24 jugerum. Based on 1 pes = 0.296m"
				},
				"sextans": {
					"name": "sextans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 421,
					"notes": "Jugerum division. 4800 pedes^2 - 1/6 jugerum. Based on 1 pes = 0.296m"
				},
				"quadrans": {
					"name": "quadrans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 631,
					"notes": "Jugerum division. 7200 pedes^2 - 1/4 jugerum. Based on 1 pes = 0.296m"
				},
				"triens": {
					"name": "triens",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 841,
					"notes": "Jugerum division. 9600 pedes^2 - 1/3 jugerum. Based on 1 pes = 0.296m"
				},
				"quincunx": {
					"name": "quincunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1051,
					"notes": "Jugerum division. 12000 pedes^2 - 5/12 jugerum. Based on 1 pes = 0.296m"
				},
				"septunx": {
					"name": "septunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1472,
					"notes": "Jugerum division. 16800 pedes^2 - 7/12 jugerum. Based on 1 pes = 0.296m"
				},
				"bes": {
					"name": "bes",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1682,
					"notes": "Jugerum division. 19200 pedes^2 - 2/3 jugerum. Based on 1 pes = 0.296m"
				},
				"dodrans": {
					"name": "dodrans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 1893,
					"notes": "Jugerum division. 21600 pedes^2 - 3/4 jugerum. Based on 1 pes = 0.296m"
				},
				"dextans": {
					"name": "dextans",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 2103,
					"notes": "Jugerum division. 24000 pedes^2 - 5/6 jugerum. Based on 1 pes = 0.296m"
				},
				"deunx": {
					"name": "deunx",
					"type": "customary",
					"systems": ["ancientRoman"],
					"estimation": true,
					"multiplier": 2313,
					"notes": "Jugerum division. 26400 pedes^2 - 11/12 jugerum. Based on 1 pes = 0.296m"
				},
				"planckArea": {
					"name": "Planck area",
					"symbol": "l²\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 2.6121e-70,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"pressure": {
			"name": "pressure",
			"otherNames": ["energy density"],
			"symbol": "P",
			"baseUnit": "pascal",
			"derived": "mass/length/time/time",
			"vector": false,
			"units": {
				"pascal": {
					"name": "pascal",
					"plural": "pascals",
					"symbol": "Pa",
					"type": "si",
					"systems": ["si"],
					"notes": "Common prefixes: hecto-, kilo-, mega-, giga-"
				},
				"standardAtmosphere": {
					"name": "standard atmosphere",
					"plural": "standard atmospheres",
					"symbol": "atm",
					"type": "customary",
					"systems": ["metric"],
					"multiplier": 101325
				},
				"technicalAtmosphere": {
					"name": "technical atmosphere",
					"plural": "technical atmospheres",
					"symbol": "at",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 9.80665e4
				},
				"bar": {
					"name": "bar",
					"plural": "bars",
					"symbol": "bar",
					"type": "si",
					"systems": ["legacyMetric", "siCommon"],
					"multiplier": 1e5,
					"notes": "Accepted prefixes: mega-, kilo-, deci-, centi-, milli-"
				},
				"barye": {
					"name": "barye",
					"plural": "baryes",
					"otherNames": ["barad", "barrie", "bary", "baryd", "baryed", "barie"],
					"symbol": "Ba",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 0.1
				},
				"centimetreOfMercury": {
					"name": "centimetre of mercury",
					"plural": "centimetres of mercury",
					"symbol": "cmHg",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 1.33322e3
				},
				"centimetreOfWater": {
					"name": "centimetre of water",
					"plural": "centimetres of water",
					"symbol": "cmH₂O",
					"otherSymbols": ["cmH2O"],
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 98.0638,
					"notes": "At 4 °C"
				},
				"inchOfMercury": {
					"name": "inch of mercury",
					"plural": "inches of mercury",
					"symbol": "inHg",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3.386389e3
				},
				"inchOfWater": {
					"name": "inch of water",
					"plural": "inches of water",
					"symbol": "inH₂O",
					"otherSymbols": ["inH2O"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 249.082,
					"notes": "At 39.2 °F"
				},
				"footOfMercury": {
					"name": "foot of mercury",
					"plural": "feet of mercury",
					"symbol": "ftHg",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 40.63666e3
				},
				"footOfWater": {
					"name": "foot of water",
					"plural": "feet of water",
					"symbol": "ftH₂O",
					"otherSymbols": ["ftH2O"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 2.98898e3,
					"notes": "At 39.2 °F"
				},
				"kilogramForcePerSquareMillimetre": {
					"name": "kilogram force per square millimetre",
					"symbol": "kgf/mm²",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 9.80665e6
				},
				"kipPerSquareInch": {
					"name": "kip per square inch",
					"plural": "kips per square inch",
					"symbol": "ksi",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 6.894757e6
				},
				"micronOfMercury": {
					"name": "micron of mercury",
					"plural": "microns of mercury",
					"symbol": "µmHg",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 0.1333224
				},
				"millimetreOfMercury": {
					"name": "millimetre of mercury",
					"plural": "millimetres of mercury",
					"symbol": "mmHg",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 133.3224
				},
				"millimetreOfWater": {
					"name": "millimetre of water",
					"plural": "millimetres of water",
					"symbol": "mmH₂O",
					"otherSymbols": ["mmH2O"],
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 9.80638,
					"notes": "At 3.98 °C"
				},
				"pieze": {
					"name": "pièze",
					"plural": "pièzes",
					"otherNames": ["pieze", "piezes"],
					"symbol": "pz",
					"type": "customary",
					"systems": ["mts"],
					"multiplier": 1e3
				},
				"poundPerSquareFoot": {
					"name": "pound per square foot",
					"plural": "pounds per square foot",
					"symbol": "psf",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 47.88026
				},
				"poundPerSquareInch": {
					"name": "pound per square inch",
					"plural": "pounds per square inch",
					"otherNames": ["pound-force per square inch"],
					"symbol": "psi",
					"otherSymbols": ["lbf/in²", "lbf/sq in"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 6.894757e3
				},
				"kilopoundPerSquareInch": {
					"name": "kilopound per square inch",
					"plural": "kilopounds per square inch",
					"symbol": "ksi",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 6.894757e6
				},
				"poundalPerSquareFoot": {
					"name": "poundal per square foot",
					"plural": "poundals per square foot",
					"symbol": "pdl/sq ft",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 1.488164
				},
				"shortTonPerSquareFoot": {
					"name": "short ton per square foot",
					"plural": "short tons per square foot",
					"symbol": "sh tn/sq ft",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 95.760518e3
				},
				"torr": {
					"name": "torr",
					"symbol": "Torr",
					"otherSymbols": ["Tor"],
					"type": "si",
					"systems": ["legacyMetric"],
					"acceptedPrefixes": ["milli"],
					"multiplier": 133.3224,
					"notes": "Tor symbol common but incorrect"
				},
				"planckPressure": {
					"name": "Planck pressure",
					"otherNames": ["Planck energy density"],
					"symbol": "ρ\u209A",
					"otherSymbols": ["ρE\u209A", "P\u209A"],
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 4.63309e113,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"frequency": {
			"name": "frequency",
			"symbol": "f",
			"baseUnit": "hertz",
			"derived": "1/time",
			"vector": false,
			"units": {
				"hertz": {
					"name": "hertz",
					"otherNames": ["cycle per second", "cycles per second", "revolution per second", "revolutions per second"],
					"symbol": "Hz",
					"type": "si",
					"systems": ["metric", "imperial", "usCustomary"]
				},
				"revolutionPerMinute": {
					"name": "revolution per minute",
					"plural": "revolutions per minute",
					"otherNames": ["cycle per minute", "cycles per minute"],
					"symbol": "rpm",
					"otherSymbols": ["RPM", "rev/min", "r/min", "r·min⁻¹"],
					"type": "customary",
					"systems": ["legacyMetric", "imperial", "usCustomary"],
					"multiplier": 0.01666666666666667
				},
				"planckAngularFrequency": {
					"name": "Planck angular frequency",
					"symbol": "ω\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 1.85487e43,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"force": {
			"name": "force",
			"otherNames": [ "weight" ],
			"symbol": "F",
			"baseUnit": "newton",
			"derived": "mass*length/time/time",
			"vector": true,
			"units": {
				"newton": {
					"name": "newton",
					"plural": "newtons",
					"symbol": "N",
					"type": "si",
					"systems": ["si"]
				},
				"atomicUnitOfForce": {
					"name": "atomic unit of force",
					"symbol": "Eh/a0",
					"type": "customary",
					"systems": ["si"],
					"estimation": true,
					"multiplier": 8.23872206e-8
				},
				"dyne": {
					"name": "dyne",
					"symbol": "dyn",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-5
				},
				"kilogramForce": {
					"name": "kilogram force",
					"otherNames": ["kilopond", "grave-force"],
					"symbol": "kgf",
					"otherSymbols": ["kp", "Gf"],
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 9.80665
				},
				"kip": {
					"name": "kip",
					"otherNames": ["kip-force"],
					"symbol": "kip",
					"otherSymbols": ["kipf", "klbf"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 4.4482216152605e3
				},
				"milligraveForce": {
					"name": "milligrave force",
					"symbol": "mGf",
					"otherSymbols": ["gf"],
					"otherNames": ["gravet-force"],
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 9.80665e-3
				},
				"ounceForce": {
					"name": "ounce force",
					"symbol": "ozf",
					"type": "customary",
					"systems": ["englishEngineering", "britishGravitational"],
					"multiplier": 0.27801385095378125
				},
				"poundForce": {
					"name": "pound force",
					"otherNames": ["pound"],
					"symbol": "lbf",
					"otherSymbols": ["lb"],
					"type": "customary",
					"systems": ["englishEngineering", "britishGravitational"],
					"multiplier": 4.4482216152605
				},
				"poundal": {
					"name": "poundal",
					"symbol": "pdl",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 0.138254954376
				},
				"sthene": {
					"name": "sthène",
					"otherNames": ["sthene"],
					"symbol": "sn",
					"type": "customary",
					"systems": ["mts"],
					"multiplier": 1e3
				},
				"shortTonForce": {
					"name": "short ton-force",
					"plural": "short tons-force",
					"symbol": "tf",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 8.896443230521e3
				},
				"planckForce": {
					"name": "Planck force",
					"symbol": "F\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 1.21027e44,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"speed": {
			"name": "speed",
			"symbol": "v",
			"baseUnit": "metrePerSecond",
			"derived": "length/time",
			"vector": false,
			"units": {
				"metrePerSecond": {
					"name": "metre per second",
					"plural": "metres per second",
					"otherNames": ["meter per second", "meters per second"],
					"symbol": "m/s",
					"type": "customary",
					"systems": ["metric"],
					"notes": "This is of type customary NOT si because you can't actually apply prefixes to it"
				},
				"footPerHour": {
					"name": "foot per hour",
					"plural": "feet per hour",
					"symbol": "fph",
					"otherSymbols": ["ft/h"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 8.466667e-5
				},
				"footPerMinute": {
					"name": "foot per minute",
					"plural": "feet per minute",
					"symbol": "fpm",
					"otherSymbols": ["ft/min"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 5.08e-3
				},
				"footPerSecond": {
					"name": "foot per second",
					"plural": "feet per second",
					"symbol": "fps",
					"otherSymbols": ["ft/s"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 3.048e-1
				},
				"furlongPerFortnight": {
					"name": "furlong per fortnight",
					"symbol": "furlong/fortnight",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 1.663095e-4
				},
				"inchPerHour": {
					"name": "inch per hour",
					"plural": "inches per hour",
					"symbol": "iph",
					"otherSymbols": ["in/hr"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 7.05556e-6
				},
				"inchPerMinute": {
					"name": "inch per minute",
					"plural": "inches per minute",
					"symbol": "ipm",
					"otherSymbols": ["in/min"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 4.23333e-4
				},
				"inchPerSecond": {
					"name": "inch per second",
					"plural": "inches per second",
					"symbol": "ips",
					"otherSymbols": ["in/s"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 2.54e-2
				},
				"kilometrePerHour": {
					"name": "kilometre per hour",
					"plural": "kilometres per hour",
					"otherNames": ["kilometer per hour", "kilometers per hour"],
					"symbol": "km/h",
					"otherSymbols": ["kph"],
					"type": "customary",
					"systems": ["siCommon"],
					"multiplier": 2.777778e-1
				},
				"knot": {
					"name": "knot",
					"plural": "knots",
					"symbol": "kn",
					"otherSymbols": ["nmi/h", "kt", "NMPH"],
					"type": "customary",
					"systems": ["metric", "internationalNautical", "imperial", "usCustomary"],
					"multiplier": 0.514444
				},
				"knotAdmiralty": {
					"name": "knot",
					"plural": "knots",
					"symbol": "kn",
					"otherSymbols": ["NM (Adm)/h"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 0.514773333333,
					"notes": "More research needed on systems and origins"
				},
				"machNumber": {
					"name": "mach number",
					"otherNames": ["Sarrau number"],
					"symbol": "M",
					"otherSymbols": ["Ma", "Mach"],
					"symbolFirst": true,
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 340.3,
					"notes": "Based on standard sea level conditions and at 15 °C. Additionally should be written Mach 2.3 (unit name first)"
				},
				"milePerHour": {
					"name": "mile per hour",
					"plural": "miles per hour",
					"symbol": "mph",
					"otherSymbols": ["mi/h"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 0.44704
				},
				"milePerMinute": {
					"name": "mile per minute",
					"plural": "miles per minute",
					"symbol": "mpm",
					"otherSymbols": ["mi/min"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 26.8224
				},
				"milePerSecond": {
					"name": "mile per second",
					"plural": "miles per second",
					"symbol": "mps",
					"otherSymbols": ["mi/s"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1609.344
				},
				"speedOfLight": {
					"name": "speed of light",
					"symbol": "c",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 299792458,
					"notes": "Constant. In a vacuum"
				},
				"speedOfSound": {
					"name": "speed of sound",
					"symbol": "s",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 340.3,
					"notes": "Constant. Based on standard sea level conditions and at 15 °C."
				},
				"naturalVelocity": {
					"name": "unit of velocity",
					"plural": "units of velocity",
					"otherNames": ["unit of speed", "units of speed"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 299792458,
					"notes": "Unit does not have a symbol"
				}
			}
		},
		"velocity": {
			"name": "velocity",
			"symbol": "v",
			"baseUnit": "metrePerSecond",
			"derived": "length/time",
			"vector": true,
			"inheritedUnits": "speed",
			"units": {}
		},
		"acceleration": {
			"name": "acceleration",
			"symbol": "a",
			"baseUnit": "metrePerSquareSecond",
			"derived": "length/time/time",
			"vector": true,
			"units": {
				"metrePerSquareSecond": {
					"name": "metre per square second",
					"plural": "metres per square second",
					"otherNames": ["meter per square second", "meters per square second", "metre per second squared", "metres per second squared", "meter per second squared", "meters per second squared"],
					"symbol": "m/s²",
					"type": "customary",
					"systems": ["metric"]
				},
				"footPerHourPerSecond": {
					"name": "foot per hour per second",
					"plural": "feet per hour per second",
					"symbol": "fph/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 8.466667e-5
				},
				"footPerMinutePerSecond": {
					"name": "foot per minute per second",
					"plural": "feet per minute per second",
					"symbol": "fpm/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 5.08e-5
				},
				"footPerSquareSecond": {
					"name": "foot per square second",
					"plural": "feet per square second",
					"otherNames": ["foot per second squared", "feet per second squared"],
					"symbol": "fps²",
					"otherSymbols": ["ft/s²"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 0.304800
				},
				"gal": {
					"name": "gal",
					"otherNames": ["galileo"],
					"symbol": "Gal",
					"type": "si",
					"systems": ["legacyMetric"],
					"multiplier": 0.01
				},
				"inchPerMinutePerSecond": {
					"name": "inch per minute per second",
					"plural": "inches per minute per second",
					"symbol": "ipm/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 4.233333e-4
				},
				"inchPerSquareSecond": {
					"name": "inch per square second",
					"plural": "inches per square second",
					"otherNames": ["inch per second squared", "inches per second squared"],
					"symbol": "ips²",
					"otherSymbols": ["in/s²"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 2.54e-2
				},
				"knotPerSecond": {
					"name": "knot per second",
					"plural": "knots per second",
					"symbol": "kn/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 5.144444e-1
				},
				"milePerHourPerSecond": {
					"name": "mile per hour per second",
					"plural": "miles per hour per second",
					"symbol": "mph/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 4.4704e-1
				},
				"milePerMinutePerSecond": {
					"name": "mile per minute per second",
					"plural": "miles per minute per second",
					"symbol": "mpm/s",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 26.8224
				},
				"milePerSquareSecond": {
					"name": "mile per square second",
					"plural": "miles per square second",
					"otherNames": ["mile per second squared", "miles per second squared"],
					"symbol": "mps²",
					"otherSymbols": ["mi/s²"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 1.609344e3
				},
				"gravity": {
					"name": "gravity",
					"otherNames": ["standard gravity", "standard acceleration due to gravity"],
					"symbol": "g",
					"otherSymbols": ["g₀", "gn"],
					"type": "customary",
					"systems": ["metric"],
					"multiplier": 9.80665
				}
			}
		},
		"energy": {
			"name": "energy",
			"otherNames": [ "work", "heat" ],
			"symbol": "E",
			"baseUnit": "joule",
			"derived": "mass*length*length/time/time",
			"vector": false,
			"units": {
				"joule": {
					"name": "joule",
					"plural": "joules",
					"symbol": "J",
					"type": "si",
					"systems": ["si", "mks"]
				},
				"barrelOfOilEquivalent": {
					"name": "barrel of oil equivalent",
					"symbol": "BOE",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 6.12e9
				},
				"britishThermalUnit": {
					"name": "British thermal unit",
					"plural": "British thermal units",
					"symbol": "BTU",
					"otherSymbols": ["Btu"],
					"type": "customary",
					"systems": ["imperial", "usCustomary", "canada"],
					"multiplier": 1.05505585262e3,
					"notes": "Using International Steam Table (IT) calorie. Many other definitions of BTU exist."
				},
				"calorie": {
					"name": "calorie",
					"plural": "calories",
					"symbol": "cal",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"multiplier": 4.1868
				},
				"calorieUsFda": {
					"name": "calorie",
					"plural": "calories",
					"symbol": "Cal",
					"type": "customary",
					"systems": ["usFoodNutrition"],
					"multiplier": 4.184
				},
				"celsiusHeatUnit": {
					"name": "Celsius heat unit",
					"plural": "Celsius heat units",
					"symbol": "CHU",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.899100534716e3,
					"notes": "International Table"
				},
				"cubicFootOfNaturalGas": {
					"name": "cubic foot of natural gas",
					"plural": "cubic feet of natural gas",
					"symbol": "cc ft natural gas",
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 1.05505585262e6
				},
				"electronvolt": {
					"name": "electronvolt",
					"plural": "electronvolts",
					"otherNames": ["electron volt", "electron volts"],
					"symbol": "eV",
					"type": "si",
					"systems": ["si"],
					"multiplier": 1.60217733e-19,
					"notes": "Uncertainty: ± 4.9×10^−26 J"
				},
				"erg": {
					"name": "erg",
					"symbol": "erg",
					"type": "si",
					"systems": ["cgs"],
					"multiplier": 1e-7
				},
				"footPoundForce": {
					"name": "foot-pound force",
					"otherNames": ["foot-pound"],
					"symbol": "ft lbf",
					"otherSymbols": ["ft lb", "ft·lb", "ft·lbf"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 1.3558179483314004
				},
				"footPoundal": {
					"name": "Foot-poundal",
					"symbol": "ft pdl",
					"otherSymbols": ["ft-pdl"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 4.21401100938048e-2
				},
				"gallonAtmosphereImperial": {
					"name": "gallon atmosphere",
					"symbol": "imp gal atm",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 460.63256925
				},
				"gallonAtmosphereUS": {
					"name": "gallon atmosphere",
					"symbol": "US gal atm",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 383.5568490138
				},
				"hartree": {
					"name": "hartree",
					"otherNames": ["atomic unit of energy"],
					"symbol": "Eh",
					"type": "customary",
					"systems": ["si"],
					"multiplier": 4.359744e-18
				},
				"horsepowerHour": {
					"name": "horsepower hour",
					"symbol": "hp h",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 2.684519537696172792e6
				},
				"inchPoundForce": {
					"name": "inch-pound force",
					"otherNames": ["inch-pound"],
					"symbol": "in lbf",
					"otherSymbols": ["in lb", "in·lb", "in·lbf"],
					"type": "customary",
					"systems": ["usCustomary", "imperial"],
					"multiplier": 0.1129848290276167
				},
				"kilocalorie": {
					"name": "kilocalorie",
					"plural": "kilocalories",
					"otherNames": ["large calorie"],
					"symbol": "kcal",
					"otherSymbols": ["kCal", "Cal"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"excludedSystems": ["usFoodNutrition"],
					"multiplier": 4.1868e3
				},
				"kilowattHour": {
					"name": "kilowatt hour",
					"otherNames": ["kilowatt-hour", "Board of Trade Unit"],
					"symbol": "kWh",
					"otherSymbols": ["kw·h", "B.O.T.U.", "KWH", "kW h", "kW·h"],
					"type": "customary",
					"systems": ["imperial", "usCustomary", "legacyMetric"],
					"multiplier": 3.6e6,
					"notes": "This is a non-SI unit"
				},
				"quad": {
					"name": "quad",
					"plural": "quads",
					"type": "customary",
					"systems": ["imperial", "usCustomary", "canada"],
					"multiplier": 1.05505585262e18,
					"notes": "10^15 BTU"
				},
				"rydberg": {
					"name": "Rydberg unit of energy",
					"symbol": "Ry",
					"type": "customary",
					"systems": ["imperial", "usCustomary", "metric"],
					"multiplier": 2.179872e-18
				},
				"thermEC": {
					"name": "therm",
					"symbol": "thm",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 105.506000e6
				},
				"thermUS": {
					"name": "therm",
					"symbol": "thm",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 105.4804e6
				},
				"thermUK": {
					"name": "therm",
					"symbol": "thm",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 105.505585257348e6
				},
				"thermie": {
					"name": "thermie",
					"symbol": "th",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 4.1868e6
				},
				"tonOfCoalEquivalent": {
					"name": "ton of coal equivalent",
					"otherNames": ["tonne of coal equivalent"],
					"symbol": "TCE",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 29.288e9
				},
				"tonOfOilEquivalent": {
					"name": "ton of oil equivalent",
					"otherNames": ["tonne of oil equivalent"],
					"symbol": "TOE",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 41.84e9
				},
				"tonOfTNT": {
					"name": "ton of TNT",
					"otherNames": ["tonne of TNT"],
					"symbol": "tTNT",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 4.184e9
				},
				"planckEnergy": {
					"name": "Planck energy",
					"symbol": "E\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 1.9561e9,
					"notes": "Derived from fundamental planck units. Not exact."
				},
				"naturalEnergy": {
					"name": "electron volt of energy",
					"plural": "electron volts of energy",
					"symbol": "E",
					"otherSymbols": ["E", "eV", "eV of energy"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 1.6e-10,
					"uncertainty": 0.1e-10
				}
			}
		},
		"momentum": {
			"name": "momentum",
			"symbol": "p",
			"baseUnit": "kilogramMetrePerSecond",
			"derived": "mass*length/time",
			"vector": true,
			"units": {
				"kilogramMetrePerSecond": {
					"name": "kilogram metre per second",
					"plural": "kilogram metres per second",
					"otherNames": ["kilogram meter per second", "kilogram meters per second"],
					"symbol": "kg·m/s",
					"otherSymbols": ["kg m/s"],
					"type": "customary",
					"systems": ["si"]
				},
				"planckMomentum": {
					"name": "Planck momentum",
					"symbol": "m\u209Ac",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 6.52485,
					"notes": "Derived from fundamental planck units. Not exact."
				},
				"naturalMomentum": {
					"name": "electron volt of momentum",
					"plural": "electron volts of momentum",
					"symbol": "E",
					"otherSymbols": ["E", "eV", "eV of momentum"],
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 5.39e-19,
					"uncertainty": 0.01e-19
				}
			}
		},
		"power": {
			"name": "power",
			"symbol": "P",
			"baseUnit": "watt",
			"derived": "mass*length*length/time/time/time",
			"vector": false,
			"units": {
				"watt": {
					"name": "watt",
					"plural": "watts",
					"symbol": "W",
					"type": "si",
					"systems": ["si", "mks"]
				},
				"atmosphereCubicCentimetrePerMinute": {
					"name": "atmosphere cubic centimetre per minute",
					"plural": "atmosphere cubic centimetres per minute",
					"symbol": "atm ccm",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 1.68875e-3
				},
				"atmosphereCubicCentimetrePerSecond": {
					"name": "atmosphere cubic centimetre per second",
					"plural": "atmosphere cubic centimetres per second",
					"symbol": "atm ccs",
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 0.101325
				},
				"atmosphereCubicFootPerHour": {
					"name": "atmosphere cubic foot per hour",
					"plural": "atmosphere cubic feet per hour",
					"symbol": "atm cfh",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 0.797001244704
				},
				"atmosphereCubicFootPerMinute": {
					"name": "atmosphere cubic foot per minute",
					"plural": "atmosphere cubic feet per minute",
					"symbol": "atm cfm",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 47.82007468224
				},
				"atmosphereCubicFootPerSecond": {
					"name": "atmosphere cubic foot per second",
					"plural": "atmosphere cubic feet per second",
					"symbol": "atm cfs",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 2.8692044809344e3
				},
				"btuPerHour": {
					"name": "BTU per hour",
					"plural": "BTUs per hour",
					"symbol": "BTU/h",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 0.293071
				},
				"btuPerMinute": {
					"name": "BTU per minute",
					"plural": "BTUs per minute",
					"symbol": "BTU/min",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 17.584264
				},
				"btuPerSecond": {
					"name": "BTU per second",
					"plural": "BTUs per second",
					"symbol": "BTU/s",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 1.05505585262e3
				},
				"caloriePerSecond": {
					"name": "calorie per second",
					"plural": "calories per second",
					"symbol": "cal/s",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 4.1868
				},
				"ergPerSecond": {
					"name": "erg per second",
					"symbol": "erg/s",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1e-7
				},
				"footPoundForcePerHour": {
					"name": "foot-pound force per hour",
					"symbol": "ft lbf/h",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 3.766161e-4
				},
				"footPoundForcePerMinute": {
					"name": "foot-pound force per minute",
					"symbol": "ft lbf/min",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 2.259696580552334e-2
				},
				"footPoundForcePerSecond": {
					"name": "foot-pound force per second",
					"symbol": "ft lbf/s",
					"type": "customary",
					"systems": ["imperial", "englishUnits"],
					"multiplier": 1.3558179483314004
				},
				"horsepowerBoiler": {
					"name": "horsepower (boiler)",
					"otherNames": ["horsepower", "boiler horsepower"],
					"symbol": "bhp",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 9.810657e3
				},
				"horsepowerEuropeanElectrical": {
					"name": "horsepower",
					"symbol": "hp",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 736
				},
				"horsepowerImperialElectrical": {
					"name": "horsepower",
					"symbol": "hp",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 746
				},
				"horsepowerImperialMechanical": {
					"name": "horsepower",
					"symbol": "hp",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 745.69987158227022
				},
				"horsepower": {
					"name": "horsepower",
					"symbol": "hp",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 735.49875
				},
				"litreAtmospherePerMinute": {
					"name": "litre-atmosphere per minute",
					"symbol": "L·atm/min",
					"otherSymbols": ["L atm/min"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.68875
				},
				"litreAtmospherePerSecond": {
					"name": "litre-atmosphere per second",
					"symbol": "L·atm/s",
					"otherSymbols": ["L atm/s"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 101.325
				},
				"lusec": {
					"name": "lusec",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1.333e-4,
					"notes": "Metrology, French, Contraction of symbols L·μmHg/s"
				},
				"poncelet": {
					"name": "poncelet",
					"symbol": "p",
					"type": "customary",
					"systems": ["oldEuropean"],
					"multiplier": 980.665,
					"notes": "French. Now obsolete. Replaced by horsepower."
				},
				"squareFootEquivalentDirectRadiation": {
					"name": "square foot equivalent direct radiation",
					"symbol": "sq ft EDR",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 70.337057
				},
				"tonOfAirConditioning": {
					"name": "ton of air conditioning",
					"plural": "tons of air conditioning",
					"symbol": "ton aircon",
					"otherSymbols": ["ton"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3504
				},
				"tonOfRefrigerationImperial": {
					"name": "ton of refrigeration",
					"plural": "tons of air refrigeration",
					"symbol": "ton refrigeration",
					"otherSymbols": ["ton"],
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 3.938875e3
				},
				"tonOfRefrigeration": {
					"name": "ton of refrigeration",
					"plural": "tons of air refrigeration",
					"symbol": "ton refrigeration",
					"otherSymbols": ["ton"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3.516853e3
				},
				"planckPower": {
					"name": "Planck power",
					"symbol": "P\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 3.62831e52,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"intensity": {
			"name": "intensity",
			"symbol": "I",
			"baseUnit": "wattPerSquareMetre",
			"derived": "mass/time/time/time",
			"vector": true,
			"units": {
				"wattPerSquareMetre": {
					"name": "watt per square metre",
					"plural": "watts per square metre",
					"otherNames": ["watt per metre squared", "watts per metre squared", "watt per square meter", "watts per square meter", "watt per meter squared", "watts per meter squared", "kilogram per cubic second", "kilograms per cubic second", "kilogram per second cubed", "kilograms per second cubed"],
					"symbol": "W/m²",
					"otherSymbols": ["kg/s³"],
					"type": "customary",
					"systems": ["si"]
				},
				"planckIntensity": {
					"name": "Planck intensity",
					"symbol": "I\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 1.38893e122,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}

		},
		"electricCharge": {
			"name": "electric charge",
			"otherNames": [ "charge" ],
			"symbol": "Q",
			"otherSymbols": ["q"],
			"baseUnit": "coulomb",
			"derived": "electricCurrent/time",
			"vector": false,
			"units": {
				"coulomb": {
					"name": "coulomb",
					"plural": "coulombs",
					"symbol": "C",
					"type": "si",
					"systems": ["metric"]
				},
				"faraday": {
					"name": "faraday",
					"plural": "faradays",
					"symbol": "F",
					"type": "customary",
					"estimation": true,
					"systems": ["legacyMetric"],
					"multiplier": 96485.3383
				},
				"milliampereHour": {
					"name": "milliampere hour",
					"symbol": "mAh",
					"otherSymbols": ["mA·h", "mA.h"],
					"systems": ["legacyMetric"],
					"type": "customary",
					"multiplier": 3.6
				},
				"statcoulomb": {
					"name": "statcoulomb",
					"symbol": "statC",
					"otherSymbols": ["Fr", "esu"],
					"otherNames": ["franklin", "electrostaticUnit"],
					"type": "customary",
					"estimation": true,
					"systems": ["cgs"],
					"multiplier": 3.335641e-10
				},
				"abcoulomb": {
					"name": "abcoulomb",
					"symbol": "abC",
					"otherSymbols": ["emu"],
					"otherNames": ["electrostaticUnit"],
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 10
				},
				"atomicUnitOfCharge": {
					"name": "atomic unit of charge",
					"symbol": "au",
					"type": "customary",
					"systems": ["si"],
					"estimation": true,
					"multiplier": 1.602176462e-19
				},
				"planckCharge": {
					"name": "Planck charge",
					"symbol": "q\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 1.875545956e-18,
					"uncertainty": 0.000000041e-18
				},
				"naturalChargeGaussian": {
					"name": "unit of electric charge",
					"plural": "units of electric charge",
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 1.88e-18,
					"uncertainty": 0.01e-18,
					"notes": "Unit does not have a symbol"
				},
				"naturalChargeLorentzHeaviside": {
					"name": "unit of electric charge",
					"plural": "units of electric charge",
					"type": "customary",
					"systems": ["natural"],
					"multiplier": 5.29e-19,
					"uncertainty": 0.01e-19,
					"notes": "Unit does not have a symbol"
				}
			}
		},
		"electricDipoleMoment": {
			"name": "electric dipole moment",
			"otherNames": ["electric dipole"],
			"symbol": "p",
			"baseUnit": "coulombMetre",
			"derived": "electricCurrent*length/time",
			"vector": true,
			"units": {
				"coulombMetre": {
					"name": "coulomb metre",
					"plural": "coulomb metres",
					"otherNames": ["coulomb meter", "coulomb meters"],
					"symbol": "C·m",
					"otherSymbols": ["C·m", "Cm", "C m"],
					"type": "si",
					"systems": ["si"]
				},
				"debye": {
					"name": "debye",
					"symbol": "D",
					"type": "customary",
					"systems": ["siCommon", "cgs"],
					"multiplier": 3.33564095e-30,
					"notes": "Still used within SI as all SI prefixes are too large for certain applications."
				},
				"atomicUnitOfElectricDipoleMoment": {
					"name": "atomic unit of electic dipole moment",
					"symbol": "ea₀",
					"type": "customary",
					"systems": ["si"],
					"estimation": true,
					"multiplier": 8.47835281e-30
				}
			}
		},
		"electricPotential": {
			"name": "electric potential",
			"otherNames": [ "voltage", "electric field potential", "electrostatic potential", "electric potential tension"],
			"symbol": "φ",
			"otherSymbols": ["V", "U", "∆V", "∆U", "Δφ", "E"],
			"baseUnit": "volt",
			"derived": "mass*length*length/electricCurrent/time/time/time",
			"vector": false,
			"units": {
				"volt": {
					"name": "volt",
					"plural": "volts",
					"otherNames": ["joules per coulomb"],
					"symbol": "V",
					"type": "si",
					"systems": ["si", "mks"]
				},
				"statvolt": {
					"name": "statvolt",
					"plural": "statvolts",
					"symbol": "statV",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 299.792458
				},
				"abvolt": {
					"name": "abvolt",
					"plural": "abvolts",
					"symbol": "abV",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-8
				},
				"planckVoltage": {
					"name": "Planck voltage",
					"symbol": "V\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 1.04295e27,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"electricResistance": {
			"name": "electric resistance",
			"otherNames": [ "resistance", "impedance", "reactance" ],
			"symbol": "R",
			"otherSymbols": ["Z", "X"],
			"baseUnit": "ohm",
			"derived": "mass*length*length/time/time/time/electricCurrent/electricCurrent",
			"notes": "Impedance (Z) and Reactance (X) have the same units as resistance and in this context are considered equivalent",
			"vector": false,
			"units": {
				"ohm": {
					"name": "ohm",
					"plural": "ohms",
					"otherNames": ["legal ohm", "volt/ampere"],
					"symbol": "Ω",
					"otherSymbols": ["R"],
					"type": "si",
					"systems": ["si", "mks", "englishUnits"],
					"excludedPrefixes": ["mega", "micro", "giga"],
					"notes": "Naming quantities may be done in the form 5.6 Ω => 5R6 to avoid 'rubbing off' decimal place"
				},
				"megohm": {
					"name": "megohm",
					"plural": "megohms",
					"symbol": "MΩ",
					"otherNames": ["megaohm", "megaohms", "mega ohm", "mega ohms"],
					"type": "customary",
					"systems": ["si", "mks", "englishUnits"],
					"multiplier": 1e6,
					"notes": "Replaces the standard SI prefix mega- for ohms"
				},
				"microhm": {
					"name": "microhm",
					"plural": "microhms",
					"symbol": "μΩ",
					"otherNames": ["microohm", "microohms", "micro ohm", "micro ohms"],
					"type": "customary",
					"systems": ["si", "mks", "englishUnits"],
					"multiplier": 1e-6,
					"notes": "Replaces the standard SI prefix micro- for ohms"
				},
				"gigohm": {
					"name": "gigohm",
					"plural": "gigohms",
					"symbol": "GΩ",
					"otherNames": ["gigaohm", "gigaohms", "giga ohm", "giga ohms"],
					"type": "customary",
					"systems": ["si", "mks", "englishUnits"],
					"multiplier": 1e9,
					"notes": "Replaces the standard SI prefix giga- for ohms"
				},
				"reciprocalSiemens": {
					"name": "reciprocal Siemens",
					"symbol": "1/S",
					"otherNames": ["reciprocal mho"],
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 1
				},
				"quantizedHallResistance": {
					"name": "quantized Hall resistance",
					"symbol": "QHR",
					"type": "customary",
					"systems": ["nonStandard"],
					"multiplier": 3.874046143981e-5
				},
				"abohm": {
					"name": "abohm",
					"plural": "abohms",
					"symbol": "abΩ",
					"otherNames": ["EMU of resistance"],
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-9
				},
				"statohm": {
					"name": "statohm",
					"plural": "statohms",
					"symbol": "statΩ",
					"otherNames": ["ESU of resistance"],
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1.11265002973e-12
				},
				"planckImpedance": {
					"name": "Planck impedance",
					"symbol": "Z\u209A",
					"type": "customary",
					"systems": ["planck"],
					"multiplier": 29.9792458,
					"notes": "Derived from fundamental planck units. Reasonably exact as does not rely on Gravitational constant (G)."
				}
			}
		},
		"capacitance": {
			"name": "capacitance",
			"symbol": "C",
			"baseUnit": "farad",
			"derived": "time*time*time*time*electricCurrent*electricCurrent/length/length/mass",
			"vector": false,
			"units": {
				"farad": {
					"name": "farad",
					"plural": "farads",
					"symbol": "F",
					"type": "si",
					"systems": ["si", "mks"]
				},
				"abfarad": {
					"name": "abfarad",
					"plural": "abfarads",
					"symbol": "abF",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e9
				},
				"statfarad": {
					"name": "statfarad",
					"plural": "statfarads",
					"symbol": "statF",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1.112650056e-12
				}
			}
		},
		"inductance": {
			"name": "inductance",
			"symbol": "L",
			"otherSymbols": ["M"],
			"baseUnit": "henry",
			"derived": "mass*length*length/electricCurrent/electricCurrent/time/time",
			"vector": false,
			"units": {
				"henry": {
					"name": "henry",
					"plural": "henries",
					"symbol": "H",
					"type": "si",
					"systems": ["metric"]
				}
			}
		},
		"density": {
			"name": "density",
			"symbol": "ρ",
			"baseUnit": "kilogramPerCubicMetre",
			"derived": "mass/length/length/length",
			"vector": false,
			"units": {
				"kilogramPerCubicMetre": {
					"name": "kilogram per cubic metre",
					"plural": "kilograms per cubic metre",
					"otherNames": ["kilogram per cubic meter", "kilograms per cubic meter", "kilogram per metre cubed", "kilograms per metre cubed", "kilogram per meter cubed", "kilograms per meter cubed"],
					"symbol": "kg/m³",
					"type": "customary",
					"systems": ["si"]
				},
				"gramPerMillilitre": {
					"name": "gram per millilitre",
					"plural": "grams per millilitre",
					"symbol": "g/mL",
					"type": "customary",
					"systems": ["siCommon"],
					"multiplier": 1000
				},
				"kilogramPerLitre": {
					"name": "kilogram per litre",
					"plural": "kilograms per litre",
					"symbol": "kg/L",
					"type": "customary",
					"systems": ["siCommon"],
					"multiplier": 1000
				},
				"ouncePerCubicFoot": {
					"name": "ounce per cubic foot",
					"plural": "ounces per cubic foot",
					"otherNames": ["ounce per foot cubed", "ounces per foot cubed"],
					"symbol": "oz/ft³",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1.001153961
				},
				"ouncePerCubicInch": {
					"name": "ounce per cubic inch",
					"plural": "ounces per cubic inch",
					"otherNames": ["ounce per inch cubed", "ounces per inch cubed"],
					"symbol": "oz/in³",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1.729994044e3
				},
				"ouncePerGallonImperial": {
					"name": "ounce per gallon",
					"plural": "ounces per gallon",
					"symbol": "oz/gal",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 6.236023291
				},
				"ouncePerGallonUS": {
					"name": "ounce per gallon",
					"plural": "ounces per gallon",
					"symbol": "oz/gal",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 7.489151707
				},
				"poundPerCubicFoot": {
					"name": "pound per cubic foot",
					"plural": "pounds per cubic foot",
					"otherNames": ["pound per foot cubed", "pounds per foot cubed"],
					"symbol": "lb/ft³",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 16.01846337
				},
				"poundPerCubicInch": {
					"name": "pound per cubic inch",
					"plural": "pounds per cubic inch",
					"otherNames": ["pound per inch cubed", "pounds per inch cubed"],
					"symbol": "lb/in³",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 2.767990471e4
				},
				"poundPerGallonImperial": {
					"name": "pound per gallon",
					"plural": "pounds per gallon",
					"symbol": "lb/gal",
					"type": "customary",
					"systems": ["imperial"],
					"multiplier": 99.77637266
				},
				"poundPerGallonUS": {
					"name": "pound per gallon",
					"plural": "pounds per gallon",
					"symbol": "lb/gal",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 119.8264273
				},
				"slugPerCubicFoot": {
					"name": "slug per cubic foot",
					"plural": "slugs per cubic foot",
					"otherNames": ["slug per foot cubed", "slugs per foot cubed"],
					"symbol": "slug/ft³",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 515.3788184
				},
				"planckDensity": {
					"name": "Planck density",
					"symbol": "ρ\u209A",
					"type": "customary",
					"systems": ["planck"],
					"estimation": true,
					"multiplier": 5.15500e96,
					"notes": "Derived from fundamental planck units. Not exact."
				}
			}
		},
		"flowVolume": {
			"name": "flow volume",
			"otherNames": ["volumetric flow rate", "volume flow rate", "rate of fluid flow", "volume velocity"],
			"symbol": "Q",
			"baseUnit": "cubicMetrePerSecond",
			"derived": "length*length*length/time",
			"vector": false,
			"units": {
				"cubicMetrePerSecond": {
					"name": "cubic metre per second",
					"plural": "cubic metres per second",
					"otherNames": ["cubic meter per second", "cubic meters per second", "metre cubed per second", "metres cubed per second", "meter cubed per second", "meters cubed per second"],
					"symbol": "m³/s",
					"systems": ["si"],
					"type": "customary"
				},
				"cubicFootPerMinute": {
					"name": "cubic foot per minute",
					"plural": "cubic feet per minute",
					"otherNames": ["foot cubed per minute", "feet cubed per minute"],
					"symbol": "CFM",
					"otherSymbols": ["ft³/min"],
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 4.719474432e-4
				},
				"cubicFootPerSecond": {
					"name": "cubic foot per second",
					"plural": "cubic feet per second",
					"otherNames": ["foot cubed per second", "feet cubed per second"],
					"symbol": "ft³/s",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 0.028316846592
				},
				"cubicInchPerMinute": {
					"name": "cubic inch per minute",
					"plural": "cubic inches per minute",
					"otherNames": ["inch cubed per minute", "inches cubed per minute"],
					"symbol": "in³/min",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 2.73117733333333e-7
				},
				"cubicInchPerSecond": {
					"name": "cubic inch per second",
					"plural": "cubic inches per second",
					"otherNames": ["inch cubed per second", "inches cubed per second"],
					"symbol": "in³/s",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1.6387064e-5
				},
				"gallonPerDay": {
					"name": "gallon per day",
					"plural": "gallons per day",
					"symbol": "GPD",
					"otherSymbols": ["gal/day"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 4.3812636388889e-8,
					"notes": "Us Gallon"
				},
				"gallonPerHour": {
					"name": "gallon per hour",
					"plural": "gallons per hour",
					"symbol": "GPH",
					"otherSymbols": ["gal/h"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 1.05150327333333e-6,
					"notes": "Us Gallon"
				},
				"gallonPerMinute": {
					"name": "gallon per minute",
					"plural": "gallons per minute",
					"symbol": "GPM",
					"otherSymbols": ["gal/min"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 6.30901964e-5,
					"notes": "Us Gallon"
				},
				"litrePerMinute": {
					"name": "litre per minute",
					"plural": "litres per minute",
					"otherNames": ["liter per minute", "litres per minute"],
					"symbol": "LPM",
					"otherSymbols": ["L/min"],
					"type": "customary",
					"systems": ["legacyMetric"],
					"multiplier": 1.6666666666667e-5
				}
			}
		},
		"luminance": {
			"name": "luminance",
			"symbol": "Lᵥ",
			"baseUnit": "candelaPerSquareMetre",
			"derived": "luminousIntensity/length/length",
			"vector": true,
			"units": {
				"candelaPerSquareMetre":{
					"name": "candela per square metre",
					"plural": "candelas per square metre",
					"otherNames": ["nit", "nits", "candela per square meter", "candelas per square meter", "candela per metre squared", "candelas per metre squared", "candela per meter squared", "candelas per meter squared"],
					"symbol": "cd/m²",
					"type": "customary",
					"systems": ["si"]
				},
				"candelaPerSquareFoot": {
					"name": "candela per square foot",
					"plural": "candelas per square foot",
					"otherNames": ["candela per foot squared", "candelas per foot squared"],
					"symbol": "cd/ft²",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 10.763910417
				},
				"candelaPerSquareInch": {
					"name": "candela per square inch",
					"plural": "candelas per square inch",
					"otherNames": ["candela per inch squared", "candelas per inch squared"],
					"symbol": "cd/in²",
					"type": "customary",
					"systems": ["imperial", "usCustomary"],
					"multiplier": 1550.0031
				},
				"footlambert": {
					"name": "foot-lambert",
					"plural": "foot-lamberts",
					"otherNames": ["footlambert", "footlamberts"],
					"symbol": "fL",
					"otherSymbols": ["fl", "ft-L"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3.4262590996
				},
				"lambert": {
					"name": "lambert",
					"plural": "lamberts",
					"symbol": "L",
					"otherSymbols": ["la", "Lb"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 3183.0988618,
					"notes": "More information on systems needed"
				},
				"stilb": {
					"name": "stilb",
					"plural": "stilbs",
					"symbol": "sb",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e4
				}
			}
		},
		"luminousFlux": {
			"name": "luminous flux",
			"symbol": "Φᵥ",
			"baseUnit": "lumen",
			"otherNames": [ "luminousPower" ],
			"derived": "luminousIntensity*solidAngle",
			"vector": false,
			"units": {
				"lumen": {
					"name": "lumen",
					"plural": "lumens",
					"symbol": "lm",
					"type": "si",
					"systems": ["metric", "imperial", "usCustomary"]
				}
			}
		},
		"illuminance": {
			"name": "illuminance",
			"symbol": "Eᵥ",
			"baseUnit": "lux",
			"derived": "luminousIntensity*solidAngle/length/length",
			"vector": true,
			"units": {
				"lux": {
					"name": "lux",
					"symbol": "lx",
					"type": "si",
					"systems": ["si"]
				},
				"phot": {
					"name": "phot",
					"plural": "phots",
					"symbol": "ph",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e4
				},
				"lumenPerSquareInch": {
					"name": "lumen per square inch",
					"plural": "lumens per square inch",
					"otherNames": ["lumen per inch squared", "lumens per inch squared"],
					"symbol": "lm/in²",
					"estimation": true,
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 1550.0031
				},
				"footCandle": {
					"name": "foot-candle",
					"plural": "foot-candles",
					"otherNames": ["foot candle", "foot candles", "lumen per square foot"],
					"symbol": "fc",
					"otherSymbols": ["lm/ft²", "ft-c"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 10.763910417
				}
			}
		},
		"magneticFlux": {
			"name": "magnetic flux",
			"symbol": "Φ",
			"otherSymbols": ["ΦB", "ΦM", "Φb", "Φm"],
			"derived": "mass*length*length/electricCurrent/time/time",
			"baseUnit": "weber",
			"vector": false,
			"units": {
				"weber": {
					"name": "weber",
					"plural": "webers",
					"symbol": "Wb",
					"type": "si",
					"systems": ["si", "mts", "mks", "gravitational"]
				},
				"maxwell": {
					"name": "maxwell",
					"plural": "maxwells",
					"symbol": "Mx",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-8
				}
			}
		},
		"magneticFluxDensity": {
			"name": "magnetic flux density",
			"otherNames": ["magnetic field", "magnetic induction", "B-field", "magnetic B field"],
			"symbol": "B",
			"derived": "mass/electricCurrent/time/time",
			"baseUnit": "tesla",
			"vector": true,
			"units": {
				"tesla": {
					"name": "tesla",
					"plural": "teslas",
					"symbol": "T",
					"type": "si",
					"systems": ["si", "mts", "mks", "gravitational"]
				},
				"gauss": {
					"name": "gauss",
					"symbol": "G",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-4
				}
			}
		},
		"magneticFieldStrength": {
			"name": "magnetic field strength",
			"otherNames": ["magnetic field intensity", "magnetic field", "magnetizing field", "auxiliary magnetic field", "H-field", "magnetic H field"],
			"symbol": "H",
			"derived": "electricCurrent/length",
			"baseUnit": "amperePerMetre",
			"vector": true,
			"units": {
				"amperePerMetre": {
					"name": "ampere per metre",
					"plural": "amperes per metre",
					"otherNames": ["ampere per meter", "amperes per meter", "amp per metre", "amps per metre", "amp per meter", "amps per meter"],
					"symbol": "A/m",
					"type": "customary",
					"systems": ["si", "mts", "mks", "gravitational"]
				},
				"oersted": {
					"name": "œrsted",
					"plural": "œrsteds",
					"otherNames": ["oersted", "oersteds"],
					"symbol": "Oe",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 79.5774715
				}
			}
		},
		"kinematicViscosity": {
			"name": "kinematic viscosity",
			"symbol": "ν",
			"derived": "length*length/time",
			"baseUnit": "squareMetrePerSecond",
			"vector": false,
			"units": {
				"squareMetrePerSecond": {
					"name": "square metre per second",
					"plural": "square metres per second",
					"otherNames": ["square meter per second", "square meters per second", "metre squared per second", "metres squared per second", "meter squared per second", "meters squared per second"],
					"symbol": "m²/s",
					"type": "customary",
					"systems": ["si"]
				},
				"stokes": {
					"name": "stokes",
					"symbol": "St",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 1e-4
				},
				"squareFootPerSecond": {
					"name": "square foot per second",
					"plural": "square feet per second",
					"otherNames": ["foot squared per second", "feet squared per second"],
					"symbol": "ft²/s",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.09290304
				}
			}
		},
		"dynamicViscosity": {
			"name": "dynamic viscosity",
			"symbol": "μ",
			"derived": "mass/length/time",
			"baseUnit": "pascalSecond",
			"vector": false,
			"units": {
				"pascalSecond": {
					"name": "pascal-second",
					"plural": "pascal-seconds",
					"otherNames": ["pascal second", "pascal seconds"],
					"symbol": "Pa·s",
					"type": "customary",
					"systems": ["si"]
				},
				"poise": {
					"name": "poise",
					"symbol": "P",
					"type": "customary",
					"systems": ["cgs"],
					"multiplier": 0.1
				},
				"poundPerFootHour": {
					"name": "pound per foot hour",
					"plural": "pounds per foot hour",
					"symbol": "lb/(ft·h)",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 4.133789e-4
				},
				"poundPerFootSecond": {
					"name": "pound per foot second",
					"plural": "pounds per foot second",
					"symbol": "lb/(ft·s)",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 1.488164
				},
				"poundForceSecondPerSquareFoot": {
					"name": "pound-force second per square foot",
					"plural": "pound-force seconds per square foot",
					"symbol": "lbf·s/ft²",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 47.88026
				},
				"poundForceSecondPerSquareInch": {
					"name": "pound-force second per square inch",
					"plural": "pound-force seconds per square inch",
					"symbol": "lbf·s/in²",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 6894.757
				}
			}
		},
		"action": {
			"name": "action",
			"otherNames": ["angular momentum"],
			"symbol": "S",
			"derived": "mass*length*length/time",
			"baseUnit": "jouleSecond",
			"vector": true,
			"units": {
				"jouleSecond": {
					"name": "joule-second",
					"plural": "joule-seconds",
					"otherNames": ["joule second", "joule seconds"],
					"symbol": "J·s",
					"otherSymbols": ["J s"],
					"type": "customary",
					"systems": ["si"]
				},
				"atomicUnitOfAction": {
					"name": "atomic unit of action",
					"otherNames": ["reduced Planck constant"],
					"symbol": "au",
					"otherSymbols": ["ħ"],
					"type": "customary",
					"systems": ["si"],
					"multiplier": 1.05457172647e-34,
					"notes": "ħ = h/2π"
				},
				"planckConstant": {
					"name": "Planck constant",
					"otherNames": ["Planck's constant"],
					"symbol": "h",
					"type": "si",
					"systems": ["si"],
					"multiplier": 6.6260695729e-34
				}
			}
		},
		"torque": {
			"name": "torque",
			"otherNames": ["moment", "moment of force"],
			"symbol": "τ",
			"otherSymbols": ["M"],
			"derived": "mass*length*length/time/time",
			"baseUnit": "newtonMetre",
			"vector": true,
			"units": {
				"newtonMetre": {
					"name": "newton metre",
					"plural": "newton metres",
					"otherNames": ["newton-metre", "newton-metres", "newton meter", "newton meters"],
					"symbol": "N·m",
					"otherSymbols": ["N m"],
					"type": "customary",
					"systems": ["si"]
				},
				"footPoundForce": {
					"name": "foot-pound force",
					"otherNames": ["foot-pound"],
					"symbol": "ft lbf",
					"otherSymbols": ["ft·lbf", "ft·lb"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 1.3558179483314004
				},
				"footPoundal": {
					"name": "foot-poundal",
					"symbol": "ft pdl",
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 4.21401100938048e-2
				},
				"inchPoundForce": {
					"name": "inch-pound force",
					"otherNames": ["inch-pound"],
					"symbol": "in lbf",
					"otherSymbols": ["in·lbf", "in·lb"],
					"type": "customary",
					"systems": ["usCustomary"],
					"multiplier": 0.1129848290276167
				},
				"metreKilogram": {
					"name": "metre-kilogram",
					"symbol": "m·kg",
					"otherSymbols": ["m kg", "mkg"],
					"type": "customary",
					"systems": ["mks"],
					"multiplier": 0.101971621
				}
			}
		},
		"information": {
			"name": "information",
			"otherNames": [ "data" ],
			"symbol": "i",
			"baseUnit": "bit",
			"vector": false,
			"units": {
				"bit": {
					"name": "bit",
					"plural": "bits",
					"otherNames": ["shannon"],
					"symbol": "b",
					"otherSymbols": ["Sh"],
					"type": "binary",
					"systems": ["nonStandard"]
				},
				"byte": {
					"name": "byte",
					"plural": "bytes",
					"symbol": "B",
					"type": "binary",
					"systems": ["nonStandard"],
					"multiplier": 8
				}
			}
		}
	},
	"prefixes": {
		"yotta": {
			"symbol": "Y",
			"type": "si",
			"multiplier": 1e24
		},
		"zetta": {
			"symbol": "Z",
			"type": "si",
			"multiplier": 1e21
		},
		"exa": {
			"symbol": "E",
			"type": "si",
			"multiplier": 1e18
		},
		"peta": {
			"symbol": "P",
			"type": "si",
			"multiplier": 1e15
		},
		"tera": {
			"symbol": "T",
			"type": "si",
			"multiplier": 1e12
		},
		"giga": {
			"symbol": "G",
			"type": "si",
			"multiplier": 1e9
		},
		"mega": {
			"symbol": "M",
			"type": "si",
			"multiplier": 1e6
		},
		"kilo": {
			"symbol": "k",
			"type": "si",
			"multiplier": 1e3
		},
		"hecto": {
			"symbol": "h",
			"type": "si",
			"multiplier": 100,
			"rare": true
		},
		"deca": {
			"symbol": "da",
			"type": "si",
			"multiplier": 10,
			"rare": true
		},
		"deci": {
			"symbol": "d",
			"type": "si",
			"multiplier": 0.1,
			"rare": true
		},
		"centi": {
			"symbol": "c",
			"type": "si",
			"multiplier": 0.01,
			"rare": true,
			"notes": "Is rare for systems other than length"
		},
		"milli": {
			"symbol": "m",
			"type": "si",
			"multiplier": 1e-3
		},
		"micro": {
			"symbol": "µ",
			"type": "si",
			"multiplier": 1e-6
		},
		"nano": {
			"symbol": "n",
			"type": "si",
			"multiplier": 1e-9
		},
		"pico": {
			"symbol": "p",
			"type": "si",
			"multiplier": 1e-12
		},
		"femto": {
			"symbol": "f",
			"type": "si",
			"multiplier": 1e-15
		},
		"atto": {
			"symbol": "a",
			"type": "si",
			"multiplier": 1e-18
		},
		"zepto": {
			"symbol": "z",
			"type": "si",
			"multiplier": 1e-21
		},
		"yocto": {
			"symbol": "y",
			"type": "si",
			"multiplier": 1e-24
		},
		"yobi": {
			"symbol": "Yi",
			"type": "siBinary",
			"base": 2,
			"power": 80
		},
		"zebi": {
			"symbol": "Zi",
			"type": "siBinary",
			"base": 2,
			"power": 70
		},
		"exbi": {
			"symbol": "Ei",
			"type": "siBinary",
			"base": 2,
			"power": 60
		},
		"pebi": {
			"symbol": "Pi",
			"type": "siBinary",
			"base": 2,
			"power": 50
		},
		"tebi": {
			"symbol": "Ti",
			"type": "siBinary",
			"base": 2,
			"power": 40
		},
		"gibi": {
			"symbol": "Gi",
			"type": "siBinary",
			"base": 2,
			"power": 30
		},
		"mebi": {
			"symbol": "Mi",
			"type": "siBinary",
			"base": 2,
			"power": 20
		},
		"kibi": {
			"symbol": "Ki",
			"type": "siBinary",
			"base": 2,
			"power": 10
		},
		"hella": {
			"symbol": "H",
			"type": "siUnofficial",
			"multiplier": 1e27
		},
		"bronto": {
			"symbol": "B",
			"type": "siUnofficial",
			"multiplier": 1e27,
			"rare": true
		}
	}
}

},{}],11:[function(require,module,exports){
/*jslint node: true */
'use strict';

var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js');

// TODO
	// Add the following functions:
	//  - toBaseDimensionDefinitions
	//  - matchDimensions
	// And populate findPrefix

var Dimension = (function () {

	var DEFAULT_POWER = 1;

	// Constructors
	
	function DimensionImpl(paramA, paramB, paramC, paramD) {
		if (helpers.isString(paramA) && helpers.isString(paramB)) {
			constructWithUnitNameAndDimensionName(this, paramA, paramB, paramC, paramD);
		} else if (helpers.isString(paramA)) {
			constructWithUnitName(this, paramA, paramB, paramC)
		} else if (paramA.class && paramA.class() == 'Unit') {
			constructWithUnit(this, paramA, paramB, paramC);
		} else {
			throw new Error('Invalid parameters provided');
		}
	}

	function constructWithUnit(dim, unit, power, prefix) {
		// Unit
		if (!unit) {
			throw new Error('Dimension requires a valid unit');
		}
		dim.unit = unit;

		// Power
		if (!power && power !== 0) {
			power = DEFAULT_POWER;
		}
		dim.power = power;

		// Prefix
		dim.prefix = null;
		if (prefix) {
			if (helpers.isString(prefix)) {
				dim.prefix = measurement.findPrefix(prefix);
			} else if (prefix.class() == 'Prefix') {
				dim.prefix = prefix;
			} else {
				throw new Error('Invalid type of prefix supplied');
			}
		}
	}

	// Helper Constructors

	function constructWithUnitName(dim, unitName, power, prefix) {
		// Allows d('metre', -1, 'kilo');
		var unit = measurement.findUnit(unitName);
		constructWithUnit(dim, unit, power, prefix);
	}

	function constructWithUnitNameAndDimensionName(dim, unitName, dimName, power, prefix) {
		var foundPrefix = measurement.findPrefix(dimName);
		if (foundPrefix) {
			// Allows d('metre', 'kilo'); or d('amp', 'milli', -1);
			constructWithUnitName(dim, unitName, power, foundPrefix);
		} else {
			// Allows d('metre', 'length', 1, 'kilo')
			var unit = measurement.findUnit(unitName, dimName);
			constructWithUnit(dim, unit, power, prefix);
		}
	}

	// Type Checking

	DimensionImpl.prototype.class = function () {
		return 'Dimension';
	}

	function isDimension (value) {
		return (value.class && helpers.isFunction(value.class) && value.class() == 'Dimension');
	}

	// Conversion

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convert = function (value, unit, prefix) {
		var dimValuePair = this.convertToBase();
		return dimValuePair.dimension.convertFromBase(dimValuePair.value, unit, prefix);
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertToBase = function (value) {
		var baseUnit;

		if (this.unit.isBaseUnit() && !this.prefix) {
			return {
				dimension: this.clone(),
				value: value
			};
		}
		baseUnit = this.unit.dimension.baseUnit;
		if (!baseUnit) {
			throw new Error('Base unit could not be found!');
		}
		return {
			value: doConvert(value, this.unit, this.prefix, this.power, true),
			dimension: new Dimension(baseUnit, this.power)
		};
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertFromBase = function (value, unit, prefix) {
		if (!unit) {
			throw new Error('A unit to convert into must be provided');
		}
		if (!this.unit.isBaseUnit()) {
			throw new Error('Existing unit is not base unit');
		}
		if (this.prefix) {
			throw new Error('A dimension as a base may not have a prefix');
		}

		return {
			value: (unit.isBaseUnit()) ? value : doConvert(value, unit, prefix, this.power, false),
			dimension: new Dimension(unit, this.power, prefix)
		};
	};

	function doConvert(value, unit, prefix, power, toBase) {
		var pow, calculatedValue;

		calculatedValue = value;
		for (pow = 0; pow < Math.abs(power); pow++) {
			if (prefix != null) {
				calculatedValue = toBase ? prefix.remove(calculatedValue) : prefix.apply(calculatedValue);
			}
			if (toBase ? (power > 0) : (power < 0)) {
				calculatedValue = (calculatedValue * unit.multiplier) + unit.offset; // TODO dimensionality with offsets may not work with compound dimensions.
			} else {
				calculatedValue = (calculatedValue - unit.offset) / unit.multiplier; // TODO dimensionality with offsets may not work with compound dimensions.
			}
		}
		return calculatedValue;
	}

	// General Operations

	DimensionImpl.prototype.isCommensurableMatch = function (dimension) {
		if (!isDimension(dimension)) {
			throw new Error('Provided parameter must be a Dimension');
		}
		return this.unit.dimension.key === dimension.unit.dimension.key &&
			this.power === dimension.power;
	};

	DimensionImpl.prototype.combine = function (value, otherDimension) {
		var dimValuePair, aggregatePower, computedValue;

		if (!isDimension(otherDimension)) {
			throw new Error ('The other dimension must be a dimension');
		}
		if (this.unit.dimension.key !== otherDimension.unit.dimension.key) {
			throw new Error('Dimensions must have the same system to combine');
		}

		// Do conversion if necessary
		if (this.unit.key !== otherDimension.unit.key) {
			dimValuePair = otherDimension.convert(value, this.unit, this.prefix);
			computedValue = dimValuePair.value;
			aggregatePower = this.power + dimValuePair.dimension.power;
		} else {
			computedValue = value;
			aggregatePower = this.power + otherDimension.power;
		}

		return {
			value: computedValue,
			dimension: new Dimension(this.unit, aggregatePower)
		};
	};

	// Prefixes

	DimensionImpl.prototype.canApplyPrefix = function () {
		return (unit.type == 'binary' || unit.type == 'si');
	};

	DimensionImpl.prototype.applyPrefix = function (value) {
		var dim, prefix, computedValue;

		dim = this.clone();
		if (dim.prefix) {
			dimValuePair = dim.removePrefix(value);
			dim = dimValuePair.dimension;
			computedValue = dimValuePair.value;
		} else {
			computedValue = value;
		}

		prefix = dim.findPrefix(value);
		if (prefix) {
			dim.prefix = prefix;
			computedValue = prefix.apply(computedValue);
		}
		return {
			value: computedValue,
			dimension: dim
		};
	};

	DimensionImpl.prototype.findPrefix = function (value) {
		// TODO
	}

	DimensionImpl.prototype.removePrefix = function (value) {
		var dim, computedValue;

		dim = this.clone();
		if (dim.prefix) {
			computedValue = dim.prefix.remove(value);
			dim.prefix = null;
		}
		return {
			value: computedValue,
			dimension: dim
		};
	}

	// Helper Functions

	DimensionImpl.prototype.clone = function () {
		return new Dimension(this.unit, this.power, this.prefix);
	};

	DimensionImpl.prototype.invert = function () {
		return new Dimension(this.unit, -this.power, this.prefix);
	};

	DimensionImpl.prototype.serialised = function () {
		var obj = {
			unitName: this.unit.key,
			dimensionName: this.unit.dimension.key,
			power: this.power
		};
		if (this.prefix) {
			obj.prefix = this.prefix.key;
		}
	};

	DimensionImpl.prototype.toJson = function () {
		return JSON.stringify(this.serialised());
	};

	DimensionImpl.prototype.format = function (config, isPlural) {
		var name, dimensionString;

		if (config.textualDescription) {
			var dimParts = [];
			if (this.power < 0) {
				dimParts.push('per'); // TODO - i18n
			}
			name = pluralizedName(this.unit, isPlural);
			if (this.prefix) {
				name = prefix.key + name;
			}
			dimParts.push(name);
			var absPower = Math.abs(this.power);
			if (absPower === 2) {
				dimParts.push('squared'); // TODO - i18n
			} else if (absPower === 3) {
				dimParts.push('cubed'); // TODO - i18n
			} else if (absPower > 3) {
				dimParts.push('to the power of ' + absPower); // TODO - i18n
			}
			dimensionString = dimParts.join(' ');
		} else {
			if (this.prefix) {
				dimensionString += this.prefix.symbol;
			}
			dimensionString = (this.unit.symbol) ? this.unit.symbol : pluralizedName(this.unit, isPlural);
			if (config.showAllPowers || this.power !== DEFAULT_POWER) {
				var powerStr = (config.asciiOnly) ? '^' + this.power : helpers.toSuperScript(this.power);
				dimensionString += powerStr;
			}
		}
		return dimensionString;
	};

	function pluralizedName(unit, isPlural) {
		return (isPlural && unit.plural && unit.plural.length > 0) ? unit.plural : unit.name;
	}

	return DimensionImpl;
}());

module.exports = Dimension;

},{"../lib/helpers.js":16,"../lib/measurement.js":17}],12:[function(require,module,exports){
/*jslint node: true */
'use strict';

var Unit = require('../entities/unit.js'),
	helpers = require('../../lib/helpers.js'),
	measurement = require('../../lib/measurement.js');

var DimensionDefinition = (function () {
	function DimensionDefinitionImpl(key, config, units) {
		validate(key, config);
		var self = this;
		this.key = key;
		this.name = config.name;
		this.symbol = config.symbol;
		this.otherNames = config.otherNames || [];
		this.otherSymbols = config.otherSymbols || [];
		this.baseUnitName = config.baseUnit;
		this.derivedString = config.derived;
		this.vector = config.vector;
		this.dimensionless = config.dimensionless;
		this.inheritedUnits = config.inheritedUnits;
		if (units) {
			this.units = units;
		} else {
			this.units = {};
			helpers.forEach(config.units, function (unitConfig, key) {
				self.units[key] = new Unit(key, unitConfig, self);
			});
		}
		this.baseUnit = this.units[config.baseUnit];
		this.derived = [];
		this._config = config;
		this.updateDerived();
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('dimension key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('dimension config must be an object');
		}
	}

	DimensionDefinitionImpl.prototype.class = function () {
		return 'DimensionDefinition';
	}

	DimensionDefinitionImpl.prototype.isDerived = function () {
		return (this.derived.length > 0);
	}

	DimensionDefinitionImpl.prototype.updateDerived = function() {
		var self = this;
		this.derived = [];
		if (!this.derivedString || this.derivedString.length == 0) {
			return;
		}
		var matches = this.derivedString.match(/(^\w+|([\*|/])(\w+))/g);
		helpers.forEach(matches, function (match, index) {
			var type = '*';
			var dimName = match;
			if (index > 0) {
				type = match.substring(0, 1);
				dimName = match.substring(1);
			}
			if (dimName !== '1') { // '1' is a placeholder
				var baseUnit = measurement.findBaseUnit(dimName);
				if (!baseUnit) {
					throw new Error('Base unit for dimension \'' + dimName + '\' could not be found');
				}
				if (type !== '*' && type !== '/') {
					throw new Error('Unknown type \'' + type + '\' found');
				}
				var power = (type === '*') ? 1 : -1;
				self.derived.push(new measurement.Dimension(baseUnit, power));
			}
		});
		// TODO - Simplify result!!!
	}

	// FIND

	DimensionDefinitionImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, helpers.isArrayMatch, value, ignoreCase);
	}

	DimensionDefinitionImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, helpers.isArrayPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(dimDef, func, listFunc, value, ignoreCase) {
		return func(dimDef.key, value, ignoreCase)
			|| func(dimDef.name, value, ignoreCase)
			|| func(dimDef.symbol, value, ignoreCase)
			|| listFunc(dimDef.otherNames, value, ignoreCase)
			|| listFunc(dimDef.otherSymbols, value, ignoreCase);
	}

	DimensionDefinitionImpl.prototype.clone = function () {
		return new DimensionDefinition(this.key, this._config, this.units);
	}

	return DimensionDefinitionImpl;
}());

module.exports = DimensionDefinition;

},{"../../lib/helpers.js":16,"../../lib/measurement.js":17,"../entities/unit.js":15}],13:[function(require,module,exports){
/*jslint node: true */
'use strict';

var helpers = require('../../lib/helpers.js');

var MeasurementSystem = (function () {
	function MeasurementSystemImpl(key, config) {
		validate(key, config);
		this.key = key;
		this.name = config.name;
		this.historical = config.historical;
		this.inherits = config.inherits;
		this.parent = null;
		this.children = {};
		this.units = {}; // TODO
		this._config = config;
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('measurement system key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('measurement system config must be an object');
		}
	}

	MeasurementSystemImpl.prototype.class = function () {
		return 'MeasurementSystem';
	}

	// TREE FUNCTIONS

	MeasurementSystemImpl.prototype.isRoot = function () {
		return !this.parent;
	}

	MeasurementSystemImpl.prototype.ancestors = function () {
		var ancestors = [this];
		if (!this.isRoot()) {
			ancestors = ancestors.concat(this.parent.ancestors());
		}
		return ancestors;
	}

	// FIND

	MeasurementSystemImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, value, ignoreCase);
	}

	MeasurementSystemImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(system, func, value, ignoreCase) {
		return func(system.key, value, ignoreCase)
			|| func(system.name, value, ignoreCase);
	}

	// CLONE

	MeasurementSystemImpl.prototype.clone = function () {
		return new MeasurementSystem(this.key, this._config);
	}

	return MeasurementSystemImpl;
}());

module.exports = MeasurementSystem;


},{"../../lib/helpers.js":16}],14:[function(require,module,exports){
/*jslint node: true */
'use strict';

var helpers = require('../../lib/helpers.js');

var Prefix = (function () {
	function PrefixImpl(key, config) {
		validate(key, config);
		this.key = key;
		this.symbol = config.symbol;
		this.type = config.type;
		this.rare = config.rare;
		this.multiplier = config.multiplier;
		this.power = config.power;
		this.base = config.base;
		this._config = config;
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('prefix key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('prefix config must be an object');
		}
	}

	PrefixImpl.prototype.class = function () {
		return 'Prefix';
	}

	PrefixImpl.prototype.apply = function (value) {
		if (this.power && this.base) {
			return value/Math.pow(this.base, this.power);
		}
		if (this.multiplier) {
			return value/this.multiplier;
		}
		return value;
	}

	PrefixImpl.prototype.remove = function (value) {
		if (this.power && this.base) {
			return value * Math.pow(this.base, this.power);
		}
		if (this.multiplier) {
			return value * this.multiplier;
		}
		return value;
	}

	// FIND

	PrefixImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, value, ignoreCase);
	}

	PrefixImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(system, func, value, ignoreCase) {
		return func(system.key, value, ignoreCase)
			|| func(system.symbol, value, ignoreCase);
	}

	// CLONE

	PrefixImpl.prototype.clone = function () {
		return new Prefix(this.key, this._config);
	}

	return PrefixImpl;
}());

module.exports = Prefix;
},{"../../lib/helpers.js":16}],15:[function(require,module,exports){
/*jslint node: true */
'use strict';

var helpers = require('../../lib/helpers.js'),
	measurement = require('../../lib/measurement.js');

var Unit = (function () {
	function UnitImpl(key, config, dimension) {
		validate(key, config, dimension);
		this.key = key;
		this.name = config.name;
		this.plural = config.plural;
		this.type = config.type;
		this.symbol = config.symbol;
		this.multiplier = config.multiplier || 1;
		this.offset = config.offset || 0;
		this.rare = config.rare;
		this.estimation = config.estimation;
		this.prefixName = config.prefixName;
		this.prefixFreeName = config.prefixFreeName;
		this.otherNames = config.otherNames || [];
		this.otherSymbols = config.otherSymbols || [];
		this.systemNames = config.systems || [];
		this.dimension = dimension;
		this.systems = {};
		this._config = config;
	}

	function validate(key, config, dimension) {
		if (!key || !config || !dimension) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('unit key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('unit config must be an object');
		}
		if(dimension.class() != 'DimensionDefinition') {
			throw new Error('dimension must be a DimensionDefinition');
		}
	}

	UnitImpl.prototype.class = function () {
		return 'Unit';
	}

	UnitImpl.prototype.isBaseUnit = function () {
		return (this.dimension.baseUnit.key === this.key);
	}

	UnitImpl.prototype.updateMeasurementSystems = function (allSystems) {
		var self = this;
		helpers.forEach(this.systemNames, function (name) {
			self.systems[name] = allSystems[name];
		});
	}

	// FIND

	UnitImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, helpers.isArrayMatch, value, ignoreCase);
	}

	UnitImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, helpers.isArrayPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(unit, func, listFunc, value, ignoreCase) {
		return func(unit.key, value, ignoreCase)
			|| func(unit.name, value, ignoreCase)
			|| func(unit.plural, value, ignoreCase)
			|| func(unit.symbol, value, ignoreCase)
			|| listFunc(unit.otherNames, value, ignoreCase)
			|| listFunc(unit.otherSymbols, value, ignoreCase);
	}

	// CLONE

	UnitImpl.prototype.clone = function () {
		// Note: cloning a unit specifically does not add the new unit to the systems
		// and dimensions it is associated with.
		var unit = new Unit(this.key, this._config, this.dimension);
		unit.updateMeasurementSystems(measurement.allSystems);
		return unit;
	}

	return UnitImpl;
}());

module.exports = Unit;

},{"../../lib/helpers.js":16,"../../lib/measurement.js":17}],16:[function(require,module,exports){
/*jslint node: true */
'use strict';

// TODO - consider removing unused functions 
// and/or using lodash with method level imports e.g.
// var chunk = require('lodash/array/chunk'); // https://lodash.com/
var helpers = {
	isNode: function () {
		return (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
	},
	isAmd: function () {
		return (typeof define === 'function' && define.amd);
	},
	firstPropertyName: function (object) {
		var prop;
		for (prop in object) {
			if (object.hasOwnProperty(prop)) {
				return prop;
			}
		}
	},
	values: function (obj) {
		var values = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				values.push(obj[key]);
			}
		}
		return values;
	},
	flatten: function (array) {
		return array.reduce(function (a, b) {
			var arr = (helpers.isArray(a)) ? a : [a];
			if (helpers.isArray(b)) {
				return arr.concat(b);
			} else {
				arr.push(b);
				return arr;
			}
			
		});
	},
	unique: function (array) {
		var result = [];
		for (var i = 0; i < array.length; i++) {
			if (!helpers.contains(result, array[i])) {
				result.push(array[i]);
			}
		}
		return result;
	},
	forEach: function (object, fn) {
		var index, isArray;

		isArray = helpers.isArray(object);
		for (index in object) {
			if (object.hasOwnProperty(index)) {
				fn(object[index], isArray ? parseInt(index) : index, object);
			}
		}
	},
	isString: function (value) {
		return (typeof value === 'string');
	},
	isNumber: function (value) {
		return (typeof value === 'number');
	},
	isBoolean: function (value) {
		return (typeof value === 'boolean');
	},
	isArray: function (value) {
		return (Object.prototype.toString.call(value) === '[object Array]');
	},
	isObject: function (value) {
		return (typeof value === 'object') && !helpers.isArray(value);
	},
	isFunction: function (value) {
		return (typeof value === 'function');
	},
	toSuperScript: function (number) {
		var numberStr, i,
			result = '',
			supers = {
				0: '\u2070', 1: '\u00B9', 2: '\u00B2', 3: '\u00B3', 4: '\u2074',
				5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079', '-': '\u207B',
			};

		numberStr = number.toString();
		for (i = 0; i < numberStr.length; i++) {
			result += supers[numberStr[i]];
		}
		return result;
	},
	splice: function (str, index, insertedStr) {
		return str.slice(0, index) + insertedStr + str.slice(index);
	},
	contains: function (array, str) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === str) {
				return true;
			}
		}
		return false;
	},
	containsPartial: function (array, str) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].indexOf(str) >= 0) {
				return true;
			}
		}
		return false;
	},
	isMatch: function (value, search, ignoreCase) {
		value = value || '';
		search = search || '';
		if (ignoreCase) {
			value = value.toUpperCase();
			search = search.toUpperCase();
		}
		return (value === search);
	},
	isPartialMatch: function (value, search, ignoreCase) {
		value = value || '';
		search = search || '';
		if (ignoreCase) {
			value = value.toUpperCase();
			search = search.toUpperCase();
		}
		return (value.indexOf(search) >= 0);
	},
	isArrayMatch: function (array, search, ignoreCase) {
		array = array || [];
		search = search || '';
		if (ignoreCase) {
			array = array.map(function (a) {
				return a.toUpperCase();
			});
			search = search.toUpperCase();
		}
		return helpers.contains(array, search);
	},
	isArrayPartialMatch: function (array, search, ignoreCase) {
		array = array || [];
		search = search || '';
		if (ignoreCase) {
			array = array.map(function (a) {
				return a.toUpperCase();
			});
			search = search.toUpperCase();
		}
		return helpers.containsPartial(array, search);
	},
	simplifyDimensions: function (value, dimensions) {
		// TODO!!
		return helpers.simpleSimplify(value, dimensions);
	},
	simpleSimplify: function (value, dimensions) {
		var newDimensions = [],
			processedDimensions = [],
			computedValue = value;

		helpers.forEach(dimensions, function (dimension, index) {
			var newDimension, i, dimValuePair;

			if ((dimension.power === 0) || (processedDimensions.indexOf(index) >= 0)) {
				return;
			}
			newDimension = dimension.clone();
			for (i = index  + 1; i < dimensions.length; i++) {
				if (dimension.unit.dimension.key === dimensions[i].unit.dimension.key) {
					dimValuePair = newDimension.combine(computedValue, dimensions[i]);
					newDimension = dimValuePair.dimension;
					computedValue = dimValuePair.value;
					processedDimensions.push(i);
				}
			}
			if (newDimension.power !== 0) {
				newDimensions.push(newDimension);
			}
			processedDimensions.push(index);
		});
		return {
			value: computedValue,
			dimensions: newDimensions
		}
	}
};

module.exports = helpers;

},{}],17:[function(require,module,exports){
/*jslint node: true */
'use strict';

// MEASUREMENT OBJECT
// Shorthand creation of Quantity

var measurement;
module.exports = measurement = function (paramA, paramB) {
	return new measurement.Quantity(paramA, paramB);
};

// REQUIRES

// Note: measurement must exist and be exported before requires
// to avoid circular dependencies and general badness
var helpers = require('../lib/helpers.js'),
	systemsJson = require('../common/systems.json'),
	Quantity = require('../lib/quantity.js'),
	Dimension = require('../lib/dimension.js'),
	Options = require('../lib/options.js'),
	MeasurementSystem = require('../lib/entities/measurement_system.js'),
	DimensionDefinition = require('../lib/entities/dimension_definition.js'),
	Prefix = require('../lib/entities/prefix.js');

// EXPOSED CLASSES

measurement.Quantity = Quantity;
measurement.Q = Quantity; // Shorthand
measurement.Dimension = Dimension;
measurement.D = Dimension; // Shorthand

// PROPERTIES

measurement.allSystems = {};
measurement.rootSystems = {};
measurement.dimensions = {};
measurement.prefixes = {};
measurement.allUnits = [];

// OPTIONS

measurement.resetToDefaultOptions = function() {
	measurement.options = new Options();
}

measurement.options = null;

// LOAD

measurement.load = function(dataObject) {
	if (!dataObject || !helpers.isObject(dataObject)) {
		throw new Error('dataObject must exist and be an object');
	}
	measurement.resetToDefaultOptions();
	helpers.forEach(dataObject.systems, function (config, key) {
		measurement.allSystems[key] = new MeasurementSystem(key, config);
	});
	prepareTree();
	helpers.forEach(dataObject.dimensions, function (config, key) {
		measurement.dimensions[key] = new DimensionDefinition(key, config);
	});
	prepareUnits();
	helpers.forEach(dataObject.prefixes, function (config, key) {
		measurement.prefixes[key] = new Prefix(key, config);
	});
}

function prepareTree() {
	helpers.forEach(measurement.allSystems, function (system, key) {
		if (!system.inherits) {
			measurement.rootSystems[key] = system;
		} else {
			helpers.forEach(measurement.allSystems, function (parentSystem, parentKey) {
				if (parentKey == system.inherits) {
					parentSystem.children[key] = system;
					system.parent = parentSystem;
				}
			})
		}
	})
}

function prepareUnits() {
	helpers.forEach(measurement.dimensions, function (dimension, key) {
		helpers.forEach(dimension.units, function (unit, key) {
			unit.updateMeasurementSystems(measurement.allSystems);
			measurement.allUnits.push(unit);
		});
	});
}

// FIND

// Helpers

function findImpl(items, matcher, findParam, ignoreCase, filterFunc, sortCalculatePoints) {
	// Validate
	if (!helpers.isString(findParam) || (helpers.isString(findParam) && findParam.length == 0)) {
		throw new Error('Find parameter must be a string and at least one character');
	}
	// Ignore Case Defaults To True
	ignoreCase = (helpers.isBoolean(ignoreCase)) ? ignoreCase : true;
	// Do Find
	var matches = [];
	helpers.forEach(items, function (item, key) {
		if (item[matcher](findParam, ignoreCase)) {
			matches.push(item);
		}
	});
	matches = matches.filter(filterFunc);
	matches = matches.sort(function (x, y) {
		return compare(x, y, sortCalculatePoints);
	}).reverse(); // Descending
	return matches;
}

function compare(item1, item2, calculatePoints) {
	if (!item1) {
		return (!item2) ? 0 : -1;
	}
	if (!item2) {
		return 1;
	}
	var item1Points = calculatePoints(item1);
	var item2Points = calculatePoints(item2);
	if (item1Points == item2Points) {
		return item2.key.toUpperCase().localeCompare(item1.key.toUpperCase());
	}
	return (item1Points > item2Points) ? 1 : -1;
}

// Measurement Systems

measurement.findSystem = function (systemName, ignoreCase) {
	return measurement.findSystems(systemName, ignoreCase)[0];
};

measurement.findSystemPartial = function (systemName, ignoreCase) {
	return measurement.findSystemsPartial(systemName, ignoreCase)[0];
};

measurement.findSystems = function (systemName, ignoreCase) {
	return findImpl(measurement.allSystems, 'isMatch', systemName, ignoreCase, systemFilter, systemCalculatePoints);
};

measurement.findSystemsPartial = function (systemName, ignoreCase) {
	return findImpl(measurement.allSystems, 'isPartialMatch', systemName, ignoreCase, systemFilter, systemCalculatePoints);
};

function systemFilter(system) {
	return helpers.contains(allowedSystems(), system);
}

function allowedSystems() {
	var arrSystems = (measurement.options.allowedSystemsForUnits.length == 0)
		? helpers.values(measurement.allSystems)
		: possibleAllowedSystems();
	var toRemove = [];
	helpers.forEach(measurement.options.ignoredSystemsForUnits, function (ignore) {
		if (helpers.contains(arrSystems, ignore)) {
			toRemove.push(ignore);
			toRemove = toRemove.concat(checkRemoveParent(ignore.parent));
		}
	});
	arrSystems = arrSystems.filter(function (system) {
		return (!helpers.contains(toRemove, system));
	});
	return arrSystems;
}

function possibleAllowedSystems() {
	var results = measurement.options.allowedSystemsForUnits.map(function (system) {
		return system.ancestors();
	});
	results = helpers.flatten(results);
	return helpers.unique(results);
}

function checkRemoveParent(parent) {
	var toRemove = [];
	if (parent) {
		if (!helpers.contains(measurement.options.allowedSystemsForUnits, parent)) {
			toRemove.push(parent);
			toRemove = toRemove.concat(checkRemoveParent(parent.parent));
		}
	}
	return toRemove;
}

function systemCalculatePoints(system) {
	var points = 0;
	if (system.isRoot()) {
		points += 1000;
	}
	points -= (10 * system.ancestors().length);
	return points;
}

// Dimension Definitions

measurement.findDimension = function (dimensionName, ignoreCase) {
	return measurement.findDimensions(dimensionName, ignoreCase)[0];
};

measurement.findDimensionPartial = function (dimensionName, ignoreCase) {
	return measurement.findDimensionsPartial(dimensionName, ignoreCase)[0];
};

measurement.findDimensions = function (dimensionName, ignoreCase) {
	return findImpl(measurement.dimensions, 'isMatch', dimensionName, ignoreCase, dimensionFilter, dimensionCalculatePoints);
};

measurement.findDimensionsPartial = function (dimensionName, ignoreCase) {
	return findImpl(measurement.dimensions, 'isPartialMatch', dimensionName, ignoreCase, dimensionFilter, dimensionCalculatePoints);
};

function dimensionFilter(dimension) {
	if (!measurement.options.allowVectorDimensions && dimension.vector) {
		return false;
	}
	if (!measurement.options.allowDerivedDimensions && dimension.isDerived()) {
		return false;
	}
	if (helpers.contains(measurement.options.ignoredDimensions, dimension)) {
		return false;
	}
	return true;
}

function dimensionCalculatePoints(dimension) {
	var points = 0;
	if (!dimension.isDerived()) {
		points += 100;
	}
	if (!dimension.dimensionless) {
		points += 1000;
	}
	if (!dimension.vector) {
		points += 10000;
	}
	return points;
}

// Units

measurement.findBaseUnit = function (dimensionName, ignoreCase) {
	var dimension = measurement.findDimension(dimensionName, ignoreCase);
	return (dimension) ? dimension.baseUnit : null;
};

measurement.findBaseUnitPartial = function (dimensionName, ignoreCase) {
	var dimension = measurement.findDimensionPartial(dimensionName, ignoreCase);
	return (dimension) ? dimension.baseUnit : null;
};

measurement.findUnit = function (unitName, dimensionName, ignoreCase) {
	return measurement.findUnits(unitName, dimensionName, ignoreCase)[0];
};

measurement.findUnitPartial = function (unitName, dimensionName, ignoreCase) {
	return measurement.findUnitsPartial(unitName, dimensionName, ignoreCase)[0];
};

measurement.findUnits = function (unitName, dimensionName, ignoreCase) {
	var units = (dimensionName) ? measurement.findDimension(dimensionName, ignoreCase).units : measurement.allUnits;
	return findImpl(units, 'isMatch', unitName, ignoreCase, unitFilter, unitCalculatePoints);
};

measurement.findUnitsPartial = function (unitName, dimensionName, ignoreCase) {
	var units = (dimensionName) ? measurement.findDimensionPartial(dimensionName, ignoreCase).units : measurement.allUnits;
	return findImpl(units, 'isPartialMatch', unitName, ignoreCase, unitFilter, unitCalculatePoints);
};

function unitFilter(unit) {
	if (!measurement.options.useRareUnits && unit.rare) {
		return false;
	}
	if (!measurement.options.useEstimatedUnits && unit.estimation) {
		return false;
	}
	if (helpers.values(unit.systems).filter(systemFilter).length == 0) {
		return false;
	}
	return true;
}

function unitCalculatePoints(unit) {
	var points = 0;
	points += dimensionCalculatePoints(unit.dimension);
	if (unit.isBaseUnit()) {
		points += 10000;
	}
	if (!unit.rare) {
		points += 1000;
	}
	if (!unit.estimation) {
		points += 100;
	}
	return points;
}

// Prefixes

measurement.findPrefix = function (prefixName, ignoreCase) {
	return measurement.findPrefixes(prefixName, ignoreCase)[0];
};

measurement.findPrefixPartial = function (prefixName, ignoreCase) {
	return measurement.findPrefixesPartial(prefixName, ignoreCase)[0];
};

measurement.findPrefixes = function (prefixName, ignoreCase) {
	return findImpl(measurement.prefixes, 'isMatch', prefixName, ignoreCase, prefixFilter, prefixCalculatePoints);
};

measurement.findPrefixesPartial = function (prefixName, ignoreCase) {
	return findImpl(measurement.prefixes, 'isPartialMatch', prefixName, ignoreCase, prefixFilter, prefixCalculatePoints);
};

function prefixFilter(prefix) {
	if (!measurement.options.useRarePrefixes && prefix.rare) {
		return false;
	}
	if (!measurement.options.useUnofficalPrefixes && prefix.type === 'siUnofficial') {
		return false;
	}
	return true;
}

function prefixCalculatePoints(prefix) {
	var points = 0;
	if (prefix.type !== 'siUnofficial') {
		points += 1000;
	}
	if (!prefix.rare) {
		points += 100;
	}
	if (prefix.type !== 'siBinary') {
		points += 10;
	}
	return points;
}

// Expose some private functions for testing
measurement._private = {
	compare: compare,
	systemFilter: systemFilter,
	systemCalculatePoints: systemCalculatePoints,
	dimensionFilter: dimensionFilter,
	dimensionCalculatePoints: dimensionCalculatePoints,
	unitFilter: unitFilter,
	unitCalculatePoints: unitCalculatePoints,
	prefixFilter: prefixFilter,
	prefixCalculatePoints: prefixCalculatePoints
};

// LOAD

measurement.load(systemsJson);

},{"../common/systems.json":10,"../lib/dimension.js":11,"../lib/entities/dimension_definition.js":12,"../lib/entities/measurement_system.js":13,"../lib/entities/prefix.js":14,"../lib/helpers.js":16,"../lib/options.js":18,"../lib/quantity.js":19}],18:[function(require,module,exports){
/*jslint node: true */
'use strict';

var Options = (function () {
	function OptionsImpl() {
		// General
		this.allowReorderingDimensions = true;
		this.useAutomaticPrefixManagement = true;

		// Dimension Definitions
		this.allowDerivedDimensions = true;
		this.allowVectorDimensions = false;
		this.ignoredDimensions = [];

		// Units
		this.useRareUnits = false;
		this.useEstimatedUnits = true;

		// Systems
		this.allowedSystemsForUnits = [];
		this.ignoredSystemsForUnits = [];

		// Prefixes
		this.useRarePrefixes = false;
		this.useUnofficalPrefixes = false;
	}

	return OptionsImpl;
}());

module.exports = Options;

},{}],19:[function(require,module,exports){
/*jslint node: true */
'use strict';

var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js'),
	Dimension = require('../lib/dimension.js');

var Quantity = (function () {
	function QuantityImpl(paramA, paramB) {
		if (!paramB && helpers.isString(paramA)) {
			constructFromJson(this, paramA);
		} else if (!paramB) {
			constructWithDimensions(this, paramA, []);
		} else if (helpers.isString(paramB)) {
			constructWithUnitName(this, paramA, paramB);
		} else if (helpers.isArray(paramB) && testArray(paramB, isDimension)) {
			constructWithDimensions(this, paramA, paramB);
		} else if (helpers.isArray(paramB) && testArray(paramB, helpers.isString)) {
			constructWithUnitNames(this, paramA, paramB);
		} else {
			throw new Error('Invalid parameters provided');
		}
	}

	function constructWithDimensions(quantity, value, dimensions) {
		// Value
		// TODO - Handle other types of value
		if (!helpers.isNumber(value)) {
			throw new Error('Quantity requires a value that is a number');
		}
		quantity.value = value;

		// Dimensions
		quantity.dimensions = dimensions;
	}

	// Helper Constructors

	function constructFromJson(quantity, json) {
		var jsonConfig, value, dimensions = [];

		jsonConfig = JSON.parse(json);
		value = jsonConfig.value;

		if (jsonConfig.dimensions && helpers.isArray(jsonConfig.dimensions)) {
			helpers.forEach(jsonConfig.dimension, function (dimConfig) {
				dimensions.push(new measurement.Dimension(dimConfig.unit, dimConfig.dimension, dimConfig.power, dimConfig.prefix));
			});
		} else if (jsonConfig.unit && jsonConfig.dimension) {
			dimensions.push(new measurement.Dimension(jsonConfig.unit, jsonConfig.dimension));
		}
		constructWithDimensions(quantity, value, dimensions);
	}

	function constructWithUnitName(quantity, value, unitName) {
		// Allows q(1, 'metre');
		var dimension = new Dimension(unitName);
		constructWithDimensions(quantity, value, [dimension]);
	}

	function constructWithUnitNames(quantity, value, unitNameArray) {
		// Allowes q(1, ['metre', 'metre', 'second']);
		var dimensions = [];
		helpers.forEach(unitNameArray, function (unitName) {
			dimensions.push(new Dimension(unitName));
		});
		constructWithDimensions(quantity, value, dimensions);
	}

	// Type Checking

	QuantityImpl.prototype.class = function () {
		return 'Quantity';
	}

	function isQuantity (value) {
		return (value.class && helpers.isFunction(value.class) && value.class() == 'Quantity');
	}

	// TODO check all below this ...

	// Unit Conversion

	// Notes:
	// http://en.wikipedia.org/wiki/Conversion_of_units

	// ????? - Unnecessary? Can Remove??
	QuantityImpl.prototype.allDimensionsUsingBaseUnit = function () {
		var areAllBase = true;

		helpers.forEach(this.dimensions, function (dimension) {
			if (!dimension.unitIsBaseUnit()) {
				areAllBase = false;
			}
		});
		return areAllBase;
	};

	// paramA - Either a quantity, or a unit, or a unitName
	QuantityImpl.prototype.convert = function (paramA) {
		var convertedQuantity, quantityAsBase = this.convertToBase();

		if (isQuantity(paramA)) {
			if (!this.isCommensurable(paramA)) {
				throw new Error('In order to convert based upon a quantity they must be commensurable');
			}
			// Handle taking a quantity and converting the first quantity based on it's dimensions
			convertedQuantity = quantityAsBase;
			helpers.forEach(paramA.dimensions, function (dimension) {
				convertedQuantity = convertedQuantity.convertFromBase(dimension.unit);
			});
		} else {
			convertedQuantity = quantityAsBase.convertFromBase(paramA);
		}
		return convertedQuantity;
	};

	// unit (optional) - Either a unit or a unitName
	// TODO - C# Doesn't allow a param here...
	QuantityImpl.prototype.convertToBase = function (unit) {
		var convertedValue, newDimensions;

		if (unit && helpers.isString(unit)) {
			unit = measurement.findUnit(unit);
		}

		newDimensions = [];
		convertedValue = this.value;
		helpers.forEach(this.dimensions, function (dimension) {
			var dimValuePair;

			if (!unit || dimension.unit.key === unit.key) {
				dimValuePair = dimension.convertToBase(convertedValue);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, newDimensions);
	};

	QuantityImpl.prototype.convertFromBase = function (unit, prefix) {
		var convertedValue, newDimensions;

		if (unit && helpers.isString(unit)) {
			unit = measurement.findUnit(unit);
		}
		if (prefix && helpers.isString(prefix)) {
			prefix = measurement.findPrefix(prefix);
		}

		newDimensions = [];
		convertedValue = this.value;
		helpers.forEach(this.dimensions, function (dimension) {
			var dimValuePair;

			if (dimension.unit.dimension.key === unit.dimension.key) {
				dimValuePair = dimension.convertFromBase(convertedValue, unit, prefix);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, newDimensions);
	};

	// General Operations

	QuantityImpl.prototype.simplify = function () {
		var dimensionsValuePair = helpers.simplifyDimensions(this.value, this.dimensions);
		var resultingQuantity = new Quantity(dimensionsValuePair.value, dimensionsValuePair.dimensions);
		if (measurement.options.useAutomaticPrefixManagement) {
			resultingQuantity = resultingQuantity.tidyPrefixes();
		}
		return resultingQuantity;
	};

	QuantityImpl.prototype.tidyPrefixes = function () {
		// TODO
		return this;
	}

	QuantityImpl.prototype.isDimensionless = function () {
		return (this.dimensions.length === 0);
	};

	QuantityImpl.prototype.isCommensurable = function (quantity) {
		if (!isQuantity(quantity)) {
			throw new Error('Cannot check the commensurability of something that is not a Quantity');
		}
		// Dimensionless
		if (this.isDimensionless() && quantity.isDimensionless()) {
			return true;
		}

		var simplifiedThis = this.simplify();
		var simplifiedQuantity = quantity.simplify();

		if (simplifiedThis.dimensions.length !== simplifiedQuantity.dimensions.length) {
			return false;
		}

		var allHaveMatch = true;
		helpers.forEach(simplifiedThis.dimensions, function (dimension) {
			var foundMatch = false;
			helpers.forEach(simplifiedQuantity.dimensions, function (otherDimension) {
				if (dimension.isCommensurableMatch(otherDimension)) {
					foundMatch = true;
				}
			});
			if (!foundMatch) {
				allHaveMatch = false;
			}
		});
		return allHaveMatch;
	};

	// Quantity Math & Dimensional Analysis

	// Notes:
	// http://en.wikipedia.org/wiki/Units_conversion_by_factor-label
	// http://en.wikipedia.org/wiki/Dimensional_analysis

	QuantityImpl.prototype.multiply = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value * value, this.dimensions);
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot multiply something that is not a number or a Quantity.');
		}

		// Manipulate provided units s^2/m * kg/hr => s.kg/m (does not work with things with an offset like celsius or fahrenheit)
		var allDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		helpers.forEach(value.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		var multipliedQuantity = new Quantity(this.value * value.value, allDimensions);

		// Convert value into same units, preferring original units
		// 10 s^2/m * 20 kg/hr => ?? s.kg/m
		// 10 s^2/m * 20 kg/s * 1/3600 => 10 * 20 * 1/3600 s.kg/m

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return multipliedQuantity.simplify();
	};

	QuantityImpl.prototype.divide = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value / value, this.dimensions);
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot divide something that is not a number or a Quantity.');
		}

		// Manipulate provided units s^2/m / kg/hr => s^2/m * hr/kg => s^3/m.kg (does not work with things with an offset like celsius or fahrenheit)
		var allDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		helpers.forEach(value.dimensions, function (dimension) {
			allDimensions.push(dimension.invert());
		});
		var dividedQuantity = new Quantity(this.value / value.value, allDimensions);

		// Convert value into same units, prefering original units
		// 10 s^2/m / 20 kg/hr => ?? s^3/m.kg
		// 10 s^2/m / 20 kg/s * 3600 => 10 / 20 * 3600 s^3/m.kg

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return dividedQuantity.simplify();
	};

	QuantityImpl.prototype.add = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value + value, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot add something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values added directly and the initial quantity's units
		return new Quantity(this.value + convertedQuantity.value, this.dimensions);
	};

	QuantityImpl.prototype.subtract = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value - value, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot subtract something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values subtracted directly and the initial quantity's units
		return new Quantity(this.value - convertedQuantity.value, this.dimensions);
	};

	// Math Aliases

	QuantityImpl.prototype.times = function (value) { return this.multiply(value); };
	QuantityImpl.prototype.plus = function (value) { return this.add(value); };
	QuantityImpl.prototype.minus = function (value) { return this.subtract(value); };

	// JS Math Extensions

	QuantityImpl.prototype.abs = function () { return createQuantity(this, Math.abs); };
	QuantityImpl.prototype.acos = function () { return createQuantity(this, Math.acos); };
	QuantityImpl.prototype.asin = function () { return createQuantity(this, Math.asin); };
	QuantityImpl.prototype.atan = function () { return createQuantity(this, Math.atan); };
	QuantityImpl.prototype.ceil = function () { return createQuantity(this, Math.ceil); };
	QuantityImpl.prototype.cos = function () { return createQuantity(this, Math.cos); };
	QuantityImpl.prototype.exp = function () { return createQuantity(this, Math.exp); };
	QuantityImpl.prototype.floor = function () { return createQuantity(this, Math.floor); };
	QuantityImpl.prototype.log = function () { return createQuantity(this, Math.log); };
	QuantityImpl.prototype.round = function () { return createQuantity(this, Math.round); };
	QuantityImpl.prototype.sin = function () { return createQuantity(this, Math.sin); };
	QuantityImpl.prototype.sqrt = function () { return createQuantity(this, Math.sqrt); };
	QuantityImpl.prototype.tan = function () { return createQuantity(this, Math.tan); };

	function createQuantity(self, mathFunction) {
		return new Quantity(mathFunction(self.value), self.dimensions);
	}

	QuantityImpl.prototype.atan2 = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.atan2(y, this.value), this.dimensions);
	};

	QuantityImpl.prototype.pow = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.pow(this.value, y), this.dimensions);
	};

	QuantityImpl.prototype.max = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.max.apply(null, args), this.dimensions);
	};

	QuantityImpl.prototype.min = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.min.apply(null, args), this.dimensions);
	};

	// Helper functions

	QuantityImpl.prototype.clone = function () {
		var newDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			newDimensions.push(dimension.clone());
		});
		return new Quantity(this.value, newDimensions);
	};

	QuantityImpl.prototype.serialised = function () {
		var jsonResult = {
			value: this.value
		};

		if (this.dimensions.length === 1 && this.dimensions[0].power === 1  && !this.dimensions[0].prefix) {
			jsonResult.unit = this.dimensions[0].unit.key;
			jsonResult.dimension = this.dimensions[0].unit.dimension.key;
		} else if (this.dimensions.length > 0) {
			jsonResult.dimensions = [];
			helpers.forEach(this.dimensions, function (dimension) {
				jsonResult.dimensions.push(dimension.serialised());
			});
		}
		return jsonResult;
	};

	QuantityImpl.prototype.toJson = function () {
		return JSON.stringify(this.serialised());
	};

	QuantityImpl.prototype.format = function (config) {
		// TODO - get default format config object...
		config = config || {};
		if (typeof config.sort === 'undefined') { // default
			config.sort = true;
		}

		var valueStr = '';
		// Precision/Fixed
		if (typeof config.fixed !== 'undefined') {
			valueStr += this.value.toFixed(config.fixed);
		} else {
			valueStr += this.value.toPrecision(config.precision);
		}

		// Separator/Decimal
		var numLength = valueStr.indexOf('.');
		if (numLength === -1) {
			numLength = valueStr.length;
		}
		var separatorPos = numLength - (config.separatorCount || 3);
		valueStr = valueStr.replace('.', config.decimal || '.');
		if (config.separator) {
			while (separatorPos > 0) {
				valueStr = helpers.splice(valueStr, separatorPos, config.separator);
				separatorPos -= (config.separatorCount || 3);
			}
		}

		// Exponents
		if (config.expandExponent) {
			var eIndex = valueStr.indexOf('e');
			if (eIndex > -1) {
				var exponent = Math.floor(Math.log(this.value)/Math.log(10));
				valueStr = valueStr.slice(0, eIndex);
				var exponentStr = (config.asciiOnly) ? '^' + exponent : helpers.toSuperScript(exponent);
				valueStr += ' x 10' + exponentStr;
			}
		}

		// Dimensions
		var dimensionStrings = [];
		var clonedDimensions = this.clone().dimensions;
		if (config.sort) {
			clonedDimensions.sort(function (d1, d2) {
				return d2.power - d1.power;
			});
		}
		helpers.forEach(clonedDimensions, function (dimension) {
			dimensionStrings.push(dimension.format(config));
		});

		var joiner = (config.textualDescription) ? ' ' : (config.unitSeparator || '');
		var dimensionStr = dimensionStrings.join(joiner);

		// Returning
		if (config.onlyValue) {
			return valueStr;
		} else if (config.onlyDimensions) {
			return dimensionStr;
		} else {
			if (dimensionStr.length > 0) {
				valueStr += ' ';
			}
			return valueStr + dimensionStr;
		}
	};

	// HELPER FUNCTIONS

	function isDimension(dim) {
		return dim && dim.class && dim.class() == 'Dimension';
	}

	function testArray(array, testFunc) {
		var allMatch = true;
		helpers.forEach(array, function (item) {
			if (!testFunc(item)) {
				allMatch = false;
			}
		});
		return allMatch;
	}

	return QuantityImpl;
}());

module.exports = Quantity;

},{"../lib/dimension.js":11,"../lib/helpers.js":16,"../lib/measurement.js":17}],20:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding) {
  var self = this
  if (!(self instanceof Buffer)) return new Buffer(subject, encoding)

  var type = typeof subject
  var length

  if (type === 'number') {
    length = +subject
  } else if (type === 'string') {
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) {
    // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data)) subject = subject.data
    length = +subject.length
  } else {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (length > kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' +
      kMaxLength.toString(16) + ' bytes')
  }

  if (length < 0) length = 0
  else length >>>= 0 // coerce to uint32

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    self = Buffer._augment(new Uint8Array(length)) // eslint-disable-line consistent-this
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    self.length = length
    self._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    self._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++) {
        self[i] = subject.readUInt8(i)
      }
    } else {
      for (i = 0; i < length; i++) {
        self[i] = ((subject[i] % 256) + 256) % 256
      }
    }
  } else if (type === 'string') {
    self.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < length; i++) {
      self[i] = 0
    }
  }

  if (length > 0 && length <= Buffer.poolSize) self.parent = rootParent

  return self
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, totalLength) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function byteLength (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function toString (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0

  if (length < 0 || offset < 0 || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, target_start, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (target_start >= target.length) target_start = target.length
  if (!target_start) target_start = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (target_start < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - target_start < end - start) {
    end = target.length - target_start + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":21,"ieee754":22,"is-array":23}],21:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],22:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],23:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],24:[function(require,module,exports){
var util = require('./util');
var format = require('should-format');

/**
 * should AssertionError
 * @param {Object} options
 * @constructor
 * @memberOf should
 * @static
 */
var AssertionError = function AssertionError(options) {
  util.merge(this, options);

  if(!options.message) {
    Object.defineProperty(this, 'message', {
        get: function() {
          if(!this._message) {
            this._message = this.generateMessage();
            this.generatedMessage = true;
          }
          return this._message;
        },
        configurable: true,
        enumerable: false
      }
    )
  }

  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if(err.stack) {
      var out = err.stack;

      if(this.stackStartFunction) {
        // try to strip useless frames
        var fn_name = util.functionName(this.stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if(idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
      }

      this.stack = out;
    }
  }
};


var indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}


// assert.AssertionError instanceof Error
AssertionError.prototype = Object.create(Error.prototype, {
  name: {
    value: 'AssertionError'
  },

  generateMessage: {
    value: function() {
      if(!this.operator && this.previous) {
        return this.previous.message;
      }
      var actual = format(this.actual);
      var expected = 'expected' in this ? ' ' + format(this.expected) : '';
      var details = 'details' in this && this.details ? ' (' + this.details + ')' : '';

      var previous = this.previous ? '\n' + indentLines(this.previous.message) : '';

      return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.operator + expected + details + previous;
    }
  }
});

module.exports = AssertionError;
},{"./util":40,"should-format":42}],25:[function(require,module,exports){
var AssertionError = require('./assertion-error');
var util = require('./util');
var format = require('should-format');

/**
 * should Assertion
 * @param {*} obj Given object for assertion
 * @constructor
 * @memberOf should
 * @static
 */
function Assertion(obj) {
  this.obj = obj;

  this.anyOne = false;
  this.negate = false;

  this.params = {actual: obj};
}

/**
 * Way to extend Assertion function. It uses some logic
 * to define only positive assertions and itself rule with negative assertion.
 *
 * All actions happen in subcontext and this method take care about negation.
 * Potentially we can add some more modifiers that does not depends from state of assertion.
 * @memberOf Assertion
 * @category assertion
 * @static
 * @param {String} name Name of assertion. It will be used for defining method or getter on Assertion.prototype
 * @param {Function} func Function that will be called on executing assertion
 * @param {Boolean} [isGetter] If this assertion is getter. By default it is false.
 * @example
 *
 * Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' };
 *
 *      this.obj.should.have.property('id').which.is.a.Number;
 *      this.obj.should.have.property('path');
 * });
 */
Assertion.add = function(name, func, isGetter) {
  var prop = {enumerable: true, configurable: true};

  isGetter = !!isGetter;

  prop[isGetter ? 'get' : 'value'] = function() {
    var context = new Assertion(this.obj, this, name);
    context.anyOne = this.anyOne;

    try {
      func.apply(context, arguments);
    } catch(e) {
      //check for fail
      if(e instanceof AssertionError) {
        //negative fail
        if(this.negate) {
          this.obj = context.obj;
          this.negate = false;
          return this.proxied();
        }

        //console.log('catch', name, context.params.operator, e.operator);
        //console.log(name, e.actual, context.obj, context.params.actual, this.params.actual);
        /*if(e.operator !== context.params.operator) {// it means assertion happen because own context
         if(!('obj' in context.params)) {
         if(!('actual' in context.params)) {
         context.params.actual = context.obj;
         }
         }
         util.merge(e, context.params);
         //e.operato
         //e.operator = context.params.operator;
         }*/
        if(context != e.assertion) {
          context.params.previous = e;
        }

        //positive fail
        context.negate = false;
        context.fail();
      }
      // throw if it is another exception
      throw e;
    }

    //negative pass
    if(this.negate) {
      context.negate = true;//because .fail will set negate
      context.params.details = "false negative fail";
      context.fail();
    }

    //positive pass
    if(!this.params.operator) this.params = context.params;//shortcut
    this.obj = context.obj;
    this.negate = false;
    return this.proxied();
  };

  Object.defineProperty(Assertion.prototype, name, prop);
};

Assertion.addChain = function(name, onCall) {
  onCall = onCall || function() {
  };
  Object.defineProperty(Assertion.prototype, name, {
    get: function() {
      onCall();
      return this.proxied();
    },
    enumerable: true
  });
};

/**
 * Create alias for some `Assertion` property
 *
 * @memberOf Assertion
 * @category assertion
 * @static
 * @param {String} from Name of to map
 * @param {String} to Name of alias
 * @example
 *
 * Assertion.alias('true', 'True');
 */
Assertion.alias = function(from, to) {
  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if(!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
  Object.defineProperty(Assertion.prototype, to, desc);
};

Assertion.prototype = {
  constructor: Assertion,

  /**
   * Base method for assertions. Before calling this method need to fill Assertion#params object. This method usually called from other assertion methods.
   * `Assertion#params` can contain such properties:
   * * `operator` - required string containing description of this assertion
   * * `obj` - optional replacement for this.obj, it usefull if you prepare more clear object then given
   * * `message` - if this property filled with string any others will be ignored and this one used as assertion message
   * * `expected` - any object used when you need to assert relation between given object and expected. Like given == expected (== is a relation)
   * * `details` - additional string with details to generated message
   *
   * @memberOf Assertion
   * @category assertion
   * @param {*} expr Any expression that will be used as a condition for asserting.
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.assert(false);
   * //throws AssertionError: expected 42 to be magic number
   */
  assert: function(expr) {
    if(expr) return this.proxied();

    var params = this.params;

    if('obj' in params && !('actual' in params)) {
      params.actual = params.obj;
    } else if(!('obj' in params) && !('actual' in params)) {
      params.actual = this.obj;
    }

    params.stackStartFunction = params.stackStartFunction || this.assert;
    params.negate = this.negate;

    params.assertion = this;

    throw new AssertionError(params);
  },

  /**
   * Shortcut for `Assertion#assert(false)`.
   *
   * @memberOf Assertion
   * @category assertion
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.fail();
   * //throws AssertionError: expected 42 to be magic number
   */
  fail: function() {
    return this.assert(false);
  },

  /**
   * Negation modifier. Current assertion chain become negated. Each call invert negation on current assertion.
   *
   * @memberOf Assertion
   * @category assertion
   */
  get not() {
    this.negate = !this.negate;
    return this.proxied();
  },

  /**
   * Any modifier - it affect on execution of sequenced assertion to do not `check all`, but `check any of`.
   *
   * @memberOf Assertion
   * @category assertion
   */
  get any() {
    this.anyOne = true;
    return this.proxied();
  },

  proxied: function() {
    if(typeof Proxy == 'function') {
      return new Proxy(this, {
        get: function(target, name) {
          if(name in target) {
            return target[name];
          } else {
            throw new Error('Assertion has no property ' + util.formatProp(name));
          }
        }
      })
    }
    return this;
  }
};

module.exports = Assertion;
},{"./assertion-error":24,"./util":40,"should-format":42}],26:[function(require,module,exports){
var config = {
  checkProtoEql: false
};

module.exports = config;
},{}],27:[function(require,module,exports){
// implement assert interface using already written peaces of should.js

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('./../util');
var Assertion = require('./../assertion');

var _deepEqual = require('should-equal');

var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
/**
 * Node.js standard [`assert.fail`](http://nodejs.org/api/assert.html#assert_assert_fail_actual_expected_message_operator).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual Actual object
 * @param {*} expected Expected object
 * @param {string} message Message for assertion
 * @param {string} operator Operator text
 */
function fail(actual, expected, message, operator, stackStartFunction) {
  var a = new Assertion(actual);
  a.params = {
    operator: operator,
    expected: expected,
    message: message,
    stackStartFunction: stackStartFunction || fail
  };

  a.fail();
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.
/**
 * Node.js standard [`assert.ok`](http://nodejs.org/api/assert.html#assert_assert_value_message_assert_ok_value_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} value
 * @param {string} [message]
 */
function ok(value, message) {
  if(!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

/**
 * Node.js standard [`assert.equal`](http://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.equal = function equal(actual, expected, message) {
  if(actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notEqual`](http://nodejs.org/api/assert.html#assert_assert_notequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notEqual = function notEqual(actual, expected, message) {
  if(actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.deepEqual`](http://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.deepEqual = function deepEqual(actual, expected, message) {
  if(!_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};


// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notDeepEqual`](http://nodejs.org/api/assert.html#assert_assert_notdeepequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if(_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.strictEqual`](http://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.strictEqual = function strictEqual(actual, expected, message) {
  if(actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notStrictEqual`](http://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if(actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if(!actual || !expected) {
    return false;
  }

  if(Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if(actual instanceof expected) {
    return true;
  } else if(expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if(typeof expected == 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch(e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ')' : '.') +
  (message ? ' ' + message : '.');

  if(shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if(!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
/**
 * Node.js standard [`assert.throws`](http://nodejs.org/api/assert.html#assert_assert_throws_block_error_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [message]
 */
assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
/**
 * Node.js standard [`assert.doesNotThrow`](http://nodejs.org/api/assert.html#assert_assert_doesnotthrow_block_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {String} [message]
 */
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

/**
 * Node.js standard [`assert.ifError`](http://nodejs.org/api/assert.html#assert_assert_iferror_value).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Error} err
 */
assert.ifError = function(err) {
  if(err) {
    throw err;
  }
};

},{"./../assertion":25,"./../util":40,"should-equal":41}],28:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util')
  , assert = require('./_assert')
  , AssertionError = require('../assertion-error');

module.exports = function(should) {
  var i = should.format;

  /*
   * Expose assert to should
   *
   * This allows you to do things like below
   * without require()ing the assert module.
   *
   *    should.equal(foo.bar, undefined);
   *
   */
  util.merge(should, assert);

  /**
   * Assert _obj_ exists, with optional message.
   *
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.exist(1);
   * should.exist(new Date());
   */
  should.exist = should.exists = function(obj, msg) {
    if(null == obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to exist'), stackStartFunction: should.exist
      });
    }
  };

  should.not = {};
  /**
   * Asserts _obj_ does not exist, with optional message.
   *
   * @name not.exist
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.not.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.not.exist(null);
   * should.not.exist(void 0);
   */
  should.not.exist = should.not.exists = function(obj, msg) {
    if(null != obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to not exist'), stackStartFunction: should.not.exist
      });
    }
  };
};
},{"../assertion-error":24,"../util":40,"./_assert":27}],29:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given object is exactly `true`.
   *
   * @name true
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#True
   * @example
   *
   * (true).should.be.true;
   * false.should.not.be.True;
   *
   * ({ a: 10}).should.not.be.true;
   */
  Assertion.add('true', function() {
    this.is.exactly(true);
  }, true);

  Assertion.alias('true', 'True');

  /**
   * Assert given object is exactly `false`.
   *
   * @name false
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#False
   * @example
   *
   * (true).should.not.be.false;
   * false.should.be.False;
   */
  Assertion.add('false', function() {
    this.is.exactly(false);
  }, true);

  Assertion.alias('false', 'False');

  /**
   * Assert given object is thuthy according javascript type conversions.
   *
   * @name ok
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (true).should.be.ok;
   * ''.should.not.be.ok;
   * should(null).not.be.ok;
   * should(void 0).not.be.ok;
   *
   * (10).should.be.ok;
   * (0).should.not.be.ok;
   */
  Assertion.add('ok', function() {
    this.params = { operator: 'to be truthy' };

    this.assert(this.obj);
  }, true);
};
},{}],30:[function(require,module,exports){
module.exports = function(should, Assertion) {
  /**
   * Simple chaining. It actually do nothing.
   *
   * @memberOf Assertion
   * @name be
   * @alias Assertion#an
   * @alias Assertion#of
   * @alias Assertion#a
   * @alias Assertion#and
   * @alias Assertion#have
   * @alias Assertion#with
   * @alias Assertion#is
   * @alias Assertion#which
   * @alias Assertion#the
   * @category assertion chaining
   */
  ['an', 'of', 'a', 'and', 'be', 'has', 'have', 'with', 'is', 'which', 'the', 'it'].forEach(function(name) {
    Assertion.addChain(name);
  });
};

},{}],31:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;
  var type = should.type;

  /**
   * Assert that given object contain something that equal to `other`. It uses `should-equal` for equality checks.
   * If given object is array it search that one of elements was equal to `other`.
   * If given object is string it checks if `other` is a substring - expected that `other` is a string.
   * If given object is Object it checks that `other` is a subobject - expected that `other` is a object.
   *
   * @name containEql
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [1, 2, 3].should.containEql(1);
   * [{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
   *
   * 'abc'.should.containEql('b');
   * 'ab1c'.should.containEql(1);
   *
   * ({ a: 10, c: { d: 10 }}).should.containEql({ a: 10 });
   * ({ a: 10, c: { d: 10 }}).should.containEql({ c: { d: 10 }});
   * ({ a: 10, c: { d: 10 }}).should.containEql({ b: 10 });
   * // throws AssertionError: expected { a: 10, c: { d: 10 } } to contain { b: 10 }
   * //            expected { a: 10, c: { d: 10 } } to have property b
   */
  Assertion.add('containEql', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    this.is.not.null.and.not.undefined;

    var obj = this.obj;
    var tpe = should.type(obj);

    if(tpe == should.type.STRING) {
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isIndexable(obj)) {
      this.assert(util.some(obj, function(v) {
        return eql(v, other).result;
      }));
    } else {
      this.have.properties(other);
    }
  });

  /**
   * Assert that given object is contain equally structured object on the same depth level.
   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
   * For string it is working as `Assertion#containEql
   * If given object is an object it checks that the same keys contain deep equal values (recursive)
   * On other cases it try to check with `.eql`
   *
   * @name containDeepOrdered
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeepOrdered([1, 2]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeepOrdered([ 1, [ 2, 3 ]]);
   *
   * '123'.should.containDeepOrdered('1')
   *
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
   */
  Assertion.add('containDeepOrdered', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if(type(obj) == type.STRING) {// expect other to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isIndexable(obj) && util.isIndexable(other)) {
      for(var objIdx = 0, otherIdx = 0, objLength = util.length(obj), otherLength = util.length(other); objIdx < objLength && otherIdx < otherLength; objIdx++) {
        try {
          should(obj[objIdx]).containDeepOrdered(other[otherIdx]);
          otherIdx++;
        } catch(e) {
          if(e instanceof should.AssertionError) {
            continue;
          }
          throw e;
        }
      }

      this.assert(otherIdx == otherLength);
    } else if(obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeepOrdered(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if(util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

  /**
   * The same like `Assertion#containDeepOrdered` but all checks on arrays without order.
   *
   * @name containDeep
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeep([2, 1]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);
   */
  Assertion.add('containDeep', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if(typeof obj == 'string') {// expect other to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isIndexable(obj) && util.isIndexable(other)) {
      var usedKeys = {};
      util.forEach(other, function(otherItem) {
        this.assert(util.some(obj, function(item, index) {
          if(index in usedKeys) return false;

          try {
            should(item).containDeep(otherItem);
            usedKeys[index] = true;
            return true;
          } catch(e) {
            if(e instanceof should.AssertionError) {
              return false;
            }
            throw e;
          }
        }));
      }, this);
    } else if(obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeep(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if(util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

};

},{"../util":40,"should-equal":41}],32:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var eql = require('should-equal');
var type = require('should-type');
var util = require('../util');

function formatEqlResult(r, a, b, format) {
  return ((r.path.length > 0 ? 'at ' + r.path.map(util.formatProp).join(' -> ') : '') +
  (r.a === a ? '' : ', A has ' + format(r.a)) +
  (r.b === b ? '' : ' and B has ' + format(r.b)) +
  (r.showReason ? ' because ' + r.reason: '')).trim();
}

module.exports = function(should, Assertion) {

  /**
   * Deep object equality comparison. For full spec see [`should-equal tests`](https://github.com/shouldjs/equal/blob/master/test.js).
   *
   * @name eql
   * @memberOf Assertion
   * @category assertion equality
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.eql(10);
   * ('10').should.not.be.eql(10);
   * (-0).should.not.be.eql(+0);
   *
   * NaN.should.be.eql(NaN);
   *
   * ({ a: 10}).should.be.eql({ a: 10 });
   * [ 'a' ].should.not.be.eql({ '0': 'a' });
   */
  Assertion.add('eql', function(val, description) {
    this.params = {operator: 'to equal', expected: val, message: description};

    var strictResult = eql(this.obj, val, should.config);
    this.params.details = strictResult.result ? '': formatEqlResult(strictResult, this.obj, val, should.format);

    this.params.showDiff = type(this.obj) == type(val);

    this.assert(strictResult.result);
  });

  /**
   * Exact comparison using ===.
   *
   * @name equal
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#exactly
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * 10.should.be.equal(10);
   * 'a'.should.be.exactly('a');
   *
   * should(null).be.exactly(null);
   */
  Assertion.add('equal', function(val, description) {
    this.params = {operator: 'to be', expected: val, message: description};

    this.params.showDiff = type(this.obj) == type(val);

    this.assert(val === this.obj);
  });

  Assertion.alias('equal', 'exactly');
};
},{"../util":40,"should-equal":41,"should-type":43}],33:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */
var util = require('../util');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Assert given function throws error with such message.
   *
   * @name throw
   * @memberOf Assertion
   * @category assertion errors
   * @alias Assertion#throwError
   * @param {string|RegExp|Function|Object|GeneratorFunction|GeneratorObject} [message] Message to match or properties
   * @param {Object} [properties] Optional properties that will be matched to thrown error
   * @example
   *
   * (function(){ throw new Error('fail') }).should.throw();
   * (function(){ throw new Error('fail') }).should.throw('fail');
   * (function(){ throw new Error('fail') }).should.throw(/fail/);
   *
   * (function(){ throw new Error('fail') }).should.throw(Error);
   * var error = new Error();
   * error.a = 10;
   * (function(){ throw error; }).should.throw(Error, { a: 10 });
   * (function(){ throw error; }).should.throw({ a: 10 });
   * (function*() {
   *   yield throwError();
   * }).should.throw();
   */
  Assertion.add('throw', function(message, properties) {
    var fn = this.obj
      , err = {}
      , errorInfo = ''
      , thrown = false;

    if(util.isGeneratorFunction(fn)) {
      return fn().should.throw(message, properties);
    } else if(util.isGeneratorObject(fn)) {
      return fn.next.should.throw(message, properties);
    }

    this.is.a.Function;

    var errorMatched = true;

    try {
      fn();
    } catch(e) {
      thrown = true;
      err = e;
    }

    if(thrown) {
      if(message) {
        if('string' == typeof message) {
          errorMatched = message == err.message;
        } else if(message instanceof RegExp) {
          errorMatched = message.test(err.message);
        } else if('function' == typeof message) {
          errorMatched = err instanceof message;
        } else if(null != message) {
          try {
            err.should.match(message);
          } catch(e) {
            if(e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }

        if(!errorMatched) {
          if('string' == typeof message || message instanceof RegExp) {
            errorInfo = " with a message matching " + i(message) + ", but got '" + err.message + "'";
          } else if('function' == typeof message) {
            errorInfo = " of type " + util.functionName(message) + ", but got " + util.functionName(err.constructor);
          }
        } else if('function' == typeof message && properties) {
          try {
            err.should.match(properties);
          } catch(e) {
            if(e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }
      } else {
        errorInfo = " (got " + i(err) + ")";
      }
    }

    this.params = { operator: 'to throw exception' + errorInfo };

    this.assert(thrown);
    this.assert(errorMatched);
  });

  Assertion.alias('throw', 'throwError');
};
},{"../util":40}],34:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Asserts if given object match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp and given object is a string check on matching with regexp
   * If `other` is a regexp and given object is an array check if all elements matched regexp
   * If `other` is a regexp and given object is an object check values on matching regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * If `other` is an object check if the same keys matched with above rules
   * All other cases failed
   *
   * @name match
   * @memberOf Assertion
   * @category assertion matching
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * 'foobar'.should.match(/^foo/);
   * 'foobar'.should.not.match(/^bar/);
   *
   * ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);
   *
   * ['a', 'b', 'c'].should.match(/[a-z]/);
   *
   * (5).should.not.match(function(n) {
   *   return n < 0;
   * });
   * (5).should.not.match(function(it) {
   *    it.should.be.an.Array;
   * });
   * ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
   * .match({ a: 10, b: /c$/, c: function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * [10, 'abc', { d: 10 }, 0].should
   * .match({ '0': 10, '1': /c$/, '2': function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   */
  Assertion.add('match', function(other, description) {
    this.params = {operator: 'to match ' + i(other), message: description};

    if(!eql(this.obj, other).result) {
      if(other instanceof RegExp) { // something - regex

        if(typeof this.obj == 'string') {

          this.assert(other.exec(this.obj));
        } else if(util.isIndexable(this.obj)) {
          util.forEach(this.obj, function(item) {
            this.assert(other.exec(item));// should we try to convert to String and exec?
          }, this);
        } else if(null != this.obj && typeof this.obj == 'object') {

          var notMatchedProps = [], matchedProps = [];
          util.forEach(this.obj, function(value, name) {
            if(other.exec(value)) matchedProps.push(util.formatProp(name));
            else notMatchedProps.push(util.formatProp(name) + ' (' + i(value) + ')');
          }, this);

          if(notMatchedProps.length)
            this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
          if(matchedProps.length)
            this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

          this.assert(notMatchedProps.length == 0);
        } // should we try to convert to String and exec?
      } else if(typeof other == 'function') {
        var res;

        res = other(this.obj);

        //if(res instanceof Assertion) {
        //  this.params.operator += '\n    ' + res.getMessage();
        //}

        //if we throw exception ok - it is used .should inside
        if(typeof res == 'boolean') {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if(other != null && typeof other == 'object') { // try to match properties (for Object and Array)
        notMatchedProps = [];
        matchedProps = [];

        util.forEach(other, function(value, key) {
          try {
            should(this.obj[key]).match(value);
            matchedProps.push(util.formatProp(key));
          } catch(e) {
            if(e instanceof should.AssertionError) {
              notMatchedProps.push(util.formatProp(key) + ' (' + i(this.obj[key]) + ')');
            } else {
              throw e;
            }
          }
        }, this);

        if(notMatchedProps.length)
          this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
        if(matchedProps.length)
          this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

        this.assert(notMatchedProps.length == 0);
      } else {
        this.assert(false);
      }
    }
  });

  /**
   * Asserts if given object values or array elements all match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp - matching with regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * All other cases check if this `other` equal to each element
   *
   * @name matchEach
   * @memberOf Assertion
   * @category assertion matching
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * [ 'a', 'b', 'c'].should.matchEach(/\w+/);
   * [ 'a', 'a', 'a'].should.matchEach('a');
   *
   * [ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });
   *
   * { a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
   */
  Assertion.add('matchEach', function(other, description) {
    this.params = {operator: 'to match each ' + i(other), message: description};

    var f = other;

    if(other instanceof RegExp)
      f = function(it) {
        return !!other.exec(it);
      };
    else if(typeof other != 'function')
      f = function(it) {
        return eql(it, other).result;
      };

    util.forEach(this.obj, function(value, key) {
      var res = f(value, key);

      //if we throw exception ok - it is used .should inside
      if(typeof res == 'boolean') {
        this.assert(res); // if it is just boolean function assert on it
      }
    }, this);
  });

  /**
  * Asserts if any of given object values or array elements match `other` object, using some assumptions:
  * First object matched if they are equal,
  * If `other` is a regexp - matching with regexp
  * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
  * All other cases check if this `other` equal to each element
  *
  * @name matchAny
  * @memberOf Assertion
  * @category assertion matching
  * @param {*} other Object to match
  * @param {string} [description] Optional message
  * @example
  * [ 'a', 'b', 'c'].should.matchAny(/\w+/);
  * [ 'a', 'b', 'c'].should.matchAny('a');
  *
  * [ 'a', 'b', 'c'].should.matchAny(function(value) { value.should.be.eql('a') });
  *
  * { a: 'a', b: 'b', c: 'c' }.should.matchAny(function(value) { value.should.be.eql('a') });
  */
  Assertion.add('matchAny', function(other, description) {
      this.params = {operator: 'to match any ' + i(other), message: description};

      var f = other;

      if(other instanceof RegExp) {
          f = function(it) {
              return !!other.exec(it);
          };
      } else if(typeof other != 'function') {
          f = function(it) {
              return eql(it, other).result;
          };
      }

      this.assert(util.some(this.obj, function(value, key) {
          try {
              var result = f(value, key);

              if(typeof result == 'boolean') {
                  return result; // if it is just boolean, return it
              }

              // Else return true - no exception was thrown, so assume it succeeded
              return true;
          } catch(e) {
              if(e instanceof should.AssertionError) {
                  // Caught an AssertionError, return false to the iterator
                  return false;
              } else {
                  throw e;
              }
          }
      }, this));
  });
};

},{"../util":40,"should-equal":41}],35:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {

  /**
   * Assert given object is NaN
   * @name NaN
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.NaN;
   * NaN.should.be.NaN;
   */
  Assertion.add('NaN', function() {
    this.params = { operator: 'to be NaN' };

    this.assert(this.obj !== this.obj);
  }, true);

  /**
   * Assert given object is not finite (positive or negative)
   *
   * @name Infinity
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.Infinity;
   * NaN.should.not.be.Infinity;
   */
  Assertion.add('Infinity', function() {
    this.params = { operator: 'to be Infinity' };

    this.is.a.Number
      .and.not.a.NaN
      .and.assert(!isFinite(this.obj));
  }, true);

  /**
   * Assert given number between `start` and `finish` or equal one of them.
   *
   * @name within
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} start Start number
   * @param {number} finish Finish number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.within(0, 20);
   */
  Assertion.add('within', function(start, finish, description) {
    this.params = { operator: 'to be within ' + start + '..' + finish, message: description };

    this.assert(this.obj >= start && this.obj <= finish);
  });

  /**
   * Assert given number near some other `value` within `delta`
   *
   * @name approximately
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} value Center number
   * @param {number} delta Radius
   * @param {string} [description] Optional message
   * @example
   *
   * (9.99).should.be.approximately(10, 0.1);
   */
  Assertion.add('approximately', function(value, delta, description) {
    this.params = { operator: 'to be approximately ' + value + " ±" + delta, message: description };

    this.assert(Math.abs(this.obj - value) <= delta);
  });

  /**
   * Assert given number above `n`.
   *
   * @name above
   * @alias Assertion#greaterThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.above(0);
   */
  Assertion.add('above', function(n, description) {
    this.params = { operator: 'to be above ' + n, message: description };

    this.assert(this.obj > n);
  });

  /**
   * Assert given number below `n`.
   *
   * @name below
   * @alias Assertion#lessThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (0).should.be.above(10);
   */
  Assertion.add('below', function(n, description) {
    this.params = { operator: 'to be below ' + n, message: description };

    this.assert(this.obj < n);
  });

  Assertion.alias('above', 'greaterThan');
  Assertion.alias('below', 'lessThan');

};

},{}],36:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

var aSlice = Array.prototype.slice;

module.exports = function(should, Assertion) {
  var i = should.format;
  /**
   * Asserts given object has some descriptor. **On success it change given object to be value of property**.
   *
   * @name propertyWithDescriptor
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {Object} desc Descriptor like used in Object.defineProperty (not required to add all properties)
   * @example
   *
   * ({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
   */
  Assertion.add('propertyWithDescriptor', function(name, desc) {
    this.params = {actual: this.obj, operator: 'to have own property with descriptor ' + i(desc)};
    var obj = this.obj;
    this.have.ownProperty(name);
    should(Object.getOwnPropertyDescriptor(Object(obj), name)).have.properties(desc);
  });

  function processPropsArgs() {
    var args = {};
    if(arguments.length > 1) {
      args.names = aSlice.call(arguments);
    } else {
      var arg = arguments[0];
      var t = should.type(arg);
      if(t == should.type.STRING) {
        args.names = [arg];
      } else if(util.isIndexable(arg)) {
        args.names = arg;
      } else {
        args.names = Object.keys(arg);
        args.values = arg;
      }
    }
    return args;
  }


  /**
   * Asserts given object has enumerable property with optionally value. **On success it change given object to be value of property**.
   *
   * @name enumerable
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.enumerable('a');
   */
  Assertion.add('enumerable', function(name, val) {
    name = util.convertPropertyName(name);

    this.params = {
      operator: "to have enumerable property " + util.formatProp(name) + (arguments.length > 1 ? " equal to " + i(val): "")
    };

    var desc = { enumerable: true };
    if(arguments.length > 1) desc.value = val;
    this.have.propertyWithDescriptor(name, desc);
  });

  /**
   * Asserts given object has enumerable properties
   *
   * @name enumerables
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10, b: 10 }).should.have.enumerables('a');
   */
  Assertion.add('enumerables', function(names) {
    var args = processPropsArgs.apply(null, arguments);

    this.params = {
      operator: "to have enumerables " + args.names.map(util.formatProp)
    };

    var obj = this.obj;
    args.names.forEach(function(name) {
      obj.should.have.enumerable(name);
    });
  });

  /**
   * Asserts given object has property with optionally value. **On success it change given object to be value of property**.
   *
   * @name property
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.property('a');
   */
  Assertion.add('property', function(name, val) {
    name = util.convertPropertyName(name);
    if(arguments.length > 1) {
      var p = {};
      p[name] = val;
      this.have.properties(p);
    } else {
      this.have.properties(name);
    }
    this.obj = this.obj[name];
  });

  /**
   * Asserts given object has properties. On this method affect .any modifier, which allow to check not all properties.
   *
   * @name properties
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10 }).should.have.properties('a');
   * ({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
   * ({ a: 10, b: 20 }).should.have.properties({ b: 20 });
   */
  Assertion.add('properties', function(names) {
    var values = {};
    if(arguments.length > 1) {
      names = aSlice.call(arguments);
    } else if(!Array.isArray(names)) {
      if(typeof names == 'string' || typeof names == 'symbol') {
        names = [names];
      } else {
        values = names;
        names = Object.keys(names);
      }
    }

    var obj = Object(this.obj), missingProperties = [];

    //just enumerate properties and check if they all present
    names.forEach(function(name) {
      if(!(name in obj)) missingProperties.push(util.formatProp(name));
    });

    var props = missingProperties;
    if(props.length === 0) {
      props = names.map(util.formatProp);
    } else if(this.anyOne) {
      props = names.filter(function(name) {
        return missingProperties.indexOf(util.formatProp(name)) < 0;
      }).map(util.formatProp);
    }

    var operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

    this.params = {obj: this.obj, operator: operator};

    //check that all properties presented
    //or if we request one of them that at least one them presented
    this.assert(missingProperties.length === 0 || (this.anyOne && missingProperties.length != names.length));

    // check if values in object matched expected
    var valueCheckNames = Object.keys(values);
    if(valueCheckNames.length) {
      var wrongValues = [];
      props = [];

      // now check values, as there we have all properties
      valueCheckNames.forEach(function(name) {
        var value = values[name];
        if(!eql(obj[name], value).result) {
          wrongValues.push(util.formatProp(name) + ' of ' + i(value) + ' (got ' + i(obj[name]) + ')');
        } else {
          props.push(util.formatProp(name) + ' of ' + i(value));
        }
      });

      if((wrongValues.length !== 0 && !this.anyOne) || (this.anyOne && props.length === 0)) {
        props = wrongValues;
      }

      operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

      this.params = {obj: this.obj, operator: operator};

      //if there is no not matched values
      //or there is at least one matched
      this.assert(wrongValues.length === 0 || (this.anyOne && wrongValues.length != valueCheckNames.length));
    }
  });

  /**
   * Asserts given object has property `length` with given value `n`
   *
   * @name length
   * @alias Assertion#lengthOf
   * @memberOf Assertion
   * @category assertion property
   * @param {number} n Expected length
   * @param {string} [description] Optional message
   * @example
   *
   * [1, 2].should.have.length(2);
   */
  Assertion.add('length', function(n, description) {
    this.have.property('length', n, description);
  });

  Assertion.alias('length', 'lengthOf');

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Asserts given object has own property. **On success it change given object to be value of property**.
   *
   * @name ownProperty
   * @alias Assertion#hasOwnProperty
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {string} [description] Optional message
   * @example
   *
   * ({ a: 10 }).should.have.ownProperty('a');
   */
  Assertion.add('ownProperty', function(name, description) {
    name = util.convertPropertyName(name);
    this.params = {
      actual: this.obj,
      operator: 'to have own property ' + util.formatProp(name),
      message: description
    };

    this.assert(hasOwnProperty.call(this.obj, name));

    this.obj = this.obj[name];
  });

  Assertion.alias('ownProperty', 'hasOwnProperty');

  /**
   * Asserts given object is empty. For strings, arrays and arguments it checks .length property, for objects it checks keys.
   *
   * @name empty
   * @memberOf Assertion
   * @category assertion property
   * @example
   *
   * ''.should.be.empty;
   * [].should.be.empty;
   * ({}).should.be.empty;
   */
  Assertion.add('empty', function() {
    this.params = {operator: 'to be empty'};

    if(util.length(this.obj) !== void 0) {
      this.obj.should.have.property('length', 0);
    } else {
      var obj = Object(this.obj); // wrap to reference for booleans and numbers
      for(var prop in obj) {
        this.obj.should.not.have.ownProperty(prop);
      }
    }
  }, true);

  /**
   * Asserts given object has exact keys. Compared to `properties`, `keys` does not accept Object as a argument.
   *
   * @name keys
   * @alias Assertion#key
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} [keys] Keys to check
   * @example
   *
   * ({ a: 10 }).should.have.keys('a');
   * ({ a: 10, b: 20 }).should.have.keys('a', 'b');
   * ({ a: 10, b: 20 }).should.have.keys([ 'a', 'b' ]);
   * ({}).should.have.keys();
   */
  Assertion.add('keys', function(keys) {
    if(arguments.length > 1) keys = aSlice.call(arguments);
    else if(arguments.length === 1 && should.type(keys) == should.type.STRING) keys = [keys];
    else if(arguments.length === 0) keys = [];

    keys = keys.map(String);

    var obj = Object(this.obj);

    // first check if some keys are missing
    var missingKeys = [];
    keys.forEach(function(key) {
      if(!hasOwnProperty.call(this.obj, key))
        missingKeys.push(util.formatProp(key));
    }, this);

    // second check for extra keys
    var extraKeys = [];
    Object.keys(obj).forEach(function(key) {
      if(keys.indexOf(key) < 0) {
        extraKeys.push(util.formatProp(key));
      }
    });

    var verb = keys.length === 0 ? 'to be empty' :
    'to have ' + (keys.length === 1 ? 'key ' : 'keys ');

    this.params = {operator: verb + keys.map(util.formatProp).join(', ')};

    if(missingKeys.length > 0)
      this.params.operator += '\n\tmissing keys: ' + missingKeys.join(', ');

    if(extraKeys.length > 0)
      this.params.operator += '\n\textra keys: ' + extraKeys.join(', ');

    this.assert(missingKeys.length === 0 && extraKeys.length === 0);
  });

  Assertion.alias("keys", "key");

  /**
   * Asserts given object has nested property in depth by path. **On success it change given object to be value of final property**.
   *
   * @name propertyByPath
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} properties Properties path to search
   * @example
   *
   * ({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
   */
  Assertion.add('propertyByPath', function(properties) {
    if(arguments.length > 1) properties = aSlice.call(arguments);
    else if(arguments.length === 1 && typeof properties == 'string') properties = [properties];
    else if(arguments.length === 0) properties = [];

    var allProps = properties.map(util.formatProp);

    properties = properties.map(String);

    var obj = should(Object(this.obj));

    var foundProperties = [];

    var currentProperty;
    while(currentProperty = properties.shift()) {
      this.params = {operator: 'to have property by path ' + allProps.join(', ') + ' - failed on ' + util.formatProp(currentProperty)};
      obj = obj.have.property(currentProperty);
      foundProperties.push(currentProperty);
    }

    this.params = {obj: this.obj, operator: 'to have property by path ' + allProps.join(', ')};

    this.obj = obj.obj;
  });
};

},{"../util":40,"should-equal":41}],37:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given string starts with prefix
   * @name startWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abc'.should.startWith('a');
   */
  Assertion.add('startWith', function(str, description) {
    this.params = { operator: 'to start with ' + should.format(str), message: description };

    this.assert(0 === this.obj.indexOf(str));
  });

  /**
   * Assert given string starts with prefix
   * @name endWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abca'.should.endWith('a');
   */
  Assertion.add('endWith', function(str, description) {
    this.params = { operator: 'to end with ' + should.format(str), message: description };

    this.assert(this.obj.indexOf(str, this.obj.length - str.length) >= 0);
  });
};
},{}],38:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util');

module.exports = function(should, Assertion) {
  /**
   * Assert given object is number
   * @name Number
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Number', function() {
    this.params = {operator: 'to be a number'};

    this.have.type('number');
  }, true);

  /**
   * Assert given object is arguments
   * @name arguments
   * @alias Assertion#Arguments
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('arguments', function() {
    this.params = {operator: 'to be arguments'};

    this.have.class('Arguments');
  }, true);

  Assertion.alias('arguments', 'Arguments');

  /**
   * Assert given object has some type using `typeof`
   * @name type
   * @memberOf Assertion
   * @param {string} type Type name
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('type', function(type, description) {
    this.params = {operator: 'to have type ' + type, message: description};

    should(typeof this.obj).be.exactly(type);
  });

  /**
   * Assert given object is instance of `constructor`
   * @name instanceof
   * @alias Assertion#instanceOf
   * @memberOf Assertion
   * @param {Function} constructor Constructor function
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('instanceof', function(constructor, description) {
    this.params = {operator: 'to be an instance of ' + util.functionName(constructor), message: description};

    this.assert(Object(this.obj) instanceof constructor);
  });

  Assertion.alias('instanceof', 'instanceOf');

  /**
   * Assert given object is function
   * @name Function
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Function', function() {
    this.params = {operator: 'to be a function'};

    this.have.type('function');
  }, true);

  /**
   * Assert given object is object
   * @name Object
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Object', function() {
    this.params = {operator: 'to be an object'};

    this.is.not.null.and.have.type('object');
  }, true);

  /**
   * Assert given object is string
   * @name String
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('String', function() {
    this.params = {operator: 'to be a string'};

    this.have.type('string');
  }, true);

  /**
   * Assert given object is array
   * @name Array
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Array', function() {
    this.params = {operator: 'to be an array'};

    this.have.class('Array');
  }, true);

  /**
   * Assert given object is boolean
   * @name Boolean
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Boolean', function() {
    this.params = {operator: 'to be a boolean'};

    this.have.type('boolean');
  }, true);

  /**
   * Assert given object is error
   * @name Error
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Error', function() {
    this.params = {operator: 'to be an error'};

    this.have.instanceOf(Error);
  }, true);

  /**
   * Assert given object is null
   * @name null
   * @alias Assertion#Null
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('null', function() {
    this.params = {operator: 'to be null'};

    this.assert(this.obj === null);
  }, true);

  Assertion.alias('null', 'Null');

  /**
   * Assert given object has some internal [[Class]], via Object.prototype.toString call
   * @name class
   * @alias Assertion#Class
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('class', function(cls) {
    this.params = {operator: 'to have [[Class]] ' + cls};

    this.assert(Object.prototype.toString.call(this.obj) === '[object ' + cls + ']');
  });

  Assertion.alias('class', 'Class');

  /**
   * Assert given object is undefined
   * @name undefined
   * @alias Assertion#Undefined
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('undefined', function() {
    this.params = {operator: 'to be undefined'};

    this.assert(this.obj === void 0);
  }, true);

  Assertion.alias('undefined', 'Undefined');

  /**
   * Assert given object supports es6 iterable protocol (just check
   * that object has property Symbol.iterator, which is a function)
   * @name iterable
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterable', function() {
    this.params = {operator: 'to be iterable'};

    this.obj.should.have.property(Symbol.iterator).which.is.a.Function;
  }, true);

  /**
   * Assert given object supports es6 iterator protocol (just check
   * that object has property next, which is a function)
   * @name iterator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterator', function() {
    this.params = {operator: 'to be iterator'};

    this.obj.should.have.property('next').which.is.a.Function;
  }, true);

  /**
   * Assert given object is a generator object
   * @name generator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('generator', function() {
    this.params = {operator: 'to be generator'};

    this.obj.should.be.iterable
      .and.iterator
      .and.it.is.equal(this.obj[Symbol.iterator]());
  }, true);
};

},{"../util":40}],39:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */


var util = require('./util');

/**
 * Our function should
 *
 * @param {*} obj Object to assert
 * @returns {should.Assertion} Returns new Assertion for beginning assertion chain
 * @example
 *
 * var should = require('should');
 * should('abc').be.a.String;
 */
var should = function should(obj) {
  return (new should.Assertion(obj)).proxied();
};

should.AssertionError = require('./assertion-error');
should.Assertion = require('./assertion');

should.format = require('should-format');
should.type = require('should-type');
should.util = util;

/**
 * Object with configuration.
 * It contains such properties:
 * * `checkProtoEql` boolean - Affect if `.eql` will check objects prototypes
 * * `useOldDeepEqual` boolean - Use old deepEqual implementation, that was copied from node's assert.deepEqual (will be removed in 5.x)
 *
 * @type {Object}
 * @memberOf should
 * @static
 * @example
 *
 * var a = { a: 10 }, b = Object.create(null);
 * b.a = 10;
 *
 * a.should.be.eql(b);
 * //not throws
 *
 * should.config.checkProtoEql = true;
 * a.should.be.eql(b);
 * //throws AssertionError: expected { a: 10 } to equal { a: 10 } (because A and B have different prototypes)
 */
should.config = require('./config');

//Expose should to external world.
exports = module.exports = should;

/**
 * Allow to extend given prototype with should property using given name. This getter will **unwrap** all standard wrappers like `Number`, `Boolean`, `String`.
 * Using `should(obj)` is the equivalent of using `obj.should` with known issues (like nulls and method calls etc).
 *
 * @param {string} [propertyName] Name of property to add. Default is `'should'`.
 * @param {Object} [proto] Prototype to extend with. Default is `Object.prototype`.
 * @memberOf should
 * @returns {{ name: string, descriptor: Object, proto: Object }} Descriptor enough to return all back
 * @static
 * @example
 *
 * var prev = should.extend('must', Object.prototype);
 *
 * 'abc'.must.startWith('a');
 *
 * var should = should.noConflict(prev);
 * should.not.exist(Object.prototype.must);
 */
should.extend = function(propertyName, proto) {
  propertyName = propertyName || 'should';
  proto = proto || Object.prototype;

  var prevDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

  Object.defineProperty(proto, propertyName, {
    set: function() {
    },
    get: function() {
      return should(util.isWrapperType(this) ? this.valueOf() : this);
    },
    configurable: true
  });

  return { name: propertyName, descriptor: prevDescriptor, proto: proto };
};

/**
 * Delete previous extension. If `desc` missing it will remove default extension.
 *
 * @param {{ name: string, descriptor: Object, proto: Object }} [desc] Returned from `should.extend` object
 * @memberOf should
 * @returns {Function} Returns should function
 * @static
 * @example
 *
 * var should = require('should').noConflict();
 *
 * should(Object.prototype).not.have.property('should');
 *
 * var prev = should.extend('must', Object.prototype);
 * 'abc'.must.startWith('a');
 * should.noConflict(prev);
 *
 * should(Object.prototype).not.have.property('must');
 */
should.noConflict = function(desc) {
  desc = desc || prevShould;

  if(desc) {
    delete desc.proto[desc.name];

    if(desc.descriptor) {
      Object.defineProperty(desc.proto, desc.name, desc.descriptor);
    }
  }
  return should;
};

/**
 * Simple utility function for a bit more easier should assertion extension
 * @param {Function} f So called plugin function. It should accept 2 arguments: `should` function and `Assertion` constructor
 * @memberOf should
 * @returns {Function} Returns `should` function
 * @static
 * @example
 *
 * should.use(function(should, Assertion) {
 *   Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' };
 *
 *      this.obj.should.have.property('id').which.is.a.Number;
 *      this.obj.should.have.property('path');
 *  })
 * })
 */
should.use = function(f) {
  f(should, should.Assertion);
  return this;
};

should
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/contain'));


var defaultProto = Object.prototype;
var defaultProperty = 'should';

//Expose api via `Object#should`.
var prevShould = should.extend(defaultProperty, defaultProto);

},{"./assertion":25,"./assertion-error":24,"./config":26,"./ext/assert":28,"./ext/bool":29,"./ext/chain":30,"./ext/contain":31,"./ext/eql":32,"./ext/error":33,"./ext/match":34,"./ext/number":35,"./ext/property":36,"./ext/string":37,"./ext/type":38,"./util":40,"should-format":42,"should-type":43}],40:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var type = require('should-type');

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
exports.isWrapperType = function(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
};

exports.merge = function(a, b) {
  if(a && b) {
    for(var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forEach = function forEach(obj, f, context) {
  if(exports.isGeneratorFunction(obj)) {
    return forEach(obj(), f, context);
  } else if (exports.isGeneratorObject(obj)) {
    var value = obj.next();
    while(!value.done) {
      if(f.call(context, value.value, 'value', obj) === false)
        return;
      value = obj.next();
    }
  } else {
    for(var prop in obj) {
      if(hasOwnProperty.call(obj, prop)) {
        if(f.call(context, obj[prop], prop, obj) === false)
          return;
      }
    }
  }
};

exports.some = function(obj, f, context) {
  var res = false;
  exports.forEach(obj, function(value, key) {
    if(f.call(context, value, key, obj)) {
      res = true;
      return false;
    }
  }, context);
  return res;
};

var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

exports.functionName = function(f) {
  if(f.name) {
    return f.name;
  }
  var name = f.toString().match(functionNameRE)[1];
  return name;
};

var formatPropertyName = require('should-format').formatPropertyName;

exports.formatProp = function(value) {
  return formatPropertyName(String(value));
};


exports.isEmptyObject = function(obj) {
  for(var prop in obj) {
    if(hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

exports.isIndexable = function(obj) {
  var t = type(obj);
  return t == type.ARRAY ||
    t == type.BUFFER ||
    t == type.ARGUMENTS ||
    t == type.ARRAY_BUFFER ||
    t == type.TYPED_ARRAY ||
    t == type.DATA_VIEW ||
    t == type.STRING;
};

exports.length = function(obj) {
  switch(type(obj)) {
    case type.ARRAY_BUFFER:
    case type.TYPED_ARRAY:
    case type.DATA_VIEW:
      return obj.byteLength;

    case type.ARRAY:
    case type.BUFFER:
    case type.ARGUMENTS:
    case type.FUNCTION:
    case type.STRING:
      return obj.length;
  }
};

exports.convertPropertyName = function(name) {
  if(typeof name == 'symbol') {
    return name;
  } else {
    return String(name);
  }
};

exports.isGeneratorObject = function(obj) {
  if(!obj) return false;

  return typeof obj.next == 'function' &&
          typeof obj[Symbol.iterator] == 'function' &&
          obj[Symbol.iterator]() === obj;
};

//TODO find better way
exports.isGeneratorFunction = function(f) {
  if(typeof f != 'function') return false;

  return /^function\s*\*\s*/.test(f.toString());
}
},{"should-format":42,"should-type":43}],41:[function(require,module,exports){
var getType = require('should-type');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function makeResult(r, path, reason, a, b) {
  var o = {result: r};
  if(!r) {
    o.path = path;
    o.reason = reason;
    o.a = a;
    o.b = b;
  }
  return o;
}

var EQUALS = makeResult(true);

function format(msg) {
  var args = arguments;
  for(var i = 1, l = args.length; i < l; i++) {
    msg = msg.replace(/%s/, args[i]);
  }
  return msg;
}

var REASON = {
  PLUS_0_AND_MINUS_0: '+0 is not equal to -0',
  DIFFERENT_TYPES: 'A has type %s and B has type %s',
  NAN_NUMBER: 'NaN is not equal to any number',
  EQUALITY: 'A is not equal to B',
  EQUALITY_PROTOTYPE: 'A and B have different prototypes',
  WRAPPED_VALUE: 'A wrapped value is not equal to B wrapped value',
  FUNCTION_SOURCES: 'function A is not equal to B by source code value (via .toString call)',
  MISSING_KEY: '%s has no key %s',
  CIRCULAR_VALUES: 'A has circular reference that was visited not in the same time as B'
};

function eqInternal(a, b, opts, stackA, stackB, path, fails) {
  var r = EQUALS;

  function result(comparison, reason) {
    var res = makeResult(comparison, path, reason, a, b);
    if(!comparison && opts.collectAllFails) {
      fails.push(res);
    }
    return res;
  }

  function checkPropertyEquality(property) {
    return eqInternal(a[property], b[property], opts, stackA, stackB, path.concat([property]), fails);
  }

  // equal a and b exit early
  if(a === b) {
    // check for +0 !== -0;
    return result(a !== 0 || (1 / a == 1 / b), REASON.PLUS_0_AND_MINUS_0);
  }

  var l, p;

  var typeA = getType(a),
    typeB = getType(b);

  // if objects has different types they are not equals
  if(typeA !== typeB) return result(false, format(REASON.DIFFERENT_TYPES, typeA, typeB));

  switch(typeA) {
    case 'number':
      return (a !== a) ? result(b !== b, REASON.NAN_NUMBER)
        // but treat `+0` vs. `-0` as not equal
        : (a === 0 ? result(1 / a === 1 / b, REASON.PLUS_0_AND_MINUS_0) : result(a === b, REASON.EQUALITY));

    case 'regexp':
      p = ['source', 'global', 'multiline', 'lastIndex', 'ignoreCase'];
      while(p.length) {
        r = checkPropertyEquality(p.shift());
        if(!opts.collectAllFails && !r.result) return r;
      }
      break;

    case 'boolean':
    case 'string':
      return result(a === b, REASON.EQUALITY);

    case 'date':
      if(+a !== +b && !opts.collectAllFails) {
        return result(false, REASON.EQUALITY);
      }
      break;

    case 'object-number':
    case 'object-boolean':
    case 'object-string':
      r = eqInternal(a.valueOf(), b.valueOf(), opts, stackA, stackB, path, fails);
      if(!r.result && !opts.collectAllFails) {
        r.reason = REASON.WRAPPED_VALUE;
        return r;
      }
      break;

    case 'buffer':
      r = checkPropertyEquality('length');
      if(!opts.collectAllFails && !r.result) return r;

      l = a.length;
      while(l--) {
        r = checkPropertyEquality(l);
        if(!opts.collectAllFails && !r.result) return r;
      }

      return EQUALS;

    case 'error':
      p = ['name', 'message'];
      while(p.length) {
        r = checkPropertyEquality(p.shift());
        if(!opts.collectAllFails && !r.result) return r;
      }

      break;
  }

  // compare deep objects and arrays
  // stacks contain references only
  stackA || (stackA = []);
  stackB || (stackB = []);

  l = stackA.length;
  while(l--) {
    if(stackA[l] == a) {
      return result(stackB[l] == b, REASON.CIRCULAR_VALUES);
    }
  }

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  var hasProperty,
    keysComparison,
    key;

  if(typeA === 'array' || typeA === 'arguments' || typeA === 'typed-array') {
    r = checkPropertyEquality('length');
    if(!opts.collectAllFails && !r.result) return r;
  }

  if(typeA === 'array-buffer' || typeA === 'typed-array') {
    r = checkPropertyEquality('byteLength');
    if(!opts.collectAllFails && !r.result) return r;
  }

  if(typeB === 'function') {
    var fA = a.toString(), fB = b.toString();
    r = eqInternal(fA, fB, opts, stackA, stackB, path, fails);
    r.reason = REASON.FUNCTION_SOURCES;
    if(!opts.collectAllFails && !r.result) return r;
  }

  for(key in b) {
    if(hasOwnProperty.call(b, key)) {
      r = result(hasOwnProperty.call(a, key), format(REASON.MISSING_KEY, 'A', key));
      if(!r.result && !opts.collectAllFails) {
        return r;
      }

      if(r.result) {
        r = checkPropertyEquality(key);
        if(!r.result && !opts.collectAllFails) {
          return r;
        }
      }
    }
  }

  // ensure both objects have the same number of properties
  for(key in a) {
    if(hasOwnProperty.call(a, key)) {
      r = result(hasOwnProperty.call(b, key), format(REASON.MISSING_KEY, 'B', key));
      if(!r.result && !opts.collectAllFails) {
        return r;
      }
    }
  }

  stackA.pop();
  stackB.pop();

  var prototypesEquals = false, canComparePrototypes = false;

  if(opts.checkProtoEql) {
    if(Object.getPrototypeOf) {
      prototypesEquals = Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
      canComparePrototypes = true;
    } else if(a.__proto__ && b.__proto__) {
      prototypesEquals = a.__proto__ === b.__proto__;
      canComparePrototypes = true;
    }

    if(canComparePrototypes && !prototypesEquals && !opts.collectAllFails) {
      r = result(prototypesEquals, REASON.EQUALITY_PROTOTYPE);
      r.showReason = true;
      if(!r.result && !opts.collectAllFails) {
        return r;
      }
    }
  }

  if(typeB === 'function') {
    r = checkPropertyEquality('prototype');
    if(!r.result && !opts.collectAllFails) return r;
  }

  return EQUALS;
}

var defaultOptions = {checkProtoEql: true, collectAllFails: false};

function eq(a, b, opts) {
  opts = opts || defaultOptions;
  var fails = [];
  var r = eqInternal(a, b, opts || defaultOptions, [], [], [], fails);
  return opts.collectAllFails ? fails : r;
}

module.exports = eq;

eq.r = REASON;

},{"should-type":43}],42:[function(require,module,exports){
var getType = require('should-type');

function genKeysFunc(f) {
  return function(value) {
    var k = f(value);
    k.sort();
    return k;
  }
}

//XXX add ability to only inspect some paths
var format = function(value, opts) {
  opts = opts || {};

  if(!('seen' in opts)) opts.seen = [];
  opts.keys = genKeysFunc('keys' in opts && opts.keys === false ? Object.getOwnPropertyNames : Object.keys);

  if(!('maxLineLength' in opts)) opts.maxLineLength = 60;
  if(!('propSep' in opts)) opts.propSep = ',';

  var type = getType(value);
  return (format.formats[type] || format.formats['object'])(value, opts);
};

module.exports = format;

format.formats = {};

function add(t, f) {
  format.formats[t] = f;
}

[ 'undefined',  'boolean',  'null'].forEach(function(name) {
  add(name, String);
});

['number', 'boolean'].forEach(function(name) {
  var capName = name.substring(0, 1).toUpperCase() + name.substring(1);
  add('object-' + name, formatObjectWithPrefix(function(value) {
    return '[' + capName + ': ' + format(value.valueOf()) + ']';
  }));
});

add('object-string', function(value, opts) {
  var realValue = value.valueOf();
  var prefix = '[String: ' + format(realValue) + ']';
  var props = opts.keys(value);
  props = props.filter(function(p) {
    return !(p.match(/\d+/) && parseInt(p, 10) < realValue.length);
  });

  if(props.length == 0) return prefix;
  else return formatObject(value, opts, prefix, props);
});

add('regexp', formatObjectWithPrefix(String));

add('number', function(value) {
  if(value === 0 && 1 / value < 0) return '-0';
  return String(value);
});

add('string', function(value) {
  return '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '"') + '\'';
});

add('object', formatObject);

add('array', function(value, opts) {
  var keys = opts.keys(value);
  var len = 0;

  opts.seen.push(value);

  var props = keys.map(function(prop) {
    var desc;
    try {
      desc = Object.getOwnPropertyDescriptor(value, prop) || {value: value[prop]};
    } catch(e) {
      desc = {value: e};
    }

    var f;
    if(prop.match(/\d+/)) {
      f = format(desc.value, opts);
    } else {
      f = formatProperty(desc.value, opts, prop)
    }
    len += f.length;
    return f;
  });

  opts.seen.pop();

  if(props.length === 0) return '[]';

  if(len <= opts.maxLineLength) {
    return '[ ' + props.join(opts.propSep + ' ') + ' ]';
  } else {
    return '[' + '\n' + props.map(addSpaces).join(opts.propSep + '\n') + '\n' + ']';
  }
});

function addSpaces(v) {
  return v.split('\n').map(function(vv) { return '  ' + vv; }).join('\n');
}

function formatObject(value, opts, prefix, props) {
  props = props || opts.keys(value);

  var len = 0;

  opts.seen.push(value);
  props = props.map(function(prop) {
    var f = formatProperty(value, opts, prop);
    len += f.length;
    return f;
  });
  opts.seen.pop();

  if(props.length === 0) return '{}';

  if(len <= opts.maxLineLength) {
    return '{ ' + (prefix ? prefix + ' ' : '') + props.join(opts.propSep + ' ') + ' }';
  } else {
    return '{' + '\n' + (prefix ? prefix + '\n' : '') + props.map(addSpaces).join(opts.propSep + '\n') + '\n' + '}';
  }
}

format.formatPropertyName = function(name, opts) {
  return name.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/) ? name : format(name, opts)
};


function formatProperty(value, opts, prop) {
  var desc;
  try {
    desc = Object.getOwnPropertyDescriptor(value, prop) || {value: value[prop]};
  } catch(e) {
    desc = {value: e};
  }

  var propName = format.formatPropertyName(prop, opts);

  var propValue = desc.get && desc.set ?
    '[Getter/Setter]' : desc.get ?
    '[Getter]' : desc.set ?
    '[Setter]' : opts.seen.indexOf(desc.value) >= 0 ?
    '[Circular]' :
    format(desc.value, opts);

  return propName + ': ' + propValue;
}


function pad2Zero(n) {
  return n < 10 ? '0' + n : '' + n;
}

function pad3Zero(n) {
  return n < 100 ? '0' + pad2Zero(n) : '' + n;
}

function formatDate(value) {
  var to = value.getTimezoneOffset();
  var absTo = Math.abs(to);
  var hours = Math.floor(absTo / 60);
  var minutes = absTo - hours * 60;
  var tzFormat = 'GMT' + (to < 0 ? '+' : '-') + pad2Zero(hours) + pad2Zero(minutes);
  return value.toLocaleDateString() + ' ' + value.toLocaleTimeString() + '.' + pad3Zero(value.getMilliseconds()) + ' ' + tzFormat;
}

function formatObjectWithPrefix(f) {
  return function(value, opts) {
    var prefix = f(value);
    var props = opts.keys(value);
    if(props.length == 0) return prefix;
    else return formatObject(value, opts, prefix, props);
  }
}

add('date', formatObjectWithPrefix(formatDate));

var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

function functionName(f) {
  if(f.name) {
    return f.name;
  }
  var name = f.toString().match(functionNameRE)[1];
  return name;
}

add('function', formatObjectWithPrefix(function(value) {
  var name = functionName(value);
  return '[Function' + (name ? ': ' + name : '') + ']';
}));

add('error', formatObjectWithPrefix(function(value) {
  var name = value.name;
  var message = value.message;
  return '[' + name + (message ? ': ' + message : '') + ']';
}));

function generateFunctionForIndexedArray(lengthProp, name) {
  return function(value) {
    var str = '';
    var max = 50;
    var len = value[lengthProp];
    if(len > 0) {
      for(var i = 0; i < max && i < len; i++) {
        var b = value[i] || 0;
        str += ' ' + pad2Zero(b.toString(16));
      }
      if(len > max)
        str += ' ... ';
    }
    return '[' + (value.constructor.name || name) + (str ? ':' + str : '') + ']';
  }
}

add('buffer', generateFunctionForIndexedArray('length', 'Buffer'));

add('array-buffer', generateFunctionForIndexedArray('byteLength'));

add('typed-array', generateFunctionForIndexedArray('byteLength'));

add('promise', function(value) {
  return '[Promise]';
});

add('xhr', function(value) {
  return '[XMLHttpRequest]';
});

add('html-element', function(value) {
  return value.outerHTML;
});

add('html-element-text', function(value) {
  return value.nodeValue;
});

add('document', function(value) {
  return value.documentElement.outerHTML;
});

add('window', function(value) {
  return '[Window]';
});
},{"should-type":43}],43:[function(require,module,exports){
(function (Buffer){
var toString = Object.prototype.toString;

var types = {
  NUMBER: 'number',
  UNDEFINED: 'undefined',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  FUNCTION: 'function',
  NULL: 'null',
  ARRAY: 'array',
  REGEXP: 'regexp',
  DATE: 'date',
  ERROR: 'error',
  ARGUMENTS: 'arguments',
  SYMBOL: 'symbol',
  ARRAY_BUFFER: 'array-buffer',
  TYPED_ARRAY: 'typed-array',
  DATA_VIEW: 'data-view',
  MAP: 'map',
  SET: 'set',
  WEAK_SET: 'weak-set',
  WEAK_MAP: 'weak-map',
  PROMISE: 'promise',

  WRAPPER_NUMBER: 'object-number',
  WRAPPER_BOOLEAN: 'object-boolean',
  WRAPPER_STRING: 'object-string',

// node buffer
  BUFFER: 'buffer',

// dom html element
  HTML_ELEMENT: 'html-element',
  HTML_ELEMENT_TEXT: 'html-element-text',
  DOCUMENT: 'document',
  WINDOW: 'window',
  FILE: 'file',
  FILE_LIST: 'file-list',
  BLOB: 'blob',

  XHR: 'xhr'
};

module.exports = function getType(instance) {
  var type = typeof instance;

  switch(type) {
    case types.NUMBER:
      return types.NUMBER;
    case types.UNDEFINED:
      return types.UNDEFINED;
    case types.STRING:
      return types.STRING;
    case types.BOOLEAN:
      return types.BOOLEAN;
    case types.FUNCTION:
      return types.FUNCTION;
    case types.SYMBOL:
      return types.SYMBOL;
    case types.OBJECT:
      if(instance === null) return types.NULL;

      var clazz = toString.call(instance);

      switch(clazz) {
        case '[object String]':
          return types.WRAPPER_STRING;
        case '[object Boolean]':
          return types.WRAPPER_BOOLEAN;
        case '[object Number]':
          return types.WRAPPER_NUMBER;
        case '[object Array]':
          return types.ARRAY;
        case '[object RegExp]':
          return types.REGEXP;
        case '[object Error]':
          return types.ERROR;
        case '[object Date]':
          return types.DATE;
        case '[object Arguments]':
          return types.ARGUMENTS;
        case '[object Math]':
          return types.OBJECT;
        case '[object JSON]':
          return types.OBJECT;
        case '[object ArrayBuffer]':
          return types.ARRAY_BUFFER;
        case '[object Int8Array]':
          return types.TYPED_ARRAY;
        case '[object Uint8Array]':
          return types.TYPED_ARRAY;
        case '[object Uint8ClampedArray]':
          return types.TYPED_ARRAY;
        case '[object Int16Array]':
          return types.TYPED_ARRAY;
        case '[object Uint16Array]':
          return types.TYPED_ARRAY;
        case '[object Int32Array]':
          return types.TYPED_ARRAY;
        case '[object Uint32Array]':
          return types.TYPED_ARRAY;
        case '[object Float32Array]':
          return types.TYPED_ARRAY;
        case '[object Float64Array]':
          return types.TYPED_ARRAY;
        case '[object DataView]':
          return types.DATA_VIEW;
        case '[object Map]':
          return types.MAP;
        case '[object WeakMap]':
          return types.WEAK_MAP;
        case '[object Set]':
          return types.SET;
        case '[object WeakSet]':
          return types.WEAK_SET;
        case '[object Promise]':
          return types.PROMISE;
        case '[object Window]':
          return types.WINDOW;
        case '[object HTMLDocument]':
          return types.DOCUMENT;
        case '[object Blob]':
          return types.BLOB;
        case '[object File]':
          return types.FILE;
        case '[object FileList]':
          return types.FILE_LIST;
        case '[object XMLHttpRequest]':
          return types.XHR;
        case '[object Text]':
          return types.HTML_ELEMENT_TEXT;
        default:
          if((typeof Promise === types.FUNCTION && instance instanceof Promise) || (getType(instance.then) === types.FUNCTION && instance.then.length >= 2)) {
            return types.PROMISE;
          }

          if(typeof Buffer !== 'undefined' && instance instanceof Buffer) {
            return types.BUFFER;
          }

          if(/^\[object HTML\w+Element\]$/.test(clazz)) {
            return types.HTML_ELEMENT;
          }

          if(clazz === '[object Object]') {
            return types.OBJECT;
          }
      }
  }
};

Object.keys(types).forEach(function(typeName) {
  module.exports[typeName] = types[typeName];
});

}).call(this,require("buffer").Buffer)
},{"buffer":20}]},{},[1,2,3,4,5,6,7,8,9]);
