/*jslint node: true */
'use strict';

var m = require('../measurement.js'),
	should = require('should');

var DELTA = 1e-8;

test('construct quantity with system', function () {
	m(12, 'length', 'metre').should.have.property('value', 12);
	m(12, 'length', 'metre').should.have.property('systemName', 'length');
	m(12, 'length', 'metre').should.have.property('dimensions').with.lengthOf(1);
	m(12, 'length', 'metre').serialised().should.eql(JSON.parse('{\"value\":12,\"system\":\"length\",\"unit\":\"metre\"}'));
});

test('construct quantity without system', function () {
	m(12, 'metre').should.have.property('value', 12);
	m(12, 'metre').should.have.property('systemName', 'length');
	m(12, 'metre').should.have.property('dimensions').with.lengthOf(1);
	m(12, 'metre').serialised().should.eql(JSON.parse('{\"value\":12,\"system\":\"length\",\"unit\":\"metre\"}'));
});

test('construct quantity with multiple dimensions', function () {
	var q1 = m(12, [ { unit: 'metre', system: 'length' }, { unit: 'second', system: 'time' }]);

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

	cQuantity = m(280, 'temperature', 'kelvin');
	kQuantity = cQuantity.convert('celsius');
	kQuantity.value.should.be.approximately(6.85, DELTA);
});

test('conversion from unit to other unit', function () {

	m(15, 'time', 'hour').convert('minute').value.should.equal(15 * 60);
	m(0, 'temperature', 'celsius').convert('fahrenheit').value.should.be.approximately(32, DELTA);
});

test('formatting of units when printed in short form', function () {

	m(15, 'time', 'hour').toShortFixed().should.equal('15 h');

	m(15.23425463237, 'temperature', 'celsius').toShortFixed().should.equal('15 C');
	m(9.45456, 'temperature', 'fahrenheit').toShortPrecision().should.equal('9.45456 F');

	m(456.1315454, 'temperature', 'fahrenheit').toShortFixed(2).should.equal('456.13 F');
	m(1.6456113, 'temperature', 'fahrenheit').toShortFixed(3).should.equal('1.646 F');
	m(1.6456113, 'temperature', 'fahrenheit').toShortPrecision(3).should.equal('1.65 F');
});

test('can create a new quantity from a json string', function () {

	m('{ \"value\": 25, \"system\": \"time\", \"unit\":\"month\"}').toShortFixed().should.equal('25 month');
});

test('json string used to create quantity equivalent to json string from serialising quantity', function () {
	var json, cQuantity;

	json = '{ \"value\": 25, \"system\": \"time\", \"unit\":\"month\"}';
	JSON.parse(m(json).toJson()).should.eql(JSON.parse(json));
});

// SIMPLIFY DIMENSIONS

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

	q1 = m(12, [ { unit: 'second' }, { unit: 'second', power: -1 }, 'metre' ]);
	q1.should.have.property('value', 12);
	q1.should.have.property('dimensions').with.lengthOf(3);

	q2 = q1.simplify();
	q2.should.have.property('dimensions').with.lengthOf(1);
	q2.dimensions[0].should.have.property('power', 1);
	q2.dimensions[0].should.have.property('unitName', 'metre');
});
