/*jslint node: true */
'use strict';

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mocha = require('gulp-mocha'),
	jsonToJs = require('./jsonToJs'),
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
		.pipe(jsonToJs())
		.pipe(rename({ extname: ".js" }))
		.pipe(gulp.dest('./systems/'));
});

// Minify JS
gulp.task('minify', function() {
	return gulp.src('./measurement.js')
		.pipe(rename('measurement.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('min/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('**/*.js', ['build']);
});

// General Tasks
gulp.task('build', ['systems', 'lint', 'test', 'minify']);
gulp.task('release', ['build', 'bump']);

// Default Task
gulp.task('default', ['build', 'watch']);
