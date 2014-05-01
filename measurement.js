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
		Measure,
		MeasurementSystems,
		Unit;

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


	// TOP LEVEL FUNCTIONS

	measurement = function (value, measurementSystem, unitName) {
		if (!measurementSystem || !unitName) {
			var jsonResult = JSON.parse(value);
			if (jsonResult != null && typeof jsonResult === 'object') {
				return new Measure(jsonResult.value, jsonResult.system, jsonResult.unit);
			} else {
				throw new Error("Invalid parameters provided.")
			}
		}
		return new Measure(value, measurementSystem, unitName);
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
	}

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
		var systemName;

		for (systemName in systems) {
			addSystem(systems[systemName] || {}, systemName);
		}
	}

	function addSystem(system, systemName) {
		var unitName,
			units = {};

		for (unitName in system.units) {
			var unit = system.units[unitName];
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
		}

		systems[systemName] = {
			name: systemName,
			symbol: system.symbol || '',
			baseUnit: system.baseUnit || firstPropertyName(units) || '',
			units: units || []
		};
	}

	measurement.system = function (systemName) {
		var system;

		system = systems[systemName];
		if (!system) {
			throw new Error('Specified system does not exist');
		}
		return system;
	}

	measurement.unit = function (systemName, unitName) {
		var system, unit;

		system = measurement.system(systemName);
		unit = system.units[unitName];
		if (!unit) {
			throw new Error('Specified unit does not exist in this system');
		}
		return unit;
	}

	measurement.baseUnit = function (systemName, baseUnitName) {
		// Sets the base unit of a system to be the baseUnitName
		var system = measurement.system(systemName);
		var unit = measurement.unit(systemName, baseUnitName);
		system.baseUnit = unit.name;
	};

	// MEASURE OBJECT

	Measure = (function () { // TODO: Consider renaming to Quantity ????
		function MeasureImpl(value, measurementSystem, unitName) { // TODO: Uncertainties (+-0.4), (+0.5), (-0.9), (+0.8, -0.2)... maybe { plusMinus: 1.2, plus: 1.4, minus: 1.2, sigma: 3 }
			this.value = value;
			this.measurementSystem = measurementSystem;
			this.unitName = unitName;

			// In addition to getting the unit, this also validates the system and unit exist.
			this.unit = measurement.unit(measurementSystem, unitName);

			// TODO: Consider: If a system/unit is changed while measure exists is this a problem?
			// Should we not be storing the unit and only getting it when needed?
		}

		
		// Unit Conversion

		// Notes:
		// http://en.wikipedia.org/wiki/Conversion_of_units

		MeasureImpl.prototype.unitIsBaseUnit = function (unitName) {
			return (measurement.system(this.measurementSystem).baseUnit === this.unitName);
		}

		MeasureImpl.prototype.convert = function (unitName) {
			var measureAsBase = this.convertToBase();
			return convertFromBase(measureAsBase, unitName);
		}

		MeasureImpl.prototype.convertToBase = function () {
			var baseUnit, newValue;

			if (this.unitIsBaseUnit()) {
				return this;
			}
			baseUnit = measurement.unit(this.measurementSystem, measurement.system(this.measurementSystem).baseUnit);
			if (baseUnit) {
				newValue = (this.value * this.unit.multiplier) + this.unit.offset;
				return new Measure(newValue, this.measurementSystem, baseUnit.name);
			} else {
				throw new Error("No base unit could be found");
			}
		}

		// This function is hidden as exposing it should be unnecessary.
		// Use convert instead.
		function convertFromBase(self, unitName) {
			var unit, newValue;

			if (!self.unitIsBaseUnit()) {
				throw new Error("The existing unit is not a base unit");
			}
			unit = measurement.unit(self.measurementSystem, unitName);
			if (unit) {
				newValue = (self.value - unit.offset) / unit.multiplier;
				return new Measure(newValue, self.measurementSystem, unitName);
			} else {
				throw new Error("The specified unit could not be found");
			}
		}

		// Measure Math & Dimensional Analysis

		// Notes:
		// http://en.wikipedia.org/wiki/Units_conversion_by_factor-label
		// http://en.wikipedia.org/wiki/Dimensional_analysis

		// TODO: Do we need a way of representing scalar quantities as a measure?
		// E.g. (5).multiply((5, 'time','seconds')) == (25, 'time', 'seconds')
			// Currently we only allow the opposite: (5, 'time','seconds').multiply((5)) == (25, 'time', 'seconds')

		MeasureImpl.prototype.multiply = function (value) {
			if (!isMeasure(value)) { // Assume scalar
				return new Measure(this.value * value, this.measurementSystem, this.unitName); // TODO check value is number
			}

			// Mainpulate provided units s^2/m * kg/hr => s.kg/m (does not work with things with an offset like celsius or fahrenheit)

			// Convert value into same units, prefering original units
			// 10 s^2/m * 20 kg/hr => ?? s.kg/m
			// 10 s^2/m * 20 kg/s * 1/3600 => 10 * 20 * 1/3600 s.kg/m

			// Find new system if exists based on units... (Measures with aggregate units without a system are ok)
			
			// Create new measure with values multiplied and new units
		}

		MeasureImpl.prototype.divide = function (value) {
			if (!isMeasure(value)) { // Assume scalar
				return new Measure(this.value / value, this.measurementSystem, this.unitName); // TODO check value is number
			}

			// Mainpulate provided units s^2/m / kg/hr => s^2/m * hr/kg => s^3/m.kg (does not work with things with an offset like celsius or fahrenheit)

			// Convert value into same units, prefering original units
			// 10 s^2/m / 20 kg/hr => ?? s^3/m.kg
			// 10 s^2/m / 20 kg/s * 3600 => 10 / 20 * 3600 s^3/m.kg

			// Find new system if exists based on units... (Measures with aggregate units without a system are ok)
			
			// Create new measure with values multiplied and new units
		}

		MeasureImpl.prototype.add = function (value) {
			if (!isMeasure(value)) { // Assume shorthand
				return new Measure(this.value + value, this.measurementSystem, this.unitName); // TODO check value is number
			}
			if (value.measurementSystem !== this.measurementSystem) { // Commensurability
				throw new Error('In order to add a measure it must have the same system.');
			}

			// Convert value into same units
			// Create new measure with values added directly and the initial measure's units
		}

		MeasureImpl.prototype.subtract = function (value) {
			if (!isMeasure(value)) { // Assume shorthand
				return new Measure(this.value - value, this.measurementSystem, this.unitName); // TODO check value is number
			}
			if (value.measurementSystem !== this.measurementSystem) { // Commensurability
				throw new Error('In order to subtract a measure it must have the same system.');
			}

			// Convert value into same units
			// Create new measure with values subtracted directly and the initial measure's units

		}

		function isMeasure (value) {
			return value && value.constructor === MeasureImpl;
		}

		// Math Aliases

		MeasureImpl.prototype.times = function (value) { return this.multiply(value); }
		MeasureImpl.prototype.minus = function (value) { return this.subtract(value); }

		// JS Math Extensions

		MeasureImpl.prototype.abs = function () { return createMeasure(this, Math.abs); }
		MeasureImpl.prototype.acos = function () { return createMeasure(this, Math.acos); }
		MeasureImpl.prototype.asin = function () { return createMeasure(this, Math.asin); }
		MeasureImpl.prototype.atan = function () { return createMeasure(this, Math.atan); }
		MeasureImpl.prototype.ceil = function () { return createMeasure(this, Math.ceil); }
		MeasureImpl.prototype.cos = function () { return createMeasure(this, Math.cos); }
		MeasureImpl.prototype.exp = function () { return createMeasure(this, Math.exp); }
		MeasureImpl.prototype.floor = function () { return createMeasure(this, Math.floor); }
		MeasureImpl.prototype.log = function () { return createMeasure(this, Math.log); }
		MeasureImpl.prototype.round = function () { return createMeasure(this, Math.round); }
		MeasureImpl.prototype.sin = function () { return createMeasure(this, Math.sin); }
		MeasureImpl.prototype.sqrt = function () { return createMeasure(this, Math.sqrt); }
		MeasureImpl.prototype.tan = function () { return createMeasure(this, Math.tan); }

		function createMeasure(self, mathFunction) {
			return new Measure(mathFunction(self.value), self.measurementSystem, self.unitName);
		}

		MeasureImpl.prototype.atan2 = function (y) {
			// Assume y is a number and a scalar
			return new Measure(Math.atan2(y, this.value), this.measurementSystem, this.unitName);
		}

		MeasureImpl.prototype.pow = function (y) {
			// Assume y is a number and a scalar
			return new Measure(Math.pow(this.value, y), this.measurementSystem, this.unitName);
		}

		MeasureImpl.prototype.max = function () {
			// Assume all arguments are numbers
			var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
			return new Measure(Math.max.apply(null, args), this.measurementSystem, this.unitName);
		}

		MeasureImpl.prototype.min = function () {
			// Assume all arguments are numbers
			var args = [ this.value ].concat(Array.prototype.slice.call(arguments));
			return new Measure(Math.min.apply(null, args), this.measurementSystem, this.unitName);
		}

		// Helper functions

		MeasureImpl.prototype.toJson = function () {
			return JSON.stringify({
				value: this.value,
				unit: this.unitName,
				system: this.measurementSystem
			});
		}

		MeasureImpl.prototype.toShortFixed = function (lengthOfDecimal) {
			return this.value.toFixed(lengthOfDecimal) + ' ' + this.unit.symbol;
		}

		MeasureImpl.prototype.toShortPrecision = function (numberOfSigFigs) {
			return this.value.toPrecision(numberOfSigFigs) + ' ' + this.unit.symbol;
		}

		return MeasureImpl;
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

	// HELPER FUNCTIONS

	function isNode() {
		return (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
	}

	function isAmd() {
		return (typeof define === 'function' && define.amd);
	}

	function firstPropertyName(object) {
		var prop;
		for (prop in object) {
			if (object.hasOwnProperty(prop)) {
				return prop;
			}
		}
	}

	/**
	 * Initial setup
	 * Expose module for NodeJS, AMD, raw client side JS.
	 */
	if (isNode()) {
		module.exports = measurement;
	} else if (isAmd()) {
		define([], function() {
			return measurement;
		});
	} else {
		window.measurement = measurement;
	}
	
}());
