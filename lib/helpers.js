var helpers = {
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
	values: function (obj) {
		var values = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				values.push(obj[key]);
			}
		}
		return values;
	},
	flatten: function (array) {
		return array.reduce(function (a, b) {
			var arr = (helpers.isArray(a)) ? a : [a];
			if (helpers.isArray(b)) {
				return arr.concat(b);
			} else {
				arr.push(b);
				return arr;
			}
			
		});
	},
	unique: function (array) {
		var result = [];
		for (var i = 0; i < array.length; i++) {
			if (!helpers.contains(result, array[i])) {
				result.push(array[i]);
			}
		}
		return result;
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
	isBoolean: function (value) {
		return (typeof value === 'boolean');
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
	},
	splice: function(str, index, insertedStr) {
		return str.slice(0, index) + insertedStr + str.slice(index);
	},
	contains: function (array, str) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === str) {
				return true;
			}
		}
		return false;
	},
	containsPartial: function (array, str) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].indexOf(str) >= 0) {
				return true;
			}
		}
		return false;
	},
	isMatch: function(value, search, ignoreCase) {
		value = value || '';
		search = search || '';
		if (ignoreCase) {
			value = value.toUpperCase();
			search = search.toUpperCase();
		}
		return (value === search);
	},
	isPartialMatch: function(value, search, ignoreCase) {
		value = value || '';
		search = search || '';
		if (ignoreCase) {
			value = value.toUpperCase();
			search = search.toUpperCase();
		}
		return (value.indexOf(search) >= 0);
	},
	isArrayMatch: function(array, search, ignoreCase) {
		array = array || [];
		search = search || '';
		if (ignoreCase) {
			array = array.map(function (a) {
				return a.toUpperCase();
			});
			search = search.toUpperCase();
		}
		return helpers.contains(array, search);
	},
	isArrayPartialMatch: function(array, search, ignoreCase) {
		array = array || [];
		search = search || '';
		if (ignoreCase) {
			array = array.map(function (a) {
				return a.toUpperCase();
			});
			search = search.toUpperCase();
		}
		return helpers.containsPartial(array, search);
	}
};

module.exports = helpers;
