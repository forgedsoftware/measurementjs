// This file is generated from ./common/systems/default.json 
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
						otherNames: ['meter'],
						type: 'si'
					},
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
					nauticalMile: {
						symbol: 'M',
						otherSymbols: ['NM', 'nmi'],
						type: 'customary',
						systems: ['nautical'],
						multiplier: 1852
					},
					fathom: {
						symbol: 'ftm',
						otherSymbols: ['f', 'fath', 'fm', 'fth', 'fthm'],
						type: 'customary',
						systems: ['oldImperial', 'nautical'],
						multiplier: 1.8288
					},
					cableLengthInternational: {
						type: 'customary',
						systems: ['nautical'],
						multiplier: 185.2
					},
					cableLengthImperial: {
						type: 'customary',
						systems: ['nautical'],
						multiplier: 185.32
					},
					cableLengthUS: {
						type: 'customary',
						systems: ['nautical'],
						multiplier: 219.456
					},
					furlong: {
						type: 'customary',
						systems: ['imperial', 'usCustomary', 'nautical'],
						multiplier: 201.168
					},
					astronomicalUnit: {
						symbol: 'au',
						otherSymbols: ['AU', 'a.u.', 'ua'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 149600000000
					},
					lightSecond: {
						otherNames: ['light-second'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 299792458,
						notes: 'Distance light travels in vacuum in 1 second'
					},
					lightMinute: {
						otherNames: ['light-minute'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 17987547480,
						notes: 'Distance light travels in vacuum in 60 seconds'
					},
					lightHour: {
						otherNames: ['light-hour'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 1079252849000,
						notes: 'Distance light travels in vacuum in 3600 seconds'
					},
					lightDay: {
						otherNames: ['light-day'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 25902068370000,
						notes: 'Distance light travels in vacuum in 24 light-hours, 86,400 light-seconds'
					},
					lightWeek: {
						otherNames: ['light-week'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 181314478600000,
						notes: 'Distance light travels in vacuum in 7 light-days, 604,800 light-seconds'
					},
					lightYear: {
						symbol: 'ly',
						otherNames: ['light-year'],
						type: 'customary',
						systems: ['astronomicalUnits'],
						multiplier: 9460730472580800,
						notes: 'Distance light travels in vacuum in 365.25 days'
					}
				}
			},
			mass: {
				symbol: 'M',
				baseUnit: 'kilogram',
				units: {
					kilogram: {
						symbol: 'kg',
						otherNames: ['kilogramme'],
						type: 'si',
						prefixName: 'kilo',
						prefixFreeName: 'gram'
					},
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
					tonne: {
						symbol: 't',
						type: 'customary',
						multiplier: 1000
					},
					carat: {
						symbol: 'ct',
						otherNames: ['metric carat'],
						type: 'customary',
						systems: ['jewellery'],
						multiplier: 0.0002
					},
					pennyweight: {
						symbol: 'dwt',
						otherSymbols: ['pwt', 'PW'],
						type: 'customary',
						systems: ['jewellery'],
						multiplier: 0.00155517384
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
			electricCurrent: {
				symbol: 'I',
				baseUnit: 'ampere',
				units: {
					ampere: {
						symbol: 'A',
						type: 'si'
					},
					abampere: {
						symbol: 'abamp',
						type: 'customary',
						otherNames: ['electromagneticUnit'],
						systems: ['cgs'],
						multiplier: 10
					},
					esuPerSecond: {
						symbol: 'esu/s',
						type: 'customary',
						otherNames: ['statampere'],
						systems: ['cgs'],
						estimation: true,
						multiplier: 3.335641e-10
					}
				}
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
				units: {
					mole: {
						symbol: 'mol',
						type: 'si'
					}
				}
			},
			luminousIntensity: {
				symbol: 'J',
				baseUnit: 'candela',
				units: {
					candela: {
						symbol: 'cd',
						type: 'si'
					}
				}
			},
			solidAngle: {
				symbol: 'Ω',
				baseUnit: 'steradian',
				units: {
					steradian: {
						symbol: 'sr',
						type: 'si'
					},
					squareDegree: {
						symbol: 'deg²',
						otherSymbols: ['sq.deg.', '(°)²'],
						estimation: true,
						multiplier: 0.00030462
					}
				}
			},
			volume: {
				symbol: 'V',
				baseUnit: 'metreCubed',
				derived: 'length*length*length',
				units: {
					metreCubed: {
						symbol: 'm³',
						type: 'si'
					}
				}
			},
			area: {
				symbol: 'A',
				baseUnit: 'metreSquared',
				derived: 'length*length',
				units: {
					metreSquared: {
						symbol: 'm²',
						type: 'si'
					}
				}
			},
			pressure: {
				symbol: 'P',
				baseUnit: 'pascal',
				derived: 'mass/length/time/time',
				units: {
					pascal: {
						symbol: 'Pa',
						type: 'si'
					}
				}
			},
			frequency: {
				symbol: 'f',
				baseUnit: 'hertz',
				derived: '1/time',
				units: {
					hertz: {
						symbol: 'Hz',
						type: 'si'
					},
					revolutionsPerMinute: {
						symbol: 'rpm',
						type: 'customary',
						multiplier: 0.01666666666666667
					}
				}
			},
			force: {
				symbol: 'F',
				otherNames: ['weight'],
				baseUnit: 'newton',
				derived: 'mass*length/time/time',
				units: {
					newton: {
						symbol: 'N',
						type: 'si'
					},
					atomicUnitOfForce: {
						type: 'customary',
						estimation: true,
						multiplier: 8.23872206e-8
					},
					dyne: {
						symbol: 'dyn',
						type: 'customary',
						systems: ['cgs'],
						multiplier: 0.00001
					},
					kilogramForce: {
						symbol: 'kgf',
						otherSymbols: ['kp', 'Gf'],
						otherNames: ['kilopond', 'grave-force'],
						type: 'customary',
						multiplier: 9.80665
					},
					kip: {
						symbol: 'kip',
						otherSymbols: ['kipf', 'klbf'],
						otherNames: ['kip-force'],
						type: 'customary',
						multiplier: 4448.2216152605
					},
					milligraveForce: {
						symbol: 'mGf',
						otherSymbols: ['gf'],
						otherNames: ['gravet-force'],
						type: 'customary',
						multiplier: 0.00980665
					},
					ounceForce: {
						symbol: 'ozf',
						type: 'customary',
						multiplier: 0.2780138509537812
					},
					poundForce: {
						symbol: 'lbf',
						type: 'customary',
						multiplier: 4.4482216152605
					},
					poundal: {
						symbol: 'pdl',
						type: 'customary',
						multiplier: 0.138254954376
					},
					sthene: {
						symbol: 'sn',
						type: 'customary',
						systems: ['mts'],
						multiplier: 1000
					},
					tonForce: {
						symbol: 'tnf',
						type: 'customary',
						multiplier: 8896.443230521,
						notes: 'Based on short ton'
					}
				}
			},
			speed: {
				symbol: 'v',
				baseUnit: 'metrePerSecond',
				derived: 'length/time',
				units: {
					metrePerSecond: {
						symbol: 'm/s',
						type: 'si'
					}
				}
			},
			acceleration: {
				symbol: 'a',
				baseUnit: 'metresPerSecondSquared',
				derived: 'length/time/time',
				units: {
					metresPerSecondSquared: {
						symbol: 'm/s²',
						type: 'si'
					},
					gravity: {
						symbol: 'g',
						otherSymbols: ['g₀'],
						type: 'customary',
						otherNames: ['standard gravity'],
						multiplier: 9.80665
					},
					gal: {
						symbol: 'Gal',
						otherNames: ['galileo'],
						type: 'si',
						multiplier: 0.01
					},
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
				units: {
					joule: {
						symbol: 'J',
						type: 'si'
					}
				}
			},
			power: {
				symbol: 'P',
				baseUnit: 'watt',
				derived: 'mass*length*length/time/time/time',
				units: {
					watt: {
						symbol: 'W',
						type: 'si'
					}
				}
			},
			electricCharge: {
				symbol: 'Q',
				otherNames: ['charge'],
				baseUnit: 'coulomb',
				derived: 'electricCurrent/time',
				units: {
					coulomb: {
						symbol: 'C',
						type: 'si'
					},
					faraday: {
						symbol: 'F',
						estimation: true,
						type: 'customary',
						multiplier: 96485.3383
					},
					milliampereHour: {
						symbol: 'mAh',
						otherSymbols: ['mA.h'],
						type: 'customary',
						multiplier: '3.6'
					},
					statcoulomb: {
						symbol: 'statC',
						otherSymbols: ['Fr', 'esu'],
						otherNames: ['franklin', 'electrostaticUnit'],
						estimation: true,
						type: 'customary',
						systems: ['cgs'],
						multiplier: 3.335641e-10
					},
					abcoulomb: {
						symbol: 'abC',
						otherSymbols: ['emu'],
						otherNames: ['electrostaticUnit'],
						type: 'customary',
						systems: ['cgs'],
						multiplier: 10
					},
					atomicUnitOfCharge: {
						symbol: 'au',
						type: 'customary',
						estimation: true,
						multiplier: 1.602176462e-19
					}
				}
			},
			electricDipole: {
				symbol: 'p',
				baseUnit: 'coulombMetre',
				derived: 'electricCurrent*length/time',
				units: {
					coulombMetre: {
						symbol: 'C.m',
						otherSymbols: ['Cm'],
						type: 'si'
					},
					debye: {
						symbol: 'D',
						type: 'customary',
						multiplier: 3.33564095e-30
					},
					atomicUnitOfElectricDipoleMoment: {
						symbol: 'ea₀',
						type: 'customary',
						estimation: true,
						multiplier: 8.47835281e-30
					}
				}
			},
			electricPotential: {
				symbol: 'Φ',
				otherNames: ['voltage', 'electricFieldPotential', 'electrostaticPotential'],
				baseUnit: 'volt',
				derived: 'mass*length*length/electricCurrent/time/time/time',
				units: {
					volt: {
						symbol: 'V',
						type: 'si'
					},
					statvolt: {
						symbol: 'statV',
						type: 'customary',
						systems: ['cgs'],
						multiplier: 299.792458
					},
					abvolt: {
						symbol: 'abV',
						type: 'customary',
						systems: ['cgs'],
						multiplier: 1e-8
					}
				}
			},
			electricResistance: {
				symbol: 'R',
				otherNames: ['resistance'],
				baseUnit: 'ohm',
				derived: 'mass*length*length/time/time/time/electricCurrent/electricCurrent',
				units: {
					ohm: {
						symbol: 'Ω',
						type: 'si'
					}
				}
			},
			capacitance: {
				symbol: 'C',
				baseUnit: 'farad',
				derived: 'time*time*time*time*electricCurrent*electricCurrent/length/length/mass',
				units: {
					farad: {
						symbol: 'F',
						type: 'si'
					}
				}
			},
			inductance: {
				symbol: 'L',
				baseUnit: 'henry',
				derived: 'mass*length*length/electricCurrent/electricCurrent/time/time',
				units: {
					henry: {
						symbol: 'H',
						type: 'si'
					}
				}
			},
			density: {
				symbol: 'ρ',
				baseUnit: 'kilogramPerMetreCubed',
				derived: 'mass/length/length/length',
				units: {
					kilogramPerMetreCubed: {
						symbol: 'kg/m³',
						type: 'si'
					}
				}
			},
			flowVolume: {
				symbol: 'Q',
				baseUnit: 'metreCubedPerSecond',
				derived: 'length*length*length/time',
				units: {
					metreCubedPerSecond: {
						symbol: 'm³/s',
						type: 'si'
					}
				}
			},
			luminance: {
				symbol: 'Lᵥ',
				baseUnit: 'candelaPerMetreSquared',
				derived: 'luminousIntensity/length/length',
				units: {
					candelaPerMetreSquared: {
						symbol: 'cd/m²',
						type: 'si'
					}
				}
			},
			luminousFlux: {
				symbol: 'Φᵥ',
				baseUnit: 'lumen',
				otherNames: ['luminousPower'],
				derived: 'luminousIntensity*solidAngle',
				units: {
					lumen: {
						symbol: 'lm',
						type: 'si'
					}
				}
			},
			illuminance: {
				symbol: 'Eᵥ',
				baseUnit: 'lux',
				derived: 'luminousIntensity*solidAngle/length/length',
				units: {
					lux: {
						symbol: 'lx',
						type: 'si'
					},
					phot: {
						symbol: 'ph',
						type: 'customary',
						systems: ['cgs'],
						multiplier: 10000
					},
					lumenPerInchSquared: {
						symbol: 'lm/in²',
						estimation: true,
						type: 'customary',
						multiplier: 1550.0031
					},
					footcandle: {
						symbol: 'fc',
						otherNames: ['lumenPerFootSquared'],
						type: 'customary',
						multiplier: 10.763910417
					}
				}
			},
			information: {
				symbol: 'i',
				otherNames: ['data'],
				baseUnit: 'bit',
				units: {
					bit: {
						symbol: 'b',
						otherSymbols: ['Sh'],
						otherNames: ['shannon'],
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