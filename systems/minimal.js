// This file is generated from ./common/systems/minimal.json 
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
	});
}));