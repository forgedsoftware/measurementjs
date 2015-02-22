/*jslint node: true */
'use strict';

var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js');

// TODO
	// Add the following functions:
	//  - toBaseDimensionDefinitions
	//  - matchDimensions
	// And populate findPrefix

var Dimension = (function () {

	var DEFAULT_POWER = 1;

	// Constructors
	
	function DimensionImpl(paramA, paramB, paramC, paramD) {
		if (helpers.isString(paramA) && helpers.isString(paramB)) {
			constructWithUnitNameAndDimensionName(this, paramA, paramB, paramC, paramD);
		} else if (helpers.isString(paramA)) {
			constructWithUnitName(this, paramA, paramB, paramC)
		} else if (paramA.class && paramA.class() == 'Unit') {
			constructWithUnit(this, paramA, paramB, paramC);
		} else {
			throw new Error('Invalid parameters provided');
		}
	}

	function constructWithUnit(dim, unit, power, prefix) {
		// Unit
		if (!unit) {
			throw new Error('Dimension requires a valid unit');
		}
		dim.unit = unit;

		// Power
		if (!power && power !== 0) {
			power = DEFAULT_POWER;
		}
		dim.power = power;

		// Prefix
		dim.prefix = null;
		if (prefix) {
			if (helpers.isString(prefix)) {
				dim.prefix = measurement.findPrefix(prefix);
			} else if (prefix.class() == 'Prefix') {
				dim.prefix = prefix;
			} else {
				throw new Error('Invalid type of prefix supplied');
			}
		}
	}

	// Helper Constructors

	function constructWithUnitName(dim, unitName, power, prefix) {
		// Allows d('metre', -1, 'kilo');
		var unit = measurement.findUnit(unitName);
		constructWithUnit(dim, unit, power, prefix);
	}

	function constructWithUnitNameAndDimensionName(dim, unitName, dimName, power, prefix) {
		var foundPrefix = measurement.findPrefix(dimName);
		if (foundPrefix) {
			// Allows d('metre', 'kilo'); or d('amp', 'milli', -1);
			constructWithUnitName(dim, unitName, power, foundPrefix);
		} else {
			// Allows d('metre', 'length', 1, 'kilo')
			var unit = measurement.findUnit(unitName, dimName);
			constructWithUnit(dim, unit, power, prefix);
		}
	}

	// Type Checking

	DimensionImpl.prototype.class = function () {
		return 'Dimension';
	}

	function isDimension (value) {
		return (value.class && helpers.isFunction(value.class) && value.class() == 'Dimension');
	}

	// Conversion

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convert = function (value, unit, prefix) {
		var dimValuePair = this.convertToBase();
		return dimValuePair.dimension.convertFromBase(dimValuePair.value, unit, prefix);
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertToBase = function (value) {
		var baseUnit;

		if (this.unit.isBaseUnit() && !this.prefix) {
			return {
				dimension: this.clone(),
				value: value
			};
		}
		baseUnit = this.unit.dimension.baseUnit;
		if (!baseUnit) {
			throw new Error('Base unit could not be found!');
		}
		return {
			value: doConvert(value, this.unit, this.prefix, this.power, true),
			dimension: new Dimension(baseUnit, this.power)
		};
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertFromBase = function (value, unit, prefix) {
		if (!unit) {
			throw new Error('A unit to convert into must be provided');
		}
		if (!this.unit.isBaseUnit()) {
			throw new Error('Existing unit is not base unit');
		}
		if (this.prefix) {
			throw new Error('A dimension as a base may not have a prefix');
		}

		return {
			value: (unit.isBaseUnit()) ? value : doConvert(value, unit, prefix, this.power, false),
			dimension: new Dimension(unit, this.power, prefix)
		};
	};

	function doConvert(value, unit, prefix, power, toBase) {
		var pow, calculatedValue;

		calculatedValue = value;
		for (pow = 0; pow < Math.abs(power); pow++) {
			if (prefix != null) {
				calculatedValue = toBase ? prefix.remove(calculatedValue) : prefix.apply(calculatedValue);
			}
			if (toBase ? (power > 0) : (power < 0)) {
				calculatedValue = (calculatedValue * unit.multiplier) + unit.offset; // TODO dimensionality with offsets may not work with compound dimensions.
			} else {
				calculatedValue = (calculatedValue - unit.offset) / unit.multiplier; // TODO dimensionality with offsets may not work with compound dimensions.
			}
		}
		return calculatedValue;
	}

	// General Operations

	DimensionImpl.prototype.isCommensurableMatch = function (dimension) {
		if (!isDimension(dimension)) {
			throw new Error('Provided parameter must be a Dimension');
		}
		return this.unit.dimension.key === dimension.unit.dimension.key &&
			this.power === dimension.power;
	};

	DimensionImpl.prototype.combine = function (value, otherDimension) {
		var dimValuePair, aggregatePower, computedValue;

		if (!isDimension(otherDimension)) {
			throw new Error ('The other dimension must be a dimension');
		}
		if (this.unit.dimension.key !== otherDimension.unit.dimension.key) {
			throw new Error('Dimensions must have the same system to combine');
		}

		// Do conversion if necessary
		if (this.unit.key !== otherDimension.unit.key) {
			dimValuePair = otherDimension.convert(value, this.unit, this.prefix);
			computedValue = dimValuePair.value;
			aggregatePower = this.power + dimValuePair.dimension.power;
		} else {
			computedValue = value;
			aggregatePower = this.power + otherDimension.power;
		}

		return {
			value: computedValue,
			dimension: new Dimension(this.unit, aggregatePower)
		};
	};

	// Prefixes

	DimensionImpl.prototype.canApplyPrefix = function () {
		return (unit.type == 'binary' || unit.type == 'si');
	};

	DimensionImpl.prototype.applyPrefix = function (value) {
		var dim, prefix, computedValue;

		dim = this.clone();
		if (dim.prefix) {
			dimValuePair = dim.removePrefix(value);
			dim = dimValuePair.dimension;
			computedValue = dimValuePair.value;
		} else {
			computedValue = value;
		}

		prefix = dim.findPrefix(value);
		if (prefix) {
			dim.prefix = prefix;
			computedValue = prefix.apply(computedValue);
		}
		return {
			value: computedValue,
			dimension: dim
		};
	};

	DimensionImpl.prototype.findPrefix = function (value) {
		// TODO
	}

	DimensionImpl.prototype.removePrefix = function (value) {
		var dim, computedValue;

		dim = this.clone();
		if (dim.prefix) {
			computedValue = dim.prefix.remove(value);
			dim.prefix = null;
		}
		return {
			value: computedValue,
			dimension: dim
		};
	}

	// Helper Functions

	DimensionImpl.prototype.clone = function () {
		return new Dimension(this.unit, this.power, this.prefix);
	};

	DimensionImpl.prototype.invert = function () {
		return new Dimension(this.unit, -this.power, this.prefix);
	};

	DimensionImpl.prototype.serialised = function () {
		var obj = {
			unitName: this.unit.key,
			dimensionName: this.unit.dimension.key,
			power: this.power
		};
		if (this.prefix) {
			obj.prefix = this.prefix.key;
		}
	};

	DimensionImpl.prototype.toJson = function () {
		return JSON.stringify(this.serialised());
	};

	DimensionImpl.prototype.format = function (config, isPlural) {
		var name, dimensionString;

		if (config.textualDescription) {
			var dimParts = [];
			if (this.power < 0) {
				dimParts.push('per'); // TODO - i18n
			}
			name = pluralizedName(this.unit, isPlural);
			if (this.prefix) {
				name = prefix.key + name;
			}
			dimParts.push(name);
			var absPower = Math.abs(this.power);
			if (absPower === 2) {
				dimParts.push('squared'); // TODO - i18n
			} else if (absPower === 3) {
				dimParts.push('cubed'); // TODO - i18n
			} else if (absPower > 3) {
				dimParts.push('to the power of ' + absPower); // TODO - i18n
			}
			dimensionString = dimParts.join(' ');
		} else {
			if (this.prefix) {
				dimensionString += this.prefix.symbol;
			}
			dimensionString = (this.unit.symbol) ? this.unit.symbol : pluralizedName(this.unit, isPlural);
			if (config.showAllPowers || this.power !== DEFAULT_POWER) {
				var powerStr = (config.asciiOnly) ? '^' + this.power : helpers.toSuperScript(this.power);
				dimensionString += powerStr;
			}
		}
		return dimensionString;
	};

	function pluralizedName(unit, isPlural) {
		return (isPlural && unit.plural && unit.plural.length > 0) ? unit.plural : unit.name;
	}

	return DimensionImpl;
}());

module.exports = Dimension;
