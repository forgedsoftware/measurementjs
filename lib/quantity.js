
var helpers = require('../lib/helpers.js'),
	measurement = require('../lib/measurement.js'),
	Dimension = require('../lib/dimension.js');

var Quantity = (function () {
	function QuantityImpl(value, systemName, dimensions) { // TODO: Uncertainties (+-0.4), (+0.5), (-0.9), (+0.8, -0.2)... maybe { plusMinus: 1.2, plus: 1.4, minus: 1.2, sigma: 3 }
		var currentDimension,
			self = this;

		this.value = value;
		this.systemName = systemName; // TODO: Use this properly??
		
		this.dimensions = [];
		if (helpers.isArray(dimensions)) {
			helpers.forEach(dimensions, function (dimension) {
				currentDimension = new Dimension(dimension);
				currentDimension.validate();
				self.dimensions.push(currentDimension);
			});
		} else if (dimensions) {
			currentDimension = new Dimension(systemName, dimensions);
			currentDimension.validate();
			this.dimensions.push(currentDimension);
		}

		this.validate();
	}

	// Type Checking

	function isQuantity (value) {
		return value && value.constructor === QuantityImpl;
	}

	// Validation

	QuantityImpl.prototype.validate = function () {
		if (typeof this.value !== 'number') {
			throw new Error('The value of a quantity must be a number');
		}
	};

	// Dimension Manipulation

	QuantityImpl.prototype.simplify = function () {
		// TODO: Handle cases where the dimension is not a base dimension, e.g. speed and needs to
		// be simplified into two base dimensions first => length^1.time^-1
		// Maybe a pre step simplifying the compound steps? OR all dimensions could always be saved as base values?

		var newDimensions = [],
			processedDimensions = [],
			computedValue = this.value,
			self = this;

		helpers.forEach(this.dimensions, function (dimension, index) {
			var newDimension, i, dimValuePair;

			if (processedDimensions.indexOf(index) >= 0) {
				return;
			}
			if (dimension.power === 0) {
				return;
			}
			newDimension = dimension.clone();
			for (i = index  + 1; i < self.dimensions.length; i++) {
				if (dimension.systemName === self.dimensions[i].systemName) {
					dimValuePair = newDimension.combine(computedValue, self.dimensions[i]);
					newDimension = dimValuePair.dimension;
					computedValue = dimValuePair.value;
					processedDimensions.push(i);
				}
			}
			if (newDimension.power !== 0) {
				newDimensions.push(newDimension);
			}
			processedDimensions.push(index);
		});	
		return new Quantity(computedValue, this.systemName, newDimensions);
	};

	// Unit Conversion

	// Notes:
	// http://en.wikipedia.org/wiki/Conversion_of_units

	QuantityImpl.prototype.allDimensionsUsingBaseUnit = function () {
		var areAllBase = true;

		helpers.forEach(this.dimensions, function (dimension) {
			if (!dimension.unitIsBaseUnit()) {
				areAllBase = false;
			}
		});
		return areAllBase;
	};

	QuantityImpl.prototype.isDimensionless = function () {
		return (this.dimensions.length === 0);
	};

	QuantityImpl.prototype.isCommensurable = function (quantity) {
		if (!isQuantity(quantity)) {
			throw new Error('Cannot check the commensurability of something that is not a Quantity');
		}
		// Dimensionless
		if (this.isDimensionless() && quantity.IsDimensionless()) {
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

	QuantityImpl.prototype.convert = function (unitName) {
		var convertedQuantity, quantityAsBase = this.convertToBase();

		if (isQuantity(unitName)) {
			if (!this.isCommensurable(unitName)) {
				throw new Error('In order to convert based upon a quantity they must be commensurable');
			}
			// Handle taking a quantity and converting the first quantity based on it's dimensions
			convertedQuantity = quantityAsBase;
			helpers.forEach(unitName.dimensions, function (dimension) {
				convertedQuantity = convertFromBase(convertedQuantity, dimension.unitName);
			});
		} else {
			convertedQuantity = convertFromBase(quantityAsBase, unitName);
		}
		return convertedQuantity;
	};

	// unitName here is optional, if provided it will only convert dimensions with that unitName to base
	QuantityImpl.prototype.convertToBase = function (unitName) {
		var convertedValue, newDimensions;

		newDimensions = [];
		convertedValue = this.value;
		helpers.forEach(this.dimensions, function (dimension) {
			var dimValuePair;

			if (!unitName || dimension.unitName === unitName) {
				dimValuePair = dimension.convertToBase(convertedValue);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, this.systemName, newDimensions);
	};

	// This function is hidden as exposing it should be unnecessary.
	// Use convert instead.
	function convertFromBase(self, unitName) {
		var convertedValue, newDimensions;

		newDimensions = [];
		convertedValue = self.value;
		helpers.forEach(self.dimensions, function (dimension) {
			var dimValuePair;

			if (measurement.hasUnit(dimension.systemName, unitName)) {
				dimValuePair = dimension.convertFromBase(convertedValue, unitName);
				convertedValue = dimValuePair.value;
				newDimensions.push(dimValuePair.dimension);
			} else {
				newDimensions.push(dimension.clone());
			}
		});
		return new Quantity(convertedValue, self.systemName, newDimensions);
	}

	// Quantity Math & Dimensional Analysis

	// Notes:
	// http://en.wikipedia.org/wiki/Units_conversion_by_factor-label
	// http://en.wikipedia.org/wiki/Dimensional_analysis

	QuantityImpl.prototype.multiply = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value * value, this.systemName, this.dimensions);
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
		var multipliedQuantity = new Quantity(this.value * value.value, this.systemName, allDimensions);

		// Convert value into same units, preferring original units
		// 10 s^2/m * 20 kg/hr => ?? s.kg/m
		// 10 s^2/m * 20 kg/s * 1/3600 => 10 * 20 * 1/3600 s.kg/m

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return multipliedQuantity.simplify();
	};

	QuantityImpl.prototype.divide = function (value) {
		if (helpers.isNumber(value)) { // Assume dimensionless
			return new Quantity(this.value / value, this.systemName, this.dimensions);
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
		var dividedQuantity = new Quantity(this.value / value.value, this.systemName, allDimensions);

		// Convert value into same units, prefering original units
		// 10 s^2/m / 20 kg/hr => ?? s^3/m.kg
		// 10 s^2/m / 20 kg/s * 3600 => 10 / 20 * 3600 s^3/m.kg

		// TODO: Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
		
		// Create new quantity with values multiplied and new units
		return dividedQuantity.simplify();
	};

	QuantityImpl.prototype.add = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value + value, this.systemName, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot add something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values added directly and the initial quantity's units
		return new Quantity(this.value + convertedQuantity.value, this.systemName, this.dimensions);
	};

	QuantityImpl.prototype.subtract = function (value) {
		if (helpers.isNumber(value)) { // Assume shorthand
			return new Quantity(this.value - value, this.systemName, this.dimensions); // TODO - Copy dimensions
		}
		if (!isQuantity(value)) {
			throw new Error('Cannot subtract something that is not a number or a Quantity');
		}

		// Convert value into same units
		var convertedQuantity = value.convert(this);
		// Create new quantity with values subtracted directly and the initial quantity's units
		return new Quantity(this.value - convertedQuantity.value, this.systemName, this.dimensions);
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
		return new Quantity(mathFunction(self.value), self.systemName, self.dimensions);
	}

	QuantityImpl.prototype.atan2 = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.atan2(y, this.value), this.systemName, this.dimensions);
	};

	QuantityImpl.prototype.pow = function (y) {
		// Assume y is a number and dimensionless
		return new Quantity(Math.pow(this.value, y), this.systemName, this.dimensions);
	};

	QuantityImpl.prototype.max = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.max.apply(null, args), this.systemName, this.dimensions);
	};

	QuantityImpl.prototype.min = function () {
		// Assume all arguments are numbers
		var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
		return new Quantity(Math.min.apply(null, args), this.systemName, this.dimensions);
	};

	// Helper functions

	QuantityImpl.prototype.clone = function () {
		return new Quantity(this.value, this.systemName, this.dimensions);
	};

	QuantityImpl.prototype.serialised = function () {
		var jsonResult;

		jsonResult = {
			value: this.value
		};

		if (this.systemName) {
			jsonResult.system = this.systemName;
		}

		if (this.dimensions.length === 1 && this.dimensions[0].power === 1) {
			jsonResult.unit = this.dimensions[0].unitName;
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
				var exponentStr = (config.ascii) ? '^' + exponent : helpers.toSuperScript(exponent);
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

		var joiner = (config.fullName) ? ' ' : (config.unitSeparator || '');
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

	return QuantityImpl;
}());

module.exports = Quantity;
