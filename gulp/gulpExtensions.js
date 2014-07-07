/*jslint node: true */
'use strict';

var Stream = require('stream'),
	fs = require('fs'),
	jsbeautify  = require('js-beautify').js_beautify,
	PluginError = require('gulp-util').PluginError;

// Specific Function - Inserting Systems in measurement.js

function insertSystems (baseFileName) {

	return doFunc(function (file, encoding) {
		var measurementContents, embeddedContents;

		measurementContents = fs.readFileSync(baseFileName).toString(encoding);
		embeddedContents = file.contents.toString(encoding);

		measurementContents = '// This file is generated from ' + baseFileName +
			' and ' + file.relative + '\n\n' + measurementContents;

		return measurementContents.replace('/* EMBED_SYSTEMS */', function () {
			return embeddedContents.replace(/\n/g, function () {
				return '\n\t';
			});
		});
	});
}

// Specific Function - JSON to JS

function jsonToJs (config) {
	config = config || {};

	return doFuncFromJson(function (json, file) {
		json = 'MeasurementSystems = ' + convertToText(json) + ';\n';
		json = jsbeautify(json, {
			indent_with_tabs: true,
			brace_style: 'collapse'
		});
		return json;
	});
}

// Specific Functions - Filtering systems.json

function filterUnits(filterFunc) {
	return doFuncFromJsonToJson(function (json) {
		var propertyName, unitName;

		for (propertyName in json.systems) {
			for (unitName in json.systems[propertyName].units) {
				if (!filterFunc(json.systems[propertyName].units[unitName], unitName)) {
					delete json.systems[propertyName].units[unitName];
				}
			}
		}
	});
}

function filterSystems (filterFunc) {
	return doFuncFromJsonToJson(function (json) {
		var propertyName;

		for (propertyName in json.systems) {
			if (!filterFunc(json.systems[propertyName], propertyName)) {
				delete json.systems[propertyName];
			}
		}
	});
}

// Generic Gulp Functions

function doFunc (modifyObjFunc) {
	var stream = new Stream.Transform({objectMode: true});

	stream._transform = function (file, encoding, callback) {
		var result;

		try {
			result = modifyObjFunc(file, encoding);
			file.contents = new Buffer(result);
		} catch (err) {
			console.log(err.message);
			this.emit('error', new PluginError('gulp-extension-func', err));
		}
		callback(null, file);
	};

	return stream;
}

function doFuncFromJson (modifyObjFunc) {
	return doFunc(function (file, encoding) {
		var json = JSON.parse(file.contents.toString(encoding));
		return modifyObjFunc(json, file);
	});
}

function doFuncFromJsonToJson (modifyObjFunc) {
	return doFuncFromJson(function (json) {
		modifyObjFunc(json);
		return JSON.stringify(json, null, '\t');
	});
}

// Helper Functions

function isObject(obj) {
	return (typeof obj === 'object');
}

function isArray (obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
}

function isFunction (obj) {
	return (typeof obj === 'function');
}

function isString (obj) {
	return (typeof obj === 'string');
}

function forEach (object, fn) {
	var index, objIsArray;

	objIsArray = isArray(object);
	for (index in object) {
		if (object.hasOwnProperty(index)) {
			fn(object[index], objIsArray ? parseInt(index) : index, object);
		}
	}
}

function convertToText(obj) {
	var properties = [],
		text = [];

	if (isObject(obj) && !isArray(obj)) {
		forEach(obj, function (item, prop) {
			properties.push(prop + ': ' + convertToText(item));
		});
		text.push('{', properties.join(', '), '}');
	} else if (isObject(obj)) {
		forEach(obj, function (item) {
			properties.push(convertToText(item));
		});
		text.push('[', properties.join(', '), ']');
	} else if (isFunction(obj)) {
		text.push(obj.toString());
	} else if (isString(obj)) {
		text.push('\'' + obj.replace('\'', '\\\'').replace('"', '\\"') + '\'');
	} else {
		text.push(JSON.stringify(obj));
	}
	return text.join('');
}

// Exports

exports.insertSystems = insertSystems;
exports.jsonToJs = jsonToJs;
exports.filterSystems = filterSystems;
exports.filterUnits = filterUnits;
