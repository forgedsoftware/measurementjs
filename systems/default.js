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
		systems: 'This is currently a stub'
	});
}));