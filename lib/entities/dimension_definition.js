var Unit = require('../entities/unit.js'),
	helpers = require('../../lib/helpers.js');

var DimensionDefinition = (function () {
	function DimensionDefinitionImpl(key, config) {
		validate(key, config);
		var self = this;
		this.key = key;
		this.name = config.name;
		this.symbol = config.symbol;
		this.otherNames = config.otherNames || [];
		this.otherSymbols = config.otherSymbols || [];
		this.baseUnitName = config.baseUnit;
		this.derivedString = config.derived;
		this.vector = config.vector;
		this.dimensionless = config.dimensionless;
		this.inheritedUnits = config.inheritedUnits;
		this.units = {};
		helpers.forEach(config.units, function (unitConfig, key) {
			self.units[key] = new Unit(key, unitConfig, self);
		});
		this.baseUnit = this.units[config.baseUnit];
		this.derived = [];
		this.updateDerived();
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Exception('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Exception('dimension key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Exception('dimension config must be an object');
		}
	}

	DimensionDefinitionImpl.prototype.type = function () {
		return 'DimensionDefinition';
	}

	DimensionDefinitionImpl.prototype.isDerived = function () {
		return (this.derived.length == 0);
	}

	DimensionDefinitionImpl.prototype.updateDerived = function() {
		// TODO
	}

	// FIND

	DimensionDefinitionImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, helpers.isArrayMatch, value, ignoreCase);
	}

	DimensionDefinitionImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, helpers.isArrayPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(dimDef, func, listFunc, value, ignoreCase) {
		return func(dimDef.key, value, ignoreCase)
			|| func(dimDef.name, value, ignoreCase)
			|| func(dimDef.symbol, value, ignoreCase)
			|| listFunc(dimDef.otherNames, value, ignoreCase)
			|| listFunc(dimDef.otherSymbols, value, ignoreCase);
	}

	return DimensionDefinitionImpl;
}());

module.exports = DimensionDefinition;
