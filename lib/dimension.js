
var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js');

var Dimension = (function () {

	var DEFAULT_POWER = 1;

	// Constructors
	
	function DimensionImpl(paramA, paramB, paramC, paramD) {
		if (helpers.isString(paramA) && helpers.isString(paramB)) {
			constructWithUnitNameAndSystemName(this, paramA, paramB, paramC, paramD);
		} else if (helpers.isString(paramA)) {
			constructWithUnitName(this, paramA, paramB, paramC)
		} else if (paramA.type && paramA.type() == 'Unit') {
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
		if (!power) {
			power = DEFAULT_POWER;
		}
		dim.power = power;

		// Prefix
		dim.prefix = null;
		if (prefix) {
			if (helpers.isString(prefix)) {
				dim.prefix = measurement.findPrefix(prefix);
			} else if (prefix.type() == 'Prefix') {
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

	function constructWithUnitNameAndSystemName(dim, unitName, systemName, power, prefix) {
		var foundPrefix = measurement.findPrefix(systemName);
		if (foundPrefix) {
			// Allows d('metre', 'kilo'); or d('amp', 'milli', -1);
			constructWithUnitName(dim, unitName, power, foundPrefix);
		} else {
			// Allows d('metre', 'length', 1, 'kilo')
			var unit = measurement.findUnit(unitName, systemName);
			constructWithUnit(dim, unit, power, prefix);
		}
	}

	// Type Checking

	DimensionImpl.prototype.type = function () {
		return 'Dimension';
	}

	// Conversion

	DimensionImpl.prototype.unitIsBaseUnit = function () {
		return (measurement.system(this.systemName).baseUnit === this.unitName);
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convert = function (value, unitName) {
		var dimValuePair = this.convertToBase();
		return dimValuePair.dimension.convertFromBase(dimValuePair.value, unitName);
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertToBase = function (value) {
		var unit, baseUnitName, baseUnit, newValue;

		if (this.unitIsBaseUnit()) {
			return {
				dimension: this.clone(),
				value: value
			};
		}
		unit = measurement.unit(this.systemName, this.unitName);
		baseUnitName = measurement.system(this.systemName).baseUnit;
		// Here to validate baseUnit exists
		baseUnit = measurement.unit(this.systemName, baseUnitName);

		return {
			dimension: new Dimension(this.systemName, baseUnitName, this.power),
			value: doConvert(value, this.power, unit, true)
		};
	};

	// Returns dimension-value pair: { dimension: {}, value: 123 }
	DimensionImpl.prototype.convertFromBase = function (value, unitName) {
		var unit, newValue;

		if (!this.unitIsBaseUnit()) {
			throw new Error("The existing unit is not a base unit");
		}
		unit = measurement.unit(this.systemName, unitName);

		return {
			dimension: new Dimension(this.systemName, unitName, this.power),
			value: doConvert(value, this.power, unit, false)
		};
	};

	function doConvert(value, power, unit, toBase) {
		var pow, calculatedValue;

		calculatedValue = value;
		for (pow = 0; pow < Math.abs(power); pow++) {
			if (toBase ? (power > 0) : (power < 0)) {
				calculatedValue = (calculatedValue * unit.multiplier) + unit.offset; // TODO dimensionality with offsets may not work with compound dimensions.
			} else {
				calculatedValue = (calculatedValue - unit.offset) / unit.multiplier; // TODO dimensionality with offsets may not work with compound dimensions.
			}
		}
		return calculatedValue;
	}

	DimensionImpl.prototype.combine = function (value, otherDimension) {
		var dimValuePair, aggregatePower, computedValue;

		// Some validation
		otherDimension.validate();
		if (this.systemName !== otherDimension.systemName) {
			throw new Error('Dimensions have different systems');
		}

		// Do conversion if necessary
		if (this.unitName !== otherDimension.unitName) {
			dimValuePair = otherDimension.convert(value, this.unitName);
			computedValue = dimValuePair.value;
			aggregatePower = this.power + dimValuePair.dimension.power;
		} else {
			computedValue = value;
			aggregatePower = this.power + otherDimension.power;
		}

		return {
			dimension: new Dimension(this.systemName, this.unitName, aggregatePower),
			value: computedValue
		};
	};

	DimensionImpl.prototype.isCommensurableMatch = function (dimension) {
		if (!isDimension(dimension)) {
			throw new Error('Provided parameter must be a Dimension');
		}
		return this.systemName === dimension.systemName &&
			this.power === dimension.power;
	};

	// Helper Functions

	DimensionImpl.prototype.clone = function () {
		return new Dimension(this.systemName, this.unitName, this.power);
	};

	DimensionImpl.prototype.invert = function () {
		return new Dimension(this.systemName, this.unitName, -this.power);
	};

	DimensionImpl.prototype.serialised = function () {
		return {
			system: this.systemName,
			unit: this.unitName,
			power: this.power
		};
	};

	DimensionImpl.prototype.toJson = function () {
		return JSON.stringify(this.serialised());
	};

	DimensionImpl.prototype.format = function (config) {
		var unit, dimensionString;

		unit = measurement.unit(this.systemName, this.unitName);
		if (config.fullName) {
			var dimParts = [];
			if (this.power < 0) {
				dimParts.push('per');
			}
			dimParts.push(this.unitName); // TODO - plurals??
			var absPower = Math.abs(this.power);
			if (absPower === 2) {
				dimParts.push('squared');
			} else if (absPower === 3) {
				dimParts.push('cubed');
			} else if (absPower > 3) {
				dimParts.push('to the power of ' + absPower);
			}
			dimensionString = dimParts.join(' ');
		} else {
			dimensionString = unit.symbol;
			if (config.showAllPowers || this.power !== 1) {
				var powerStr = (config.ascii) ? '^' + this.power : helpers.toSuperScript(this.power);
				dimensionString += powerStr;
			}
		}
		return dimensionString;
	};

	return DimensionImpl;
}());

module.exports = Dimension;
