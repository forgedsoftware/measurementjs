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
