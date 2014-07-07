/*jslint node: true */
'use strict';

var m = require('../built/measurement_full.js'),
	should = require('should');

var DELTA = 1e-8;

test('create a basic scalar', function () {
	m(2).should.have.property('dimensions').with.lengthOf(0);
	m(2).should.have.property('value', 2);
});

test('creating a scalar quantity with NaN should be valid', function () {
	m(Number.NaN).value.should.be.NaN;
});

test('test multiplying scalars', function () {
	m(2).multiply(3).should.have.property('value', 6);
	m(-3).multiply(-4).should.have.property('value', 12);
	m(6).multiply(-5).should.have.property('value', -30);
	m(-2.345).multiply(4.0392).value.should.be.approximately(-9.4719240, DELTA);
});

test('test dividing scalars', function () {
	m(2).divide(4).should.have.property('value', 0.5);
	m(150).divide(10).should.have.property('value', 15);
	m(110).divide(-5).should.have.property('value', -22);
	m(-81).divide(-9).should.have.property('value', 9);
	m(-2.345).divide(4.0392).value.should.be.approximately(-0.58056050703, DELTA);
});

test('test adding scalars', function () {
	m(2).add(3).should.have.property('value', 5);
	m(-10).add(20).should.have.property('value', 10);
	m(-10).add(-20).should.have.property('value', -30);
	m(-5.4567).add(5.4567).should.have.property('value', 0);
});

test('test subtracting scalars', function () {
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

test('js math library with no params using scalars', function () {
	m(4).abs().should.have.property('value', 4);
	m(-4).abs().should.have.property('value', 4);
	m(0.1).acos().value.should.be.approximately(1.4706289056333368, DELTA);
	m(2).exp().value.should.be.approximately(7.38905609893065, DELTA);
	m(9).sqrt().should.have.property('value', 3);
});

test('js math library with params using scalars', function () {
	m(9).atan2(2).value.should.be.approximately(0.21866894587394195, DELTA);

	m(2).pow().value.should.be.NaN;
	m(2).pow(4).should.have.property('value', 16);

	m(2.45).max(1,2,3,4,5,6).should.have.property('value', 6);
	m(9).max(1,2,3,4,5,6).should.have.property('value', 9);

	m(-3).min(1,2,3,4,5,6).should.have.property('value', -3);
	m(9).min(1,2,3,4,5,6).should.have.property('value', 1);
});

test('chaining scalar math', function () {
	m(-4).add(1).abs().multiply(3).times(2).divide(9).should.have.property('value', 2);
});

test('simplify on scalar quantities should return same value', function () {
	m(10).simplify().should.have.property('value', 10);
	m(-5.454).simplify().should.have.property('value', -5.454);
});

test('serialising scalars should produce sensible result', function () {
	m(-12).serialised().should.eql({ value: -12 });
	m(2).toJson().should.equal('{"value":2}');
});

test('isScalar method should only be true if a scalar', function () {
	m(10).isScalar().should.be.true;
	m(-4).isScalar().should.be.true;
	m(10, 'metre').isScalar().should.be.false;
});
