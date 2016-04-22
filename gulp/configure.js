'use strict';

var gulp = require('gulp');
var weBallConstants = require('../config/weBall.constants.json');
var $ = require('gulp-load-plugins')();
var conf = require('./conf');

gulp.task('config', function () {
  return $.ngConstant({
      name: 'myBall.config',
      templatePath: './config/constant.tpl.ejs',
      constants: weBallConstants[conf.env],
      stream: true
    })
    .pipe($.rename('myBall.constants.js'))
    .pipe($.jsbeautifier({
      js: {
        indentSize: 2
      }
    }))
    // Writes config.js to src/app/config.js folder
    .pipe(gulp.dest('src/app'));
});