'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.less')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });
  gulp.watch(path.join(conf.paths.src, '/lib/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('lib');
    } else {
      gulp.start('inject');
    }
  });

  // gulp.watch(path.join(conf.paths.src, '/data/**/*.js'), function(event){
  //   if(isOnlyChange(event)) {
  //     gulp.start('values');
  //   } else {
  //     gulp.start('inject');
  //   }
  // });

  gulp.watch(path.join(conf.paths.po, '/**/*.po'), function(event){
    if(isOnlyChange(event)) {
      gulp.start('translations');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
