// This file is generated from ./common/systems/full.json 
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['measurement'], factory); // AMD
	} else if (typeof exports === 'object') {
		module.exports = factory(require('../measurement')); // Node
	} else {
		factory(window.measurement); // Browser global
	}
}(function(measurement) {
	return measurement.add({
		systems: {
			time: {
				symbol: 'T',
				otherNames: ['duration'],
				baseUnit: 'second',
				units: {
					second: {
						symbol: 's',
						otherSymbols: ['sec'],
						type: 'si'
					},
					minute: {
						symbol: 'min',
						type: 'customary',
						multiplier: 60
					},
					hour: {
						symbol: 'h',
						otherSymbols: ['hr'],
						type: 'customary',
						multiplier: 3600
					},
					day: {
						symbol: 'day',
						type: 'customary',
						multiplier: 86400,
						notes: 'Possible Base'
					},
					week: {
						symbol: 'week',
						type: 'customary',
						multiplier: 604800
					},
					month: {
						symbol: 'month',
						type: 'customary',
						estimation: true,
						multiplier: 2629740,
						notes: 'Possible Base'
					},
					year: {
						symbol: 'yr',
						type: 'customary',
						multiplier: 31557600,
						notes: 'Possible Base'
					},
					ke: {
						symbol: 'ke',
						type: 'customary',
						systems: ['traditional Chinese'],
						multiplier: 864
					},
					decade: {
						symbol: 'decade',
						type: 'customary',
						multiplier: 315576000
					},
					century: {
						symbol: 'C',
						type: 'customary',
						multiplier: 3155760000
					},
					millennium: {
						symbol: 'M',
						type: 'customary',
						multiplier: 31557600000
					}
				}
			},
			length: {
				symbol: 'L',
				otherNames: ['distance', 'radius', 'wavelength'],
				baseUnit: 'metre',
				units: {
					metre: {
						symbol: 'm',
						type: 'si'
					}
				}
			},
			mass: {
				symbol: 'M',
				baseUnit: 'kilogram',
				units: {}
			},
			electricCurrent: {
				symbol: 'I',
				baseUnit: 'ampere',
				units: {}
			},
			temperature: {
				symbol: 'Θ',
				baseUnit: 'kelvin',
				units: {
					kelvin: {
						symbol: 'K',
						type: 'si'
					},
					celsius: {
						symbol: 'C',
						type: 'si',
						offset: 273.15
					},
					fahrenheit: {
						symbol: 'F',
						type: 'customary',
						multiplier: 0.5555555555555556,
						offset: 255.37222222
					},
					rankine: {
						symbol: 'R',
						otherSymbols: ['Ra'],
						type: 'customary',
						multiplier: 1.8,
						notes: 'Check values'
					},
					romer: {
						symbol: 'Rø',
						otherSymbols: ['R'],
						type: 'customary',
						multiplier: 0.525,
						offset: 135.90375,
						notes: 'Technically Rømer (or Roemer). Check values'
					},
					newton: {
						symbol: 'N',
						type: 'customary',
						multiplier: 0.33,
						offset: 90.13949999999998,
						notes: 'May have rounding error. Check values'
					},
					delisle: {
						symbol: 'D',
						type: 'customary',
						multiplier: -1.5,
						offset: -559.7249999999999,
						notes: 'May have rounding error. Check values'
					},
					reaumur: {
						symbol: 'Ré',
						otherSymbols: ['Re', 'R'],
						type: 'customary',
						multiplier: -1.5,
						offset: -559.7249999999999,
						notes: 'Technically Réaumur. Check values'
					}
				}
			},
			amountOfSubstance: {
				symbol: 'N',
				baseUnit: 'mole',
				units: {}
			},
			luminousIntensity: {
				symbol: 'J',
				baseUnit: 'candela',
				units: {}
			},
			volume: {
				symbol: 'V',
				baseUnit: 'litre',
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
			frequency: {
				symbol: 'f',
				baseUnit: 'hertz',
				derived: '1/time',
				units: {}
			},
			force: {
				symbol: 'F',
				otherNames: ['weight'],
				baseUnit: 'newton',
				derived: 'mass*length/time/time',
				units: {}
			},
			speed: {
				symbol: 'v',
				baseUnit: 'metresPerSecond',
				derived: 'length/time',
				units: {}
			},
			acceleration: {
				symbol: 'a',
				baseUnit: 'metresPerSecondSquared',
				derived: 'length/time/time',
				units: {}
			},
			energy: {
				symbol: 'E',
				otherNames: ['work', 'heat'],
				baseUnit: 'joule',
				derived: 'mass*length*length/time/time',
				units: {}
			},
			power: {
				symbol: 'P',
				baseUnit: 'watt',
				derived: 'mass*length*length/time/time/time',
				units: {}
			},
			electricCharge: {
				symbol: 'Q',
				otherNames: ['charge'],
				baseUnit: 'coulomb',
				derived: 'electricCurrent/time',
				units: {}
			},
			electricPotential: {
				symbol: 'Φ',
				otherNames: ['voltage', 'electricFieldPotential', 'electrostaticPotential'],
				baseUnit: 'volt',
				derived: 'mass*length*length/electricCurrent/time/time/time',
				units: {}
			},
			electricResistance: {
				symbol: 'R',
				otherNames: ['resistance'],
				baseUnit: 'ohm',
				derived: 'mass*length*length/time/time/time/electricCurrent/electricCurrent',
				units: {}
			},
			capacitance: {
				symbol: 'C',
				baseUnit: 'farad',
				derived: 'time*time*time*time*electricCurrent*electricCurrent/length/length/mass',
				units: {}
			},
			information: {
				symbol: 'i',
				otherNames: ['data'],
				baseUnit: 'bit',
				units: {
					bit: {
						symbol: 'b',
						type: 'binary'
					},
					byte: {
						symbol: 'B',
						type: 'binary',
						multiplier: 8
					}
				}
			}
		},
		siPrefixes: [],
		siBinaryPrefixes: []
	});
}));