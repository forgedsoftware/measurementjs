
var helpers = require('../../lib/helpers.js');

var MeasurementSystem = (function () {
	function MeasurementSystemImpl(key, config) {
		validate(key, config);
		this.key = key;
		this.name = config.name;
		this.historical = config.historical;
		this.inherits = config.inherits;
		this.parent = null;
		this.children = {};
		this.units = {}; // TODO
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Exception('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Exception('measurement system key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Exception('measurement system config must be an object');
		}
	}

	MeasurementSystemImpl.prototype.type = function () {
		return 'MeasurementSystem';
	}

	// TREE FUNCTIONS

	MeasurementSystemImpl.prototype.isRoot = function () {
		return !this.parent;
	}

	MeasurementSystemImpl.prototype.ancestors = function () {
		var ancestors = [this];
		if (!this.isRoot()) {
			ancestors = ancestors.concat(this.parent.ancestors());
		}
		return ancestors;
	}

	// FIND

	MeasurementSystemImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, value, ignoreCase);
	}

	MeasurementSystemImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(system, func, value, ignoreCase) {
		return func(system.key, value, ignoreCase)
			|| func(system.name, value, ignoreCase);
	}

	return MeasurementSystemImpl;
}());

module.exports = MeasurementSystem;

