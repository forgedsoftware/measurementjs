/*jslint node: true */
'use strict';

var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mocha = require('gulp-mocha'),
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

// Browserify
gulp.task('browserify', function() {

	var bundler = browserify({
		entries: ['./lib/measurement_shim.js']
	});

	var bundle = function() {
		return bundler
			.bundle()
			.pipe(source('measurement.js'))
			.pipe(buffer())
			.pipe(gulp.dest('./web/'))
			.pipe(rename({ suffix: '.min' }))
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./web/'));
	};

	return bundle();
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['lib/**/*.js', 'test/*.js'], ['build']);
});

// General Tasks
gulp.task('build', ['lint', 'test', 'browserify']);
gulp.task('release', ['build', 'bump']);

// Default Task
gulp.task('default', ['build', 'watch']);
