/*jslint node: true */
'use strict';

var m = require('../measurement.js'),
	should = require('should');

var DELTA = 1e-8;

test('construct quantity', function () {

	m(12, 'length', 'metre').serialised().should.eql(JSON.parse('{\"value\":12,\"system\":\"length\",\"unit\":\"metre\"}'));
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

	cQuantity = m(280, 'temperature', 'kelvin').subtract(m(280, 'temperature', 'kelvin'));
});