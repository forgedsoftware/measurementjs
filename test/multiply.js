/*jslint node: true */
/* global suite */
/* global test */
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
