/*jslint node: true */
'use strict';

// MEASUREMENT OBJECT
// Shorthand creation of Quantity

var measurement;
module.exports = measurement = function (paramA, paramB) {
	return new measurement.Quantity(paramA, paramB);
};

// REQUIRES

// Note: measurement must exist and be exported before requires
// to avoid circular dependencies and general badness
var helpers = require('../lib/helpers.js'),
	systemsJson = require('../common/systems.json'),
	Quantity = require('../lib/quantity.js'),
	Dimension = require('../lib/dimension.js'),
	Options = require('../lib/options.js'),
	MeasurementSystem = require('../lib/entities/measurement_system.js'),
	DimensionDefinition = require('../lib/entities/dimension_definition.js'),
	Prefix = require('../lib/entities/prefix.js');

// EXPOSED CLASSES

measurement.Quantity = Quantity;
measurement.Q = Quantity; // Shorthand
measurement.Dimension = Dimension;
measurement.D = Dimension; // Shorthand

// PROPERTIES

measurement.allSystems = {};
measurement.rootSystems = {};
measurement.dimensions = {};
measurement.prefixes = {};
measurement.allUnits = [];

// OPTIONS

measurement.resetToDefaultOptions = function() {
	measurement.options = new Options();
}

measurement.options = null;

// LOAD

measurement.load = function(dataObject) {
	if (!dataObject || !helpers.isObject(dataObject)) {
		throw new Error('dataObject must exist and be an object');
	}
	measurement.resetToDefaultOptions();
	helpers.forEach(dataObject.systems, function (config, key) {
		measurement.allSystems[key] = new MeasurementSystem(key, config);
	});
	prepareTree();
	helpers.forEach(dataObject.dimensions, function (config, key) {
		measurement.dimensions[key] = new DimensionDefinition(key, config);
	});
	prepareUnits();
	helpers.forEach(dataObject.prefixes, function (config, key) {
		measurement.prefixes[key] = new Prefix(key, config);
	});
}

function prepareTree() {
	helpers.forEach(measurement.allSystems, function (system, key) {
		if (!system.inherits) {
			measurement.rootSystems[key] = system;
		} else {
			helpers.forEach(measurement.allSystems, function (parentSystem, parentKey) {
				if (parentKey == system.inherits) {
					parentSystem.children[key] = system;
					system.parent = parentSystem;
				}
			})
		}
	})
}

function prepareUnits() {
	helpers.forEach(measurement.dimensions, function (dimension, key) {
		helpers.forEach(dimension.units, function (unit, key) {
			unit.updateMeasurementSystems(measurement.allSystems);
			measurement.allUnits.push(unit);
		});
	});
}

// FIND

// Helpers

function findImpl(items, matcher, findParam, ignoreCase, filterFunc, sortCalculatePoints) {
	// Validate
	if (!helpers.isString(findParam) || (helpers.isString(findParam) && findParam.length == 0)) {
		throw new Error('Find parameter must be a string and at least one character');
	}
	// Ignore Case Defaults To True
	ignoreCase = (helpers.isBoolean(ignoreCase)) ? ignoreCase : true;
	// Do Find
	var matches = [];
	helpers.forEach(items, function (item, key) {
		if (item[matcher](findParam, ignoreCase)) {
			matches.push(item);
		}
	});
	matches = matches.filter(filterFunc);
	matches = matches.sort(function (x, y) {
		return compare(x, y, sortCalculatePoints);
	}).reverse(); // Descending
	return matches;
}

function compare(item1, item2, calculatePoints) {
	if (!item1) {
		return (!item2) ? 0 : -1;
	}
	if (!item2) {
		return 1;
	}
	var item1Points = calculatePoints(item1);
	var item2Points = calculatePoints(item2);
	if (item1Points == item2Points) {
		return item2.key.toUpperCase().localeCompare(item1.key.toUpperCase());
	}
	return (item1Points > item2Points) ? 1 : -1;
}

