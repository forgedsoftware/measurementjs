
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

gulp.task('lint', function() {
	return gulp.src('./*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('min', function() {
	return gulp.src('./measurement.js')
		.pipe(rename('measurement.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('min/'));
});

gulp.task('default', ['lint', 'min']);
