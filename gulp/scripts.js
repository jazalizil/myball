'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});

gulp.task('lib', function() {
  return gulp.src(path.join(conf.paths.src, '/lib/**/*.js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});