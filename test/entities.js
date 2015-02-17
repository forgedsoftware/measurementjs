/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	Unit = require('../lib/entities/unit.js'),
	DimensionDefinition = require('../lib/entities/dimension_definition.js'),
	should = require('should');

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