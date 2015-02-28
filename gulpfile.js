/*jslint node: true */
'use strict';

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mocha = require('gulp-mocha'),
	mochaPhantomJS = require('gulp-mocha-phantomjs'),
	bump = require('gulp-bump'),
	sourcemaps = require('gulp-sourcemaps'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	glob = require('glob'),
	runSequence = require('run-sequence');

// Bump Version
gulp.task('bump', function () {
	return gulp.src(['./package.json', './bower.json'])
		.pipe(bump({ type: 'prerelease', indent: 4 }))
		.pipe(gulp.dest('./'));
});

// Lint JS Files
gulp.task('lint', function () {
	return gulp.src('./*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Unit Tests
gulp.task('node_test', function (cb) {
	gulp.src('./test/*.js')
		.pipe(mocha({ ui: 'tdd', reporter: 'spec' }))
		.once('end', function () {
			cb();
		});
});

gulp.task('web_test', function () {
	return gulp
		.src('./test/web/runner.html')
		.pipe(mochaPhantomJS({
			reporter: 'spec',
			phantomjs: {
				webSecurity: false
			}
		}));
});

// Browserify
gulp.task('browserify', function () {

	var bundler = browserify({
		entries: ['./lib/measurement_shim.js']
	});

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
});

// Browserify
gulp.task('browserify_tests', function () {

	var bundler = browserify({
		entries: glob.sync('./test/*.js')
	});

	return bundler
		.bundle()
		.pipe(source('web_test.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./test/web/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	// We can't run browserify_tests here as it can't be run after node_test as it causes an error
    return gulp.watch(['lib/**/*.js', 'test/*.js'], ['lint', 'node_test']);
});

// General Tasks
gulp.task('test',  function (cb) {
	runSequence('browserify_tests', 'node_test', 'web_test', cb);
});
gulp.task('build', function (cb) {
	runSequence('lint', 'browserify_tests', 'node_test', 'web_test', 'browserify', cb);
});
gulp.task('release', function (cb) {
	runSequence('build', 'bump', cb);
});

// Default Task
gulp.task('default', function (cb) {
	runSequence('build', 'watch', cb);
});