// Measurement Systems

measurement.findSystem = function (systemName, ignoreCase) {
	return measurement.findSystems(systemName, ignoreCase)[0];
};

measurement.findSystemPartial = function (systemName, ignoreCase) {
	return measurement.findSystemsPartial(systemName, ignoreCase)[0];
};

measurement.findSystems = function (systemName, ignoreCase) {
	return findImpl(measurement.allSystems, 'isMatch', systemName, ignoreCase, systemFilter, systemCalculatePoints);
};

measurement.findSystemsPartial = function (systemName, ignoreCase) {
	return findImpl(measurement.allSystems, 'isPartialMatch', systemName, ignoreCase, systemFilter, systemCalculatePoints);
};

function systemFilter(system) {
	return helpers.contains(allowedSystems(), system);
}

function allowedSystems() {
	var arrSystems = (measurement.options.allowedSystemsForUnits.length == 0)
		? helpers.values(measurement.allSystems)
		: possibleAllowedSystems();
	var toRemove = [];
	helpers.forEach(measurement.options.ignoredSystemsForUnits, function (ignore) {
		if (helpers.contains(arrSystems, ignore)) {
			toRemove.push(ignore);
			toRemove = toRemove.concat(checkRemoveParent(ignore.parent));
		}
	});
	arrSystems = arrSystems.filter(function (system) {
		return (!helpers.contains(toRemove, system));
	});
	return arrSystems;
}

function possibleAllowedSystems() {
	var results = measurement.options.allowedSystemsForUnits.map(function (system) {
		return system.ancestors();
	});
	results = helpers.flatten(results);
	return helpers.unique(results);
}

function checkRemoveParent(parent) {
	var toRemove = [];
	if (parent) {
		if (!helpers.contains(measurement.options.allowedSystemsForUnits, parent)) {
			toRemove.push(parent);
			toRemove = toRemove.concat(checkRemoveParent(parent.parent));
		}
	}
	return toRemove;
}

function systemCalculatePoints(system) {
	var points = 0;
	if (system.isRoot()) {
		points += 1000;
	}
	points -= (10 * system.ancestors().length);
	return points;
}

// Dimension Definitions

measurement.findDimension = function (dimensionName, ignoreCase) {
	return measurement.findDimensions(dimensionName, ignoreCase)[0];
};

measurement.findDimensionPartial = function (dimensionName, ignoreCase) {
	return measurement.findDimensionsPartial(dimensionName, ignoreCase)[0];
};

measurement.findDimensions = function (dimensionName, ignoreCase) {
	return findImpl(measurement.dimensions, 'isMatch', dimensionName, ignoreCase, dimensionFilter, dimensionCalculatePoints);
};

measurement.findDimensionsPartial = function (dimensionName, ignoreCase) {
	return findImpl(measurement.dimensions, 'isPartialMatch', dimensionName, ignoreCase, dimensionFilter, dimensionCalculatePoints);
};

function dimensionFilter(dimension) {
	if (!measurement.options.allowVectorDimensions && dimension.vector) {
		return false;
	}
	if (!measurement.options.allowDerivedDimensions && dimension.isDerived()) {
		return false;
	}
	if (helpers.contains(measurement.options.ignoredDimensions, dimension)) {
		return false;
	}
	return true;
}

function dimensionCalculatePoints(dimension) {
	var points = 0;
	if (!dimension.isDerived()) {
		points += 100;
	}
	if (!dimension.dimensionless) {
		points += 1000;
	}
	if (!dimension.vector) {
		points += 10000;
	}
	return points;
}

// Units

measurement.findBaseUnit = function (dimensionName, ignoreCase) {
	var dimension = measurement.findDimension(dimensionName, ignoreCase);
	return (dimension) ? dimension.baseUnit : null;
};

