/**
 *
 *
 */

(function () {
	'use strict';

	var measurement,
		systems,
		siPrefixes,
		siBinaryPrefixes,
		Dimension,
		Quantity,
		MeasurementSystems,
		Unit,
		helpers;

	var BASE_2 = 2;

// Types: si (can have milli, kilo etc...), customary (si calls this off-system), binary, fractional, whole
	systems = {};

	siPrefixes = { 	// TODO... I'm going have to use a bignumber library aren't I? :( https://github.com/MikeMcl/big.js/
					// Maybe it could be optional... you plug in BigNumber and it will use that instead...
		//googol: multiplier: 1e100 // Not SI official
		//hella: mutltiplier: 1e27 // Not SI official
		yotta: { name: 'yotta', symbol: 'Y', multiplier: 1e24 },
		zetta: { name: 'zetta', symbol: 'Z', multiplier: 1e21 },
		exa: { name: 'exa', symbol: 'E', multiplier: 1e18 },
		peta: { name: 'peta', symbol: 'P', multiplier: 1e15 },
		tera: { name: 'tera', symbol: 'T', multiplier: 1e12 },
		giga: { name: 'giga', symbol: 'G', multiplier: 1e9 },
		mega: { name: 'mega', symbol: 'M', multiplier: 1e6 },
		kilo: { name: 'kilo', symbol: 'k', multiplier: 1e3 },
		hecto: { name: 'hecto', symbol: 'h', multiplier: 100, isRare: true },
		deca: { name: 'deca', symbol: 'da', multiplier: 10, isRare: true },
		deci: { name: 'deci', symbol: 'd', multiplier: 0.1, isRare: true },
		centi: { name: 'centi', symbol: 'c', multiplier: 0.01 }, // Is rare for things other than length...
		milli: { name: 'milli', symbol: 'm', multiplier: 1e-3 },
		micro: { name: 'micro', symbol: 'µ', multiplier: 1e-6 },
		nano: { name: 'nano', symbol: 'n', multiplier: 1e-9 },
		pico: { name: 'pico', symbol: 'p', multiplier: 1e-12 },
		femto: { name: 'femto', symbol: 'f', multiplier: 1e-15 },
		atto: { name: 'atto', symbol: 'a', multiplier: 1e-18 },
		zepto: { name: 'zepto', symbol: 'z', multiplier: 1e-21 },
		yocto: { name: 'yocto', symbol: 'y', multiplier: 1e-24 }
	};

	siBinaryPrefixes = {
		yobi: { name: 'yobi', symbol: 'Yi', multiplier: Math.pow(BASE_2, 80) },
		zebi: { name: 'zebi', symbol: 'Zi', multiplier: Math.pow(BASE_2, 70) },
		exbi: { name: 'exbi', symbol: 'Ei', multiplier: Math.pow(BASE_2, 60) },
		pebi: { name: 'pebi', symbol: 'Pi', multiplier: Math.pow(BASE_2, 50) },
		tebi: { name: 'tebi', symbol: 'Ti', multiplier: Math.pow(BASE_2, 40) },
		gibi: { name: 'gibi', symbol: 'Gi', multiplier: Math.pow(BASE_2, 30) },
		mebi: { name: 'mebi', symbol: 'Mi', multiplier: Math.pow(BASE_2, 20) },
		kibi: { name: 'kibi', symbol: 'Ki', multiplier: Math.pow(BASE_2, 10) }
	};

	var siPrefixTranslationNames = 'yotta_zetta_exa_peta_tera_giga_mega_kilo_hecto_deca_deci_centi_milli_micro_nano_pico_femto_atto_zepto_yocto'.split('_');
	var siPrefixTranslationSymbols = 'Y_Z_E_P_T_G_M_k_h_da_d_c_m_µ_n_p_f_a_z_y'.split('_');

	var siBinaryPrefixTranslationNames = 'yobi_zebi_exbi_pebi_tebi_gibi_mebi_kibi'.split('_');
	var siBinaryPrefixTranslationSymbols = 'Yi_Zi_Ei_Pi_Ti_Gi_Mi_Ki'.split('_');

	// HELPER FUNCTIONS

	helpers = {
		isNode: function () {
			return (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
		},
		isAmd: function () {
			return (typeof define === 'function' && define.amd);
		},
		firstPropertyName: function (object) {
			var prop;
			for (prop in object) {
				if (object.hasOwnProperty(prop)) {
					return prop;
				}
			}
		},
		forEach: function (object, fn) {
			var index, isArray;

			isArray = helpers.isArray(object);
			for (index in object) {
				if (object.hasOwnProperty(index)) {
					fn(object[index], isArray ? parseInt(index) : index, object);
				}
			}
		},
		isString: function (value) {
			return (typeof value === 'string');
		},
		isNumber: function (value) {
			return (typeof value === 'number');
		},
		isArray: function (value) {
			return (Object.prototype.toString.call(value) === '[object Array]');
		},
		isObject: function (value) {
			return (typeof value === 'object') && !helpers.isArray(value);
		},
		toSuperScript: function (number) {
			var numberStr, i,
				result = '',
				supers = {
					0: '\u2070', 1: '\u00B9', 2: '\u00B2', 3: '\u00B3', 4: '\u2074',
					5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079', '-': '\u207B',
				};

			numberStr = number.toString();
			for (i = 0; i < numberStr.length; i++) {
				result += supers[numberStr[i]];
			}
			return result;
		}
	};

	// TOP LEVEL FUNCTIONS

	measurement = function (value, systemName, unitName) {
		var config;

		if (!systemName && !unitName) {
			if (helpers.isNumber(value)) {
				config = { value: value };
			} else {
				config = JSON.parse(value);
				if (config === null || typeof config !== 'object') {
					throw new Error("Invalid parameters provided.");
				}
			}
		} else if (!unitName) {
			config = { value: value };
			unitName = systemName;
			if (helpers.isArray(unitName) || helpers.isObject(unitName)) {
				config.dimensions = unitName;
			} else {
				config.unit = unitName;
				config.system = measurement.systemOfUnit(unitName);
			}
		} else {
			config = { value: value, system: systemName, unit: unitName };
		}
		return new Quantity(config.value, config.system, config.unit || config.dimensions);
	};

	measurement.configure = function (config) {

	};

	measurement.setSystems = function (replacementSystems) {
		if (!replacementSystems) {
			// Nothing provided
		} else if (typeof replacementSystems === 'object') {
			systems = replacementSystems;
		} else if (isNode()) {
			systems = require(replacementSystems);
		} else {
			throw new Error('Cannot load file from string in client. Provide object instead.');
		}
	};

	measurement.filterUnits = function (propertyName, value, exclude) {
		// Filters the available units available based on property... e.g. filterUnits('type', 'si'); // e.g. only use si units
	};

	// We default to a local file called systems.json to provide configuration data,
	// but it can be overriden to provide different sets and different internationalization data.
	// CONSIDER: Do we need to separate out the naming from the values?
	// Maybe you can provide a localization file that overrides json values...
	measurement.add = function (data) {
		if (!data) {
			return;
		}
		if (data.systems) {
			addSystems(data.systems);
		}
	};

	function addSystems(systems) {
		helpers.forEach(systems, function (system, systemName) {
			addSystem(system || {}, systemName);
		});
	}

	function addSystem(system, systemName) {
		// TODO: Maybe system and unit should be first class objects?
		var unitName,
			units = {};

		helpers.forEach(system.units, function (unit, unitName) {
			units[unitName] = {
				name: unitName,
				displayName: unit.displayName || unitName || '',
				symbol: unit.symbol || '',
				isSymbolPrefix: unit.isSymbolPrefix || false,
				otherSymbols: unit.otherSymbols || [],
				type: unit.type || '', // si, customary, binary, fractional, whole
				multiplier: unit.multiplier || 1,
				offset: unit.offset || 0,
				isEstimation: unit.isEstimation || false,
				usage: unit.usage || [], // e.g. [ 'US Imperial', 'UK Imperial' ]
				range: unit.range || [] // TODO... { '1':{ min: 80, max: 150, displayName: '1' }, '2': {...}} e.g. Gas Mark
			};
		});

		systems[systemName] = {
			name: systemName,
			symbol: system.symbol || '',
			baseUnit: system.baseUnit || helpers.firstPropertyName(units) || '',
			units: units || {}
		};
	}

	measurement.system = function (systemName) {
		var system;

		system = systems[systemName];
		if (!system) {
			throw new Error('Specified system "' + systemName + '" does not exist');
		}
		return system;
	};

	measurement.hasSystem = function (systemName) {
		return (systems[systemName]) ? true : false;
	};

	measurement.unit = function (systemName, unitName) {
		var system, unit;

		system = measurement.system(systemName);
		unit = system.units[unitName];
		if (!unit) {
			throw new Error('Specified unit "' + unitName + '" does not exist in the system "' + systemName + '"');
		}
		return unit;
	};

	measurement.hasUnit = function (systemName, unitName) {
		var system;

		if (!measurement.hasSystem(systemName)) {
			return false;
		}
		system = measurement.system(systemName);
		return (system.units[unitName]) ? true : false;
	};

	measurement.systemOfUnit = function (unitName) {
		var foundSystem;

		helpers.forEach(systems, function (system, systemName) {
			if (measurement.hasUnit(systemName, unitName)) {
				foundSystem = systemName;
			}
		});
		// TODO If !foundSystem, look again with alt names
		return foundSystem;
	};

	measurement.baseUnit = function (systemName, baseUnitName) {
		// Sets the base unit of a system to be the baseUnitName
		var system = measurement.system(systemName);
		var unit = measurement.unit(systemName, baseUnitName);
		system.baseUnit = unit.name;
		// TODO: then we have to change the multiplier/offset for each unit to match that baseUnit
	};

	// DIMENSION OBJECT

	Dimension = (function () {
		function DimensionImpl(systemName, unitName, power) {
			var config;

			if (!unitName) {
				config = systemName;
				if (!helpers.isObject(config)) {
					if (measurement.systemOfUnit(config)) {
						config = { unit: config };
					} else {
						config = JSON.parse(config);
						if (config === null || typeof config !== 'object') {
							throw new Error("Invalid parameters provided.");
						}
					}
				}
			} else {
				config = { system: systemName, unit: unitName, power: power };
			}
			this.unitName = config.unitName || config.unit;
			this.systemName = config.systemName || config.system || measurement.systemOfUnit(config.unitName || config.unit);
			this.power = (config.power !== null && config.power !== undefined) ? config.power : 1; // 0 is a valid result here
		}

		// Type Checking

		function isDimension (value) {
			return value && value.constructor === DimensionImpl;
		}

		// Validation

		DimensionImpl.prototype.validate = function () {
			// Validates that unit and system exist
			measurement.unit(this.systemName, this.unitName);
			// Validates power is reasonable
			if (this.power === 0) {
				throw new Exception('Dimensions may not have a power of 0');
			}
		};

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

	// QUANTITY OBJECT

	Quantity = (function () {
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
			return new Quantity(this.value, this.systemName, newDimensions);
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
			if (this.dimensions.length === 0 && quantity.dimensions.length === 0) {
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
				return new Quantity(this.value + value, this.systemName, this.dimensions); // TODO check value is number
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
				return new Quantity(this.value - value, this.systemName, this.dimensions); // TODO check value is number
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

			// TODO - move to helper funcs
			function splice(str, index, insertedStr) {
				return str.slice(0, index) + insertedStr + str.slice(index);
			}

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
					valueStr = splice(valueStr, separatorPos, config.separator);
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

	MeasurementSystems = {
		systems: {
			time: {
				symbol: 'T',
				otherNames: ['duration'],
				baseUnit: 'second',
				units: {}
			},
			length: {
				symbol: 'L',
				otherNames: ['distance', 'radius', 'wavelength'],
				baseUnit: 'metre',
				units: {
					mile: {
						symbol: 'mi',
						type: 'customary',
						systems: ['imperial'],
						multiplier: 1609.344
					},
					yard: {
						symbol: 'yd',
						type: 'customary',
						systems: ['imperial'],
						multiplier: 0.9144
					},
					foot: {
						symbol: 'ft',
						otherSymbols: ['\''],
						type: 'customary',
						systems: ['imperial'],
						multiplier: 0.3048
					},
					inch: {
						symbol: 'in',
						otherSymbols: ['\"'],
						type: 'customary',
						systems: ['imperial'],
						multiplier: 0.0254
					},
					furlong: {
						type: 'customary',
						systems: ['imperial', 'usCustomary', 'nautical'],
						multiplier: 201.168
					}
				}
			},
			mass: {
				symbol: 'M',
				baseUnit: 'kilogram',
				units: {
					ounce: {
						symbol: 'oz',
						otherSymbols: ['oz av'],
						type: 'customary',
						systems: ['imperial', 'avoirdupois'],
						multiplier: 0.028349523125
					},
					pound: {
						symbol: 'lb',
						otherSymbols: ['lb av'],
						type: 'customary',
						systems: ['imperial', 'avoirdupois'],
						multiplier: 0.45359237
					},
					stone: {
						symbol: 'st',
						type: 'customary',
						systems: ['imperial'],
						multiplier: 6.35029318
					},
					tonLong: {
						symbol: 'ton',
						otherSymbols: ['long tn'],
						type: 'customary',
						systems: ['imperial'],
						multiplier: 1016.0469088
					},
					tonShort: {
						symbol: 'ton',
						otherSymbols: ['sh tn'],
						type: 'customary',
						systems: ['imperial'],
						multiplier: 907.18474
					},
					hundredweightLong: {
						symbol: 'cwt',
						otherSymbols: ['long cwt'],
						otherNames: ['centum weight'],
						type: 'customary',
						systems: ['imperial'],
						multiplier: 50.802345
					},
					hundredweightShort: {
						symbol: 'sh cwt',
						otherNames: ['cental', 'centum weight'],
						type: 'customary',
						systems: ['usCustomary'],
						multiplier: 45.359237
					}
				}
			},
			temperature: {
				symbol: 'Θ',
				baseUnit: 'kelvin',
				units: {}
			},
			volume: {
				symbol: 'V',
				baseUnit: 'metreCubed',
				derived: 'length*length*length',
				units: {}
			},
			area: {
				symbol: 'A',
				baseUnit: 'metreSquared',
				derived: 'length*length',
				units: {}
			},
			pressure: {
				symbol: 'P',
				baseUnit: 'pascal',
				derived: 'mass/length/time/time',
				units: {}
			},
			speed: {
				symbol: 'v',
				baseUnit: 'metrePerSecond',
				derived: 'length/time',
				units: {}
			},
			acceleration: {
				symbol: 'a',
				baseUnit: 'metresPerSecondSquared',
				derived: 'length/time/time',
				units: {
					feetPerSecondSquared: {
						symbol: 'fps²',
						otherSymbols: ['ft/s²'],
						type: 'customary',
						systems: ['usCustomary', 'imperial'],
						multiplier: 0.3048
					}
				}
			},
			energy: {
				symbol: 'E',
				otherNames: ['work', 'heat'],
				baseUnit: 'joule',
				derived: 'mass*length*length/time/time',
				units: {}
			},
			density: {
				symbol: 'ρ',
				baseUnit: 'kilogramPerMetreCubed',
				derived: 'mass/length/length/length',
				units: {}
			},
			information: {
				symbol: 'i',
				otherNames: ['data'],
				baseUnit: 'bit',
				units: {}
			}
		},
		siPrefixes: [],
		siBinaryPrefixes: []
	};
	measurement.add(MeasurementSystems || {});

	// TODO: Do we need this? Can unit just be a dumb object?
	Unit = (function () {
		function UnitImpl(config) {

		}

		return UnitImpl;
	}());

	/**
	 * Initial setup
	 * Expose module for NodeJS, AMD, raw client side JS.
	 */
	if (helpers.isNode()) {
		module.exports = measurement;
	} else if (helpers.isAmd()) {
		define([], function() {
			return measurement;
		});
	} else {
		window.measurement = measurement;
	}
	
}());
