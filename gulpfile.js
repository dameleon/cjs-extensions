var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var pkg = require('./package.json');
var banner = '/*! <%= pkg.name %> // @version <%= pkg.version %>, @license <%= pkg.license %>, @Author <%= pkg.author %> */\n';

gulp.task('lint', function() {
    gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('dist', function() {
    gulp.src('src/*.js')
        .pipe(concat('cjs.extensions.js'))
        .pipe(uglify({ outSourceMap: true, preserveComments: 'some' }))
        .pipe(header(banner, { name: 'CreateJS Extensions', pkg: pkg }))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['lint', 'dist']);