measurement.findBaseUnitPartial = function (dimensionName, ignoreCase) {
	var dimension = measurement.findDimensionPartial(dimensionName, ignoreCase);
	return (dimension) ? dimension.baseUnit : null;
};

measurement.findUnit = function (unitName, dimensionName, ignoreCase) {
	return measurement.findUnits(unitName, dimensionName, ignoreCase)[0];
};

measurement.findUnitPartial = function (unitName, dimensionName, ignoreCase) {
	return measurement.findUnitsPartial(unitName, dimensionName, ignoreCase)[0];
};

measurement.findUnits = function (unitName, dimensionName, ignoreCase) {
	var units;
	if (dimensionName && dimensionName.class && dimensionName.class == "DimensionDefinition") {
		units = dimensionName.units;
	} else {
		units = (dimensionName) ? measurement.findDimension(dimensionName, ignoreCase).units : measurement.allUnits;
	}
	return findImpl(units, 'isMatch', unitName, ignoreCase, unitFilter, unitCalculatePoints);
};

measurement.findUnitsPartial = function (unitName, dimensionName, ignoreCase) {
	var units;
	if (dimensionName && dimensionName.class && dimensionName.class == "DimensionDefinition") {
		units = dimensionName.units;
	} else {
		units = (dimensionName) ? measurement.findDimensionPartial(dimensionName, ignoreCase).units : measurement.allUnits;
	}
	return findImpl(units, 'isPartialMatch', unitName, ignoreCase, unitFilter, unitCalculatePoints);
};

function unitFilter(unit) {
	if (!measurement.options.useRareUnits && unit.rare) {
		return false;
	}
	if (!measurement.options.useEstimatedUnits && unit.estimation) {
		return false;
	}
	if (helpers.values(unit.systems).filter(systemFilter).length == 0) {
		return false;
	}
	return true;
}

function unitCalculatePoints(unit) {
	var points = 0;
	points += dimensionCalculatePoints(unit.dimension);
	if (unit.isBaseUnit()) {
		points += 10000;
	}
	if (!unit.rare) {
		points += 1000;
	}
	if (!unit.estimation) {
		points += 100;
	}
	return points;
}

// Prefixes

measurement.findPrefix = function (prefixName, ignoreCase) {
	return measurement.findPrefixes(prefixName, ignoreCase)[0];
};

measurement.findPrefixPartial = function (prefixName, ignoreCase) {
	return measurement.findPrefixesPartial(prefixName, ignoreCase)[0];
};

measurement.findPrefixes = function (prefixName, ignoreCase) {
	return findImpl(measurement.prefixes, 'isMatch', prefixName, ignoreCase, prefixFilter, prefixCalculatePoints);
};

measurement.findPrefixesPartial = function (prefixName, ignoreCase) {
	return findImpl(measurement.prefixes, 'isPartialMatch', prefixName, ignoreCase, prefixFilter, prefixCalculatePoints);
};

function prefixFilter(prefix) {
	if (!measurement.options.useRarePrefixes && prefix.rare) {
		return false;
	}
	if (!measurement.options.useUnofficalPrefixes && prefix.type === 'siUnofficial') {
		return false;
	}
	return true;
}

function prefixCalculatePoints(prefix) {
	var points = 0;
	if (prefix.type !== 'siUnofficial') {
		points += 1000;
	}
	if (!prefix.rare) {
		points += 100;
	}
	if (prefix.type !== 'siBinary') {
		points += 10;
	}
	return points;
}

// Expose some private functions for testing
measurement._private = {
	compare: compare,
	systemFilter: systemFilter,
	systemCalculatePoints: systemCalculatePoints,
	dimensionFilter: dimensionFilter,
	dimensionCalculatePoints: dimensionCalculatePoints,
	unitFilter: unitFilter,
	unitCalculatePoints: unitCalculatePoints,
	prefixFilter: prefixFilter,
	prefixCalculatePoints: prefixCalculatePoints
};

// LOAD

measurement.load(systemsJson);
