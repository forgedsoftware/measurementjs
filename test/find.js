/*jslint node: true */
'use strict';

var m = require('../lib/measurement.js'),
	should = require('should');

test('basic find unit', function () {
	should.not.exist(m.findUnit('xyz'));
	m.findUnit('metre').key.should.equal('metre');
	m.findUnit('metre').dimension.key.should.equal('length');
});
