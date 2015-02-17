
var helpers = require('../../lib/helpers.js');

var Unit = (function () {
	function UnitImpl(key, config, dimension) {
		validate(key, config, dimension);
		this.key = key;
		this.name = config.name;
		this.plural = config.plural;
		this.type = config.type;
		this.symbol = config.symbol;
		this.multiplier = config.multiplier;
		this.rare = config.rare;
		this.estimation = config.estimation;
		this.prefixName = config.prefixName;
		this.prefixFreeName = config.prefixFreeName;
		this.otherNames = config.otherNames || [];
		this.otherSymbols = config.otherSymbols || [];
		this.systemNames = config.systems || [];
		this.dimension = dimension;
		this.systems = {};
	}

	function validate(key, config, dimension) {
		if (!key || !config || !dimension) {
			throw new Exception('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Exception('unit key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Exception('unit config must be an object');
		}
		if(dimension.type() != 'DimensionDefinition') {
			throw new Exception('dimension must be a DimensionDefinition');
		}
	}

	UnitImpl.prototype.type = function () {
		return 'Unit';
	}

	UnitImpl.prototype.isBaseUnit = function () {
		return (this.dimension.baseUnit.key === this.key);
	}

	UnitImpl.prototype.updateMeasurementSystems = function (allSystems) {
		var self = this;
		helpers.forEach(this.systemNames, function (name) {
			self.systems[name] = allSystems[name];
		});
	}

	// FIND

	UnitImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, helpers.isArrayMatch, value, ignoreCase);
	}

	UnitImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, helpers.isArrayPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(unit, func, listFunc, value, ignoreCase) {
		return func(unit.key, value, ignoreCase)
			|| func(unit.name, value, ignoreCase)
			|| func(unit.plural, value, ignoreCase)
			|| func(unit.symbol, value, ignoreCase)
			|| listFunc(unit.otherNames, value, ignoreCase)
			|| listFunc(unit.otherSymbols, value, ignoreCase);
	}

	return UnitImpl;
}());

module.exports = Unit;
