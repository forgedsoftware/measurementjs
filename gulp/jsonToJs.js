/*jslint node: true */
'use strict';

var Stream = require('stream'),
	jsbeautify  = require('js-beautify').js_beautify,
	PluginError = require('gulp-util').PluginError;

function gulpJsonToJs (config) {
	config = config || {};

	var stream = new Stream.Transform({objectMode: true});

	function convertToText(obj) {
		var properties = [],
			text = [];

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

	stream._transform = function (file, unused, callback) {
		try {
			var json = JSON.parse(file.contents.toString('utf8'));
			if (config.standAlone) {
				json = '// This file is generated from ./common/systems/' + file.relative + ' \n' +
					'(function (factory) {\n' +
						'if (typeof define === \'function\' && define.amd) {\n' +
							'define([\'measurement\'], factory); // AMD\n' +
						'} else if (typeof exports === \'object\') {\n' +
							'module.exports = factory(require(\'../measurement\')); // Node\n' +
						'} else {\n' +
							'factory(window.measurement); // Browser global\n' +
						'}\n' +
					'}(function (measurement) {\n' +
						'return measurement.add(' + convertToText(json) + ');\n' +
					'}));\n';
			} else {
				json = 'MeasurementSystems = ' + convertToText(json) + ';\n';
			}
			json = jsbeautify(json, {
				indent_with_tabs: true,
				brace_style: 'collapse'
			});
			file.contents = new Buffer(json);
		}
		catch (err) {
			console.log(err);
			this.emit('error', new PluginError('gulp-json-to-js', err));
		}
		callback(null, file);
	};

	return stream;
}

module.exports = gulpJsonToJs;
