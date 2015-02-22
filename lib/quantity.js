/*jslint node: true */
'use strict';

var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js'),
	Dimension = require('../lib/dimension.js');

var Quantity = (function () {
	function QuantityImpl(paramA, paramB) {
		if (!paramB && helpers.isString(paramA)) {
			constructFromJson(this, paramA);
		} else if (!paramB) {
			constructWithDimensions(this, paramA, []);
		} else if (helpers.isString(paramB)) {
			constructWithUnitName(this, paramA, paramB);
		} else if (helpers.isArray(paramB) && testArray(paramB, isDimension)) {
			constructWithDimensions(this, paramA, paramB);
		} else if (helpers.isArray(paramB) && testArray(paramB, helpers.isString)) {
			constructWithUnitNames(this, paramA, paramB);
		} else {
			throw new Error('Invalid parameters provided');
		}
	}

	function constructWithDimensions(quantity, value, dimensions) {
		// Value
		// TODO - Handle other types of value
		if (!helpers.isNumber(value)) {
			throw new Error('Quantity requires a value that is a number');
		}
		quantity.value = value;

		// Dimensions
		quantity.dimensions = dimensions;
	}

	// Helper Constructors

	function constructFromJson(quantity, json) {
		var jsonConfig, value, dimensions = [];

		jsonConfig = JSON.parse(json);
		value = jsonConfig.value;

		if (jsonConfig.dimensions && helpers.isArray(jsonConfig.dimensions)) {
			helpers.forEach(jsonConfig.dimension, function (dimConfig) {
				dimensions.push(new measurement.Dimension(dimConfig.unit, dimConfig.dimension, dimConfig.power, dimConfig.prefix));
			});
		} else if (jsonConfig.unit && jsonConfig.dimension) {
			dimensions.push(new measurement.Dimension(jsonConfig.unit, jsonConfig.dimension));
		}
		constructWithDimensions(quantity, value, dimensions);
	}

	function constructWithUnitName(quantity, value, unitName) {
		// Allows q(1, 'metre');
		var dimension = new Dimension(unitName);
		constructWithDimensions(quantity, value, [dimension]);
	}

	function constructWithUnitNames(quantity, value, unitNameArray) {
		// Allowes q(1, ['metre', 'metre', 'second']);
		var dimensions = [];
		helpers.forEach(unitNameArray, function (unitName) {
			dimensions.push(new Dimension(unitName));
		});
		constructWithDimensions(quantity, value, dimensions);
	}

	// Type Checking

	QuantityImpl.prototype.class = function () {
		return 'Quantity';
	}

	function isQuantity (value) {
		return (value.class && helpers.isFunction(value.class) && value.class() == 'Quantity');
	}

	// TODO check all below this ...

	// Unit Conversion

	// Notes:
	// http://en.wikipedia.org/wiki/Conversion_of_units

	// ????? - Unnecessary? Can Remove??
	QuantityImpl.prototype.allDimensionsUsingBaseUnit = function () {
		var areAllBase = true;

		helpers.forEach(this.dimensions, function (dimension) {
			if (!dimension.unitIsBaseUnit()) {
				areAllBase = false;
			}
		});
		return areAllBase;
	};

	// paramA - Either a quantity, or a unit, or a unitName
	QuantityImpl.prototype.convert = function (paramA) {
		var convertedQuantity, quantityAsBase = this.convertToBase();

		if (isQuantity(paramA)) {
			if (!this.isCommensurable(paramA)) {
				throw new Error('In order to convert based upon a quantity they must be commensurable');
			}
			// Handle taking a quantity and converting the first quantity based on it's dimensions
			convertedQuantity = quantityAsBase;
			helpers.forEach(paramA.dimensions, function (dimension) {
				convertedQuantity = convertedQuantity.convertFromBase(dimension.unit);
			});
		} else {
			convertedQuantity = quantityAsBase.convertFromBase(paramA);
		}
		return convertedQuantity;
	};

	// unit (optional) - Either a unit or a unitName
	// TODO - C# Doesn't allow a param here...
	QuantityImpl.prototype.convertToBase = function (unit) {
		var convertedValue, newDimensions;

		if (unit && helpers.isString(unit)) {
			unit = measurement.findUnit(unit);
		}

		newDimensions = [];
		convertedValue = this.value;
		helpers.forEach(this.dimensions, function (dimension) {
			var dimValuePair;

			if (!unit || dimension.unit.key === unit.key) {
				dimValuePair = dimension.convertToBase(convertedValue);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, newDimensions);
	};

	QuantityImpl.prototype.convertFromBase = function (unit, prefix) {
		var convertedValue, newDimensions;

		if (unit && helpers.isString(unit)) {
			unit = measurement.findUnit(unit);
		}
		if (prefix && helpers.isString(prefix)) {
			prefix = measurement.findPrefix(prefix);
		}

		newDimensions = [];
		convertedValue = this.value;
		helpers.forEach(this.dimensions, function (dimension) {
			var dimValuePair;

			if (dimension.unit.dimension.key === unit.dimension.key) {
				dimValuePair = dimension.convertFromBase(convertedValue, unit, prefix);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, newDimensions);
	};

	// General Operations

	QuantityImpl.prototype.simplify = function () {
		var dimensionsValuePair = helpers.simplifyDimensions(this.value, this.dimensions);
		var resultingQuantity = new Quantity(dimensionsValuePair.value, dimensionsValuePair.dimensions);
		if (measurement.options.useAutomaticPrefixManagement) {
			resultingQuantity = resultingQuantity.tidyPrefixes();
		}
		return resultingQuantity;
	};

	QuantityImpl.prototype.tidyPrefixes = function () {
		// TODO
		return this;
	}

	QuantityImpl.prototype.isDimensionless = function () {
		return (this.dimensions.length === 0);
	};

	QuantityImpl.prototype.isCommensurable = function (quantity) {
		if (!isQuantity(quantity)) {
			throw new Error('Cannot check the commensurability of something that is not a Quantity');
		}
		// Dimensionless
		if (this.isDimensionless() && quantity.isDimensionless()) {
			return true;
		}

		var simplifiedThis = this.simplify();
		var simplifiedQuantity = quantity.simplify();

		if (simplifiedThis.dimensions.length !== simplifiedQuantity.dimensions.length) {
			return false;
		}

		var allHaveMatch = true;
		helpers.forEach(simplifiedThis.dimensions, function (dimension) {
			var foundMatch = false;
			helpers.forEach(simplifiedQuantity.dimensions, function (otherDimension) {
				if (dimension.isCommensurableMatch(otherDimension)) {
					foundMatch = true;
				}
			});
			if (!foundMatch) {
				allHaveMatch = false;
			}
		});
		return allHaveMatch;
	};

	// Quantity Math & Dimensional Analysis

	// Notes:
	// http://en.wikipedia.org/wiki/Units_conversion_by_factor-label
	// http://en.wikipedia.org/wiki/Dimensional_analysis

	QuantityImpl.prototype.multiply = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value * value, this.dimensions);
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot multiply something that is not a number or a Quantity.');
		}

		// Manipulate provided units s^2/m * kg/hr => s.kg/m (does not work with things with an offset like celsius or fahrenheit)
		var allDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		helpers.forEach(value.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		var multipliedQuantity = new Quantity(this.value * value.value, allDimensions);

		// Convert value into same units, preferring original units
		// 10 s^2/m * 20 kg/hr => ?? s.kg/m
		// 10 s^2/m * 20 kg/s * 1/3600 => 10 * 20 * 1/3600 s.kg/m

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return multipliedQuantity.simplify();
	};

	QuantityImpl.prototype.divide = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value / value, this.dimensions);
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot divide something that is not a number or a Quantity.');
		}

		// Manipulate provided units s^2/m / kg/hr => s^2/m * hr/kg => s^3/m.kg (does not work with things with an offset like celsius or fahrenheit)
		var allDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			allDimensions.push(dimension.clone());
		});
		helpers.forEach(value.dimensions, function (dimension) {
			allDimensions.push(dimension.invert());
		});
		var dividedQuantity = new Quantity(this.value / value.value, allDimensions);

		// Convert value into same units, prefering original units
		// 10 s^2/m / 20 kg/hr => ?? s^3/m.kg
		// 10 s^2/m / 20 kg/s * 3600 => 10 / 20 * 3600 s^3/m.kg

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return dividedQuantity.simplify();
	};

	QuantityImpl.prototype.add = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value + value, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot add something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values added directly and the initial quantity's units
		return new Quantity(this.value + convertedQuantity.value, this.dimensions);
	};

	QuantityImpl.prototype.subtract = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value - value, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot subtract something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values subtracted directly and the initial quantity's units
		return new Quantity(this.value - convertedQuantity.value, this.dimensions);
	};

	// Math Aliases

	QuantityImpl.prototype.times = function (value) { return this.multiply(value); };
	QuantityImpl.prototype.plus = function (value) { return this.add(value); };
	QuantityImpl.prototype.minus = function (value) { return this.subtract(value); };

	// JS Math Extensions

	QuantityImpl.prototype.abs = function () { return createQuantity(this, Math.abs); };
	QuantityImpl.prototype.acos = function () { return createQuantity(this, Math.acos); };
	QuantityImpl.prototype.asin = function () { return createQuantity(this, Math.asin); };
	QuantityImpl.prototype.atan = function () { return createQuantity(this, Math.atan); };
	QuantityImpl.prototype.ceil = function () { return createQuantity(this, Math.ceil); };
	QuantityImpl.prototype.cos = function () { return createQuantity(this, Math.cos); };
	QuantityImpl.prototype.exp = function () { return createQuantity(this, Math.exp); };
	QuantityImpl.prototype.floor = function () { return createQuantity(this, Math.floor); };
	QuantityImpl.prototype.log = function () { return createQuantity(this, Math.log); };
	QuantityImpl.prototype.round = function () { return createQuantity(this, Math.round); };
	QuantityImpl.prototype.sin = function () { return createQuantity(this, Math.sin); };
	QuantityImpl.prototype.sqrt = function () { return createQuantity(this, Math.sqrt); };
	QuantityImpl.prototype.tan = function () { return createQuantity(this, Math.tan); };

	function createQuantity(self, mathFunction) {
		return new Quantity(mathFunction(self.value), self.dimensions);
	}

	QuantityImpl.prototype.atan2 = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.atan2(y, this.value), this.dimensions);
	};

	QuantityImpl.prototype.pow = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.pow(this.value, y), this.dimensions);
	};

	QuantityImpl.prototype.max = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.max.apply(null, args), this.dimensions);
	};

	QuantityImpl.prototype.min = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.min.apply(null, args), this.dimensions);
	};

	// Helper functions

	QuantityImpl.prototype.clone = function () {
		var newDimensions = [];
		helpers.forEach(this.dimensions, function (dimension) {
			newDimensions.push(dimension.clone());
		});
		return new Quantity(this.value, newDimensions);
	};

	QuantityImpl.prototype.serialised = function () {
		var jsonResult = {
			value: this.value
		};

		if (this.dimensions.length === 1 && this.dimensions[0].power === 1  && !this.dimensions[0].prefix) {
			jsonResult.unit = this.dimensions[0].unit.key;
			jsonResult.dimension = this.dimensions[0].unit.dimension.key;
		} else if (this.dimensions.length > 0) {
			jsonResult.dimensions = [];
			helpers.forEach(this.dimensions, function (dimension) {
				jsonResult.dimensions.push(dimension.serialised());
			});
		}
		return jsonResult;
	};

	QuantityImpl.prototype.toJson = function () {
		return JSON.stringify(this.serialised());
	};

	QuantityImpl.prototype.format = function (config) {
		// TODO - get default format config object...
		config = config || {};
		if (typeof config.sort === 'undefined') { // default
			config.sort = true;
		}

		var valueStr = '';
		// Precision/Fixed
		if (typeof config.fixed !== 'undefined') {
			valueStr += this.value.toFixed(config.fixed);
		} else {
			valueStr += this.value.toPrecision(config.precision);
		}

		// Separator/Decimal
		var numLength = valueStr.indexOf('.');
		if (numLength === -1) {
			numLength = valueStr.length;
		}
		var separatorPos = numLength - (config.separatorCount || 3);
		valueStr = valueStr.replace('.', config.decimal || '.');
		if (config.separator) {
			while (separatorPos > 0) {
				valueStr = helpers.splice(valueStr, separatorPos, config.separator);
				separatorPos -= (config.separatorCount || 3);
			}
		}

		// Exponents
		if (config.expandExponent) {
			var eIndex = valueStr.indexOf('e');
			if (eIndex > -1) {
				var exponent = Math.floor(Math.log(this.value)/Math.log(10));
				valueStr = valueStr.slice(0, eIndex);
				var exponentStr = (config.asciiOnly) ? '^' + exponent : helpers.toSuperScript(exponent);
				valueStr += ' x 10' + exponentStr;
			}
		}

		// Dimensions
		var dimensionStrings = [];
		var clonedDimensions = this.clone().dimensions;
		if (config.sort) {
			clonedDimensions.sort(function (d1, d2) {
				return d2.power - d1.power;
			});
		}
		helpers.forEach(clonedDimensions, function (dimension) {
			dimensionStrings.push(dimension.format(config));
		});

		var joiner = (config.textualDescription) ? ' ' : (config.unitSeparator || '');
		var dimensionStr = dimensionStrings.join(joiner);

		// Returning
		if (config.onlyValue) {
			return valueStr;
		} else if (config.onlyDimensions) {
			return dimensionStr;
		} else {
			if (dimensionStr.length > 0) {
				valueStr += ' ';
			}
			return valueStr + dimensionStr;
		}
	};

	// HELPER FUNCTIONS

	function isDimension(dim) {
		return dim && dim.class && dim.class() == 'Dimension';
	}

	function testArray(array, testFunc) {
		var allMatch = true;
		helpers.forEach(array, function (item) {
			if (!testFunc(item)) {
				allMatch = false;
			}
		});
		return allMatch;
	}

	return QuantityImpl;
}());

module.exports = Quantity;
