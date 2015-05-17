/*jslint node: true */
'use strict';

var Unit = require('../entities/unit.js'),
	helpers = require('../../lib/helpers.js'),
	measurement = require('../../lib/measurement.js');

var DimensionDefinition = (function () {
	function DimensionDefinitionImpl(key, config, units) {
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
		this.inheritedUnits = config.inheritedUnits; // TODO handle these!!!
		if (units) {
			this.units = units;
		} else {
			this.units = {};
			helpers.forEach(config.units, function (unitConfig, key) {
				self.units[key] = new Unit(key, unitConfig, self);
			});
		}
		this.baseUnit = this.units[config.baseUnit];
		this.derived = [];
		this._config = config;
		this.updateDerived();
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('dimension key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('dimension config must be an object');
		}
	}

	DimensionDefinitionImpl.prototype.class = function () {
		return 'DimensionDefinition';
	}

	DimensionDefinitionImpl.prototype.isDerived = function () {
		return (this.derived.length > 0);
	}

	DimensionDefinitionImpl.prototype.updateDerived = function() {
		var self = this;
		this.derived = [];
		if (!this.derivedString || this.derivedString.length == 0) {
			return;
		}
		var matches = this.derivedString.match(/(^\w+|([\*|/])(\w+))/g);
		helpers.forEach(matches, function (match, index) {
			var type = '*';
			var dimName = match;
			if (index > 0) {
				type = match.substring(0, 1);
				dimName = match.substring(1);
			}
			if (dimName !== '1') { // '1' is a placeholder
				var baseUnit = measurement.findBaseUnit(dimName);
				if (!baseUnit) {
					throw new Error('Base unit for dimension \'' + dimName + '\' could not be found');
				}
				if (type !== '*' && type !== '/') {
					throw new Error('Unknown type \'' + type + '\' found');
				}
				var power = (type === '*') ? 1 : -1;
				self.derived.push(new measurement.Dimension(baseUnit, power));
			}
		});
		// TODO - Simplify result!!!
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

	// CLONE

	DimensionDefinitionImpl.prototype.clone = function () {
		return new DimensionDefinition(this.key, this._config, this.units);
	}

	// SERIALIZE

	DimensionDefinitionImpl.prototype.serialize = function (isVerbose) {
		var dDefinition = {
			key: this.key,
			name: this.name,
			symbol: this.symbol,
			baseUnitKey: this.baseUnitName,
		};

		if (this.derivedString) { dDefinition.derived = this.derivedString; };
		if (this.otherNames && this.otherNames.length > 0) { dDefinition.otherNames = this.otherNames; }
		if (this.otherSymbols && this.otherSymbols.length > 0) { dDefinition.otherSymbols = this.otherSymbols; }
		if (this.vector) { dDefinition.vector = this.vector; }
		if (this.dimensionless) { dDefinition.dimensionless = this.dimensionless; }
		if (this.inheritedUnits) { dDefinition.inheritedUnitsFrom = this.inheritedUnits; }
		if (this.units && Object.keys(this.units).length > 0) {
			if (isVerbose) {
				dDefinition.units = {};
				helpers.forEach(this.units, function (unit, key) {
					dDefinition.units[key] = unit.serialize();
				});
			} else {
				dDefinition.units = Object.keys(this.units);
			}
		}

		return dDefinition;
	}

	return DimensionDefinitionImpl;
}());

module.exports = DimensionDefinition;
