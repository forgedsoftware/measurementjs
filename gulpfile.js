/*jslint node: true */
'use strict';

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mocha = require('gulp-mocha'),
	concat = require('gulp-concat'),
	jsonToJs = require('./jsonToJs'),
	replaceSystems = require('./replaceSystems'),
	fs = require('fs'),
	path = require('path'),
	es = require('event-stream'),
	bump = require('gulp-bump');

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

// JSON to JS Systems
gulp.task('systems', function() {
	return gulp.src('./common/systems/*.json')
		.pipe(jsonToJs({ standAlone: true }))
		.pipe(rename({ extname: '.js' }))
		.pipe(gulp.dest('./systems/'));
});

// Concatinate Files & Minify
gulp.task('concat', function() {
	var files = getFiles('./common/systems/');

	var tasks = files.map(function (file) {
		return gulp.src('./common/systems/' + file)
			.pipe(jsonToJs({ standAlone: false }))
			.pipe(replaceSystems('./measurement.js'))
			.pipe(rename('./measurement_' + file))
			.pipe(rename({ extname: '.js' }))
			.pipe(gulp.dest('./built/'))
			.pipe(rename({ suffix: '.min' }))
			.pipe(uglify())
			.pipe(gulp.dest('min/'));
	});
	return es.concat.apply(null, tasks);
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('**/*.js', ['lint', 'test', 'concat']);
});

// General Tasks
gulp.task('build', ['systems', 'lint', 'test', 'concat']);
gulp.task('release', ['build', 'bump']);

// Default Task
gulp.task('default', ['build', 'watch']);

// Helper Functions

function getFiles(dir){
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isFile();
	});
}
