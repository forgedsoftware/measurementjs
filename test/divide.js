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
