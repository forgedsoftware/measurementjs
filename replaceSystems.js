/*jslint node: true */
'use strict';

var Stream = require('stream'),
	fs = require('fs'),
	jsbeautify  = require('js-beautify').js_beautify,
	PluginError = require('gulp-util').PluginError;

function replaceSystems (baseFileName, destFileName) {

	var stream = new Stream.Transform({objectMode: true});

	stream._transform = function (file, unused, callback) {
		try {
			//console.log(systemFileName);
			var measurementContents = fs.readFileSync(baseFileName).toString('utf8');
			var embeddedContents = file.contents.toString('utf8');

			var modifiedContents = measurementContents.replace('/* EMBED_SYSTEMS */', function () {
				return embeddedContents.replace(/\n/g, function () {
					return '\n\t';
				});
			});
			file.contents = new Buffer(modifiedContents);
		}
		catch (err) {
			console.log(err);
			this.emit('error', new PluginError('gulp-json-to-js', err));
		}
		callback(null, file);
	};

	return stream;
}

module.exports = replaceSystems;
