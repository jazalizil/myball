/**
 * Created by jazalizil on 14/12/15.
 */
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var conf = require('./conf');

gulp.task('pot', function () {
  return gulp.src([
    path.join(conf.paths.src, '/**/*.html'),
    path.join(conf.paths.src, '/**/*.js')]
  )
    .pipe($.angularGettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(conf.paths.po));
});

gulp.task('translations:dist', function () {
  return gulp.src(path.join(conf.paths.po, '/**/*.po'))
    .pipe($.angularGettext.compile({
      // options to pass to angular-gettext-tools...
      format: 'json'
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/translations/')));
});

gulp.task('translations', function () {
  return gulp.src(path.join(conf.paths.po, '/**/*.po'))
    .pipe($.angularGettext.compile({
      // options to pass to angular-gettext-tools...
      format: 'json'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/translations/')));
});