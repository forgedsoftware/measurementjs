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
			var index;
			for (index in object) {
				if (object.hasOwnProperty(index)) {
					fn(object[index], index, object);
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
	};

	// TOP LEVEL FUNCTIONS

	measurement = function (value, systemName, unitName) {
		var config;

		if (!systemName && !unitName) {
			config = JSON.parse(value);
			if (config === null || typeof config !== 'object') {
				throw new Error("Invalid parameters provided.");
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
			// temp
			unitName = unit.name;

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
			units: units || []
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
			this.power = config.power || 1;
			this.validateDimension();
		}

		function isDimension (value) {
			return value && value.constructor === DimensionImpl;
		}

		DimensionImpl.prototype.validateDimension = function () {
			// Validates that unit and system exist
			measurement.unit(this.systemName, this.unitName);
			// Validates power is reasonable
			if (this.power === 0) {
				throw new Exception('Dimensions may not have a power of 0');
			}
		};

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

		// Helper Functions

		DimensionImpl.prototype.clone = function () {
			return new Dimension(this.systemName, this.unitName, this.power);
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

		DimensionImpl.prototype.toShortString = function () {
			var unit, dimensionString;

			unit = measurement.unit(this.systemName, this.unitName);
			dimensionString = unit.symbol;
			if (this.power !== 1) {
				dimensionString += '^' + this.power; // TODO - nice way to do powers?
			}
			return dimensionString;
		};

		return DimensionImpl;
	}());

	// QUANTITY OBJECT

	Quantity = (function () {
		function QuantityImpl(value, systemName, dimensions) { // TODO: Uncertainties (+-0.4), (+0.5), (-0.9), (+0.8, -0.2)... maybe { plusMinus: 1.2, plus: 1.4, minus: 1.2, sigma: 3 }
			var currentDimension;

			this.value = value;
			this.systemName = systemName;
			
			this.dimensions = [];
			var self = this; // TODO tidy this
			if (helpers.isArray(dimensions)) {
				helpers.forEach(dimensions, function (dimension) {
					self.dimensions.push(new Dimension(dimension));
				});
			} else {
				this.dimensions.push(new Dimension(systemName, dimensions));
			}

			// TODO: Validation
			// DEPRECATED
			// In addition to getting the unit, this also validates the system and unit exist.
			// this.unit = measurement.unit(systemName, dimensions);
		}

		// Type Checking

		function isQuantity (value) {
			return value && value.constructor === QuantityImpl;
		}

		function isDimension (value) {
			// Not fullproof, but at least validates that the commonly used functions exist
			return value && typeof value === 'object' && value.convertFromBase && value.convertToBase;
		}

		// Dimension Manipulation

		QuantityImpl.prototype.simplify = function () {

			// TODO: Implement
			throw new Error('Not yet implemented');

			// TODO If two dimensions have the same system or one dimension has a power === 0 we can simplify

			// For each dimension
				// If another dimension has the same system
					// Combine
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

		QuantityImpl.prototype.convert = function (unitName) {
			var quantityAsBase = this.convertToBase();
			return convertFromBase(quantityAsBase, unitName);
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

		// TODO: Do we need a way of representing scalar amounts as a quantity?
		// E.g. (5).multiply((5, 'time','seconds')) == (25, 'time', 'seconds')
			// Currently we only allow the opposite: (5, 'time','seconds').multiply((5)) == (25, 'time', 'seconds')

		QuantityImpl.prototype.multiply = function (value) {
			if (isNumber(value)) { // Assume scalar
				return new Quantity(this.value * value, this.systemName, this.dimensions);
			}
			if (!isQuantity(value)) {
				throw new Error('Cannot multiply something that is not a number or a Quantity.');
			}

			// TODO: Implement
			throw new Error('Not yet implemented');

			// Mainpulate provided units s^2/m * kg/hr => s.kg/m (does not work with things with an offset like celsius or fahrenheit)

			// Convert value into same units, prefering original units
			// 10 s^2/m * 20 kg/hr => ?? s.kg/m
			// 10 s^2/m * 20 kg/s * 1/3600 => 10 * 20 * 1/3600 s.kg/m

			// Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
			
			// Create new quantity with values multiplied and new units
		};

		QuantityImpl.prototype.divide = function (value) {
			if (isNumber(value)) { // Assume scalar
				return new Quantity(this.value / value, this.systemName, this.dimensions);
			}
			if (!isQuantity(value)) {
				throw new Error('Cannot divide something that is not a number or a Quantity.');
			}

			// TODO: Implement
			throw new Error('Not yet implemented');

			// Mainpulate provided units s^2/m / kg/hr => s^2/m * hr/kg => s^3/m.kg (does not work with things with an offset like celsius or fahrenheit)

			// Convert value into same units, prefering original units
			// 10 s^2/m / 20 kg/hr => ?? s^3/m.kg
			// 10 s^2/m / 20 kg/s * 3600 => 10 / 20 * 3600 s^3/m.kg

			// Find new system if exists based on units... (Quantities with aggregate units without a system are ok)
			
			// Create new quantity with values multiplied and new units
		};

		QuantityImpl.prototype.add = function (value) {
			if (isNumber(value)) { // Assume shorthand
				return new Quantity(this.value + value, this.systemName, this.dimensions); // TODO check value is number
			}
			if (!isQuantity(value)) {
				throw new Error('Cannot add something that is not a number or a Quantity.');
			}
			if (value.systemName !== this.systemName) { // Commensurability
				throw new Error('In order to add a quantity it must have the same system.');
			}

			// TODO: Implement
			throw new Error('Not yet implemented');

			// Convert value into same units
			// Create new quantity with values added directly and the initial quantity's units
		};

		QuantityImpl.prototype.subtract = function (value) {
			if (isNumber(value)) { // Assume shorthand
				return new Quantity(this.value - value, this.systemName, this.dimensions); // TODO check value is number
			}
			if (!isQuantity(value)) {
				throw new Error('Cannot subtract something that is not a number or a Quantity.');
			}
			if (value.systemName !== this.systemName) { // Commensurability
				throw new Error('In order to subtract a quantity it must have the same system.');
			}

			// TODO: Implement
			throw new Error('Not yet implemented');

			// Convert value into same units
			// Create new quantity with values subtracted directly and the initial quantity's units

		};

		// Math Aliases

		QuantityImpl.prototype.times = function (value) { return this.multiply(value); };
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
			// Assume y is a number and a scalar
			return new Quantity(Math.atan2(y, this.value), this.systemName, this.dimensions);
		};

		QuantityImpl.prototype.pow = function (y) {
			// Assume y is a number and a scalar
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

		QuantityImpl.prototype.serialised = function () {
			var jsonResult;

			jsonResult = {
				value: this.value,
				system: this.systemName
			};

			if (this.dimensions.length === 1 && this.dimensions[0].power === 1) {
				jsonResult.unit = this.dimensions[0].unitName;
			} else {
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

		QuantityImpl.prototype.toShortFixed = function (lengthOfDecimal) {
			var dimensionString = '';
			helpers.forEach(this.dimensions, function (dimension) {
				dimensionString += dimension.toShortString();
			});
			return this.value.toFixed(lengthOfDecimal) + ' ' + dimensionString;
		};

		QuantityImpl.prototype.toShortPrecision = function (numberOfSigFigs) {
			var dimensionString = '';
			helpers.forEach(this.dimensions, function (dimension) {
				dimensionString += dimension.toShortString();
			});
			return this.value.toPrecision(numberOfSigFigs) + ' ' + dimensionString;
		};

		return QuantityImpl;
	}());

	// http://www.bipm.org/en/si/si_brochure/
	// http://www.bipm.org/utils/common/documents/jcgm/JCGM_200_2008_E.pdf

	MeasurementSystems = {
		time: {
			symbol: 'T',
			baseUnit: 'second',
			units: [
				{ name: 'second', symbol: 's', otherSymbols: ['sec'], type: 'si' }, // Types: si (can have milli, kilo etc...), customary (si calls this off-system), binary, fractional, whole
				{ name: 'minute', symbol: 'min', type: 'customary', multiplier: 60 },
				{ name: 'hour', symbol: 'h', otherSymbols: ['hr'], type: 'customary', multiplier: 3600 },
				{ name: 'day', symbol: 'day', type: 'customary', multiplier: 86400 }, // Possible Base
				{ name: 'week', symbol: 'week', type: 'customary', multiplier: 604800 },
				{ name: 'month', symbol: 'month', type: 'customary', estimation: true, multiplier: 2629740 }, // Possible Base
				{ name: 'year', symbol: 'yr', type: 'customary', multiplier: 31557600 }, // Possible Base
				{ name: 'ke', symbol: 'yr', type: 'customary', systems: [ 'traditional Chinese' ], multiplier: 864 },
			]
		},
		length: { // radius, wavelength
			symbol: 'L',
			baseUnit: 'metre',
			units: [
				{ name: 'metre', symbol: 'm', type: 'si' }
				// More here...
			]
		},
		mass: {
			symbol: 'M',
			baseUnit: 'kilogram',
			units: []
		},
		electricCurrent: {
			symbol: 'I',
			baseUnit: 'ampere',
			units: []
		},
		temperature: {
			symbol: 'Θ',
			baseUnit: 'kelvin',
			units: [
				{ name: 'kelvin', symbol: 'K', type: 'si' },
				{ name: 'celsius', symbol: 'C', type: 'si', offset: 273.15 },
				{ name: 'fahrenheit', symbol: 'F', type: 'customary', multiplier: 0.5555555555555556, offset: 255.37222222 },
				// Check values
				{ name: 'rankine', symbol: 'R', otherSymbols: ['Ra'], type: 'customary', multiplier: 1.8 },
				{ name: 'romer', symbol: 'Rø', otherSymbols: ['R'], type: 'customary', multiplier: 0.525, offset: 135.90375 }, // Technically Rømer (or Roemer)
				{ name: 'newton', symbol: 'N', type: 'customary', multiplier: 0.33, offset: 90.13949999999998 }, // May have rounding error
				{ name: 'delisle', symbol: 'D', type: 'customary', multiplier: -1.5, offset: -559.7249999999999 }, // May have rounding error
				{ name: 'reaumur', symbol: 'Ré', otherSymbols: ['Re', 'R'], type: 'customary', multiplier: -1.5, offset: -559.7249999999999 } // Technically Réaumur
			]
		},
		amountOfSubstance: {
			symbol: 'N',
			baseUnit: 'mole',
			units: []
		},
		luminousIntensity: {
			symbol: 'J',
			baseUnit: 'candela',
			units: []
		},
		volume: {
			baseUnit: 'litre',
			derived: 'length*length*length',
			units: []
		},
		area: {
			baseUnit: 'meterSquared',
			derived: 'length*length',
			units: []
		},
		pressure: {
			baseUnit: 'pascal',
			derived: 'mass/length/time/time',
			units: []
		},
		frequency: {
			baseUnit: 'hertz',
			derived: '1/time',
			units: []
		},
		force: {
			symbol: 'F',
			baseUnit: 'Newton',
			derived: 'mass*length/time/time',
			units: []
		},
		speed: {
			symbol: 'v',
			baseUnit: 'metersPerSecond',
			derived: 'length/time',
			units: []
		},
		acceleration: {
			symbol: 'a',
			baseUnit: 'metersPerSecondSquared',
			derived: 'length/time/time',
			units: []
		},
		energy: { // aka work... kinetic energy, heat
			symbol: 'E',
			baseUnit: 'joule',
			derived: 'mass*length*length/time/time',
			units: []
		},
		power: {
			symbol: 'P',
			baseUnit: 'watt',
			derived: 'mass*length*length/time/time/time',
			units: []
		},
		electricCharge: {
			baseUnit: 'coulomb',
			derived: 'electricCurrent/time',
			units: []
		},
		electricPotential: { // aka voltage
			symbol: 'V',
			baseUnit: 'volt',
			derived: 'mass*length*length/electricCurrent/time/time/time',
			units: []
		},
		electricResistance: {
			baseUnit: 'ohm',
			derived: 'mass*length*length/time/time/time/electricCurrent/electricCurrent',
			units: []
		},
		capacitance: {
			baseUnit: 'farad',
			derived: 'time*time*time*time*electricCurrent*electricCurrent/length/length/mass',
			units: []
		},
		information: {
			baseUnit: 'bit',
			units: [
				{ name: 'bit', symbol: 'b', type: 'binary' },
				{ name: 'byte', symbol: 'B', type: 'binary', multiplier: 8 },
			]
		}
	};
	measurement.add({ systems: MeasurementSystems });

	// Do we need this? Can unit just be a dumb object?
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
