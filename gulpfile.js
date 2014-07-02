/*jslint node: true */
'use strict';

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mocha = require('gulp-mocha'),
	bump = require('gulp-bump'),
	Stream = require('stream'),
	gulpExt = require('./gulp/gulpExtensions');

var raw_destination = './raw_systems';

// Bump Version
gulp.task('bump', function () {
	return gulp.src(['./package.json', './bower.json'])
		.pipe(bump({ type: 'prerelease', indent: 4 }))
		.pipe(gulp.dest('./'));
});

// Lint JS Files
gulp.task('lint', function() {
	return gulp.src('./*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Unit Tests
gulp.task('test', function() {
	return gulp.src('./test/*.js')
		.pipe(mocha({ ui: 'tdd', reporter: 'nyan' }));
});

// Create and Build Systems
gulp.task('systems', ['full_systems', 'default_systems', 'minimal_systems', 'stand_alone_systems']);

function processSystem(name, unitFilter, systemFilter) {
	return gulp.src('./common/systems.json')
		.pipe(gulpExt.filterSystems(systemFilter || function () { return true; }))
		.pipe(gulpExt.filterUnits(unitFilter || function () { return true; }))
		.pipe(rename(name))
		.pipe(gulp.dest(raw_destination))
		.pipe(gulpExt.jsonToJs({ standAlone: false }))
		.pipe(gulpExt.insertSystems('./measurement.js'))
		.pipe(rename('./measurement_' + name))
		.pipe(rename({ extname: '.js' }))
		.pipe(gulp.dest('./built/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('min/'));
}

gulp.task('full_systems', function () {
	return processSystem('full.json');
});

gulp.task('default_systems', function () {
	return processSystem('default.json',
		function (unit) {
			return !unit.rare && !(unit.systems && (unit.systems.indexOf('historical') > -1));
		});
});

gulp.task('minimal_systems', function () {
	return processSystem('minimal.json',
		function (unit) {
			return unit.systems &&
				((unit.systems.indexOf('usCustomary') > -1) || (unit.systems.indexOf('si') > -1) || (unit.systems.indexOf('imperial') > -1)) &&
				!unit.rare &&
				unit.systems.indexOf('historical') == -1;
		},
		function (system, systemName) {
			return ['length', 'area', 'volume', 'speed', 'acceleration',
				'pressure', 'mass', 'time', 'temperature',
				'energy', 'density', 'information'].indexOf(systemName) > -1;
		});
});

// JSON to stand alone JS Systems
gulp.task('stand_alone_systems', function() {
	return gulp.src(raw_destination + '/*.json')
		.pipe(gulpExt.jsonToJs({ standAlone: true }))
		.pipe(rename({ extname: '.js' }))
		.pipe(gulp.dest('./systems/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('**/*.js', ['lint', 'test']);
});

// General Tasks
gulp.task('build', ['systems', 'lint', 'test']);
gulp.task('release', ['build', 'bump']);

// Default Task
gulp.task('default', ['build', 'watch']);

// Helper Functions

function filterUnits(filterFunc) {
	return doFuncToJsObject(function (json) {
		for (var propertyName in json.systems) {
			for (var unitName in json.systems[propertyName].units) {
				if (!filterFunc(json.systems[propertyName].units[unitName], unitName)) {
					delete json.systems[propertyName].units[unitName];
				}
			}
		}
	});
}

function filterSystems (filterFunc) {
	return doFuncToJsObject(function (json) {
		for (var propertyName in json.systems) {
			if (!filterFunc(json.systems[propertyName], propertyName)) {
				delete json.systems[propertyName];
			}
		}
	});
}

function doFuncToJsObject (modifyObjFunc) {
	var stream = new Stream.Transform({objectMode: true});

	stream._transform = function (file, encoding, callback) {
		try {
			var json = JSON.parse(file.contents.toString(encoding));
			modifyObjFunc(json);
			file.contents = new Buffer(JSON.stringify(json, null, '\t'));
		} catch (err) {
			console.log(err);
		}
		callback(null, file);
	};

	return stream;
}
