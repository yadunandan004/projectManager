'use strict';
const gulp = require('gulp');
const livereload= require('gulp-livereload');
const nodemon= require('gulp-nodemon');
const notify= require('gulp-notify');

gulp.task('default',()=>{
	livereload.listen();
	nodemon({script:'./bin/www'})
	.on('restart',()=>{
		gulp.src('./bin/www')
		.pipe(livereload())
		.pipe(notify('Reloading page, please wait...'));
	})
})