/*jslint node: true */
'use strict';

var m = require('../built/measurement_full.js'),
	should = require('should');

var DELTA = 1e-8;

test('simple add with no units', function () {
	m(10).add(m(5)).should.have.property('value', 15);
	m(-10).add(m(-5)).should.have.property('value', -15);
});

test('simple add with different single units should produce error', function () {
	(function () {
		m(10, 'metre').add(m(5, 'second'));
	}).should.throw("In order to convert based upon a quantity they must be commensurable");
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
	q1.dimensions[0].should.have.property('unitName', 'second');
	q1.dimensions[0].should.have.property('power', 1);
});

test('simple add of a smaller unit in the same system should add correctly', function () {
	var q1 = m(2, 'hour').add(m(30, 'minute'));

	q1.should.have.property('value', 2.5);
	q1.should.have.property('dimensions').with.lengthOf(1);
	q1.dimensions[0].should.have.property('unitName', 'hour');
	q1.dimensions[0].should.have.property('power', 1);
});
