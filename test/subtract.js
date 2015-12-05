/*jslint node: true */
/* global suite */
/* global test */
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
