/*jslint node: true */
'use strict';

var helpers = require('../../lib/helpers.js');

var Prefix = (function () {
	function PrefixImpl(key, config) {
		validate(key, config);
		this.key = key;
		this.symbol = config.symbol;
		this.type = config.type;
		this.rare = config.rare;
		this.multiplier = config.multiplier;
		this.power = config.power;
		this.base = config.base;
		this._config = config;
	}

	function validate(key, config) {
		if (!key || !config) {
			throw new Error('all parameters must be defined');
		}
		if(!helpers.isString(key)) {
			throw new Error('prefix key must be a string');
		}
		if(!helpers.isObject(config)) {
			throw new Error('prefix config must be an object');
		}
	}

	PrefixImpl.prototype.class = function () {
		return 'Prefix';
	}

	PrefixImpl.prototype.apply = function (value) {
		if (this.power && this.base) {
			return value/Math.pow(this.base, this.power);
		}
		if (this.multiplier) {
			return value/this.multiplier;
		}
		return value;
	}

	PrefixImpl.prototype.remove = function (value) {
		if (this.power && this.base) {
			return value * Math.pow(this.base, this.power);
		}
		if (this.multiplier) {
			return value * this.multiplier;
		}
		return value;
	}

	// FIND

	PrefixImpl.prototype.isMatch = function (value, ignoreCase) {
		return isMatchImpl(this, helpers.isMatch, value, ignoreCase);
	}

	PrefixImpl.prototype.isPartialMatch = function (value, ignoreCase) {
		return this.isMatch(value, ignoreCase)
			|| isMatchImpl(this, helpers.isPartialMatch, value, ignoreCase);
	}

	function isMatchImpl(system, func, value, ignoreCase) {
		return func(system.key, value, ignoreCase)
			|| func(system.symbol, value, ignoreCase);
	}

	// CLONE

	PrefixImpl.prototype.clone = function () {
		return new Prefix(this.key, this._config);
	}

	// SERIALIZE

	PrefixImpl.prototype.serialize = function () {
		var prefix = {
			key: this.key,
			symbol: this.symbol,
			type: this.type
		};

		if (this.multiplier) { prefix.multiplier = this.multiplier; }
		if (this.power) { prefix.power = this.power; }
		if (this.base) { prefix.base = this.base; }
		if (this.rare) { prefix.rare = this.rare; }

		return prefix;
	}

	return PrefixImpl;
}());

module.exports = Prefix;