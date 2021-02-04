'use strict';
 
var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	sourcemaps 		= require('gulp-sourcemaps'),
	cleancss      	= require('gulp-clean-css'),
	browserSync   	= require('browser-sync'),
	rename        	= require('gulp-rename'),
	notify        	= require('gulp-notify'),
	concat        	= require('gulp-concat'),
	uglify			= require('gulp-uglify'),
	babel 			= require('gulp-babel'),
	rsync         	= require('gulp-rsync');
 
sass.compiler = require('node-sass');

gulp.task('browser-sync', function() {
	browserSync.init({
    	// proxy: "localhost/php_formulaire_2019/",
    	server: {
    		baseDir: "./"
    	}
  	})	
});
 
gulp.task('styles', function () {
	return gulp.src('./app/css/src/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./app/css/dist'))
	.pipe( notify( { message: 'TASK: "scss" Complété !', onLast: true } ) )
	.pipe(browserSync.stream());
});

gulp.task('scripts', function () {
	return gulp.src([
		'./app/libs/jquery/jquery-3.5.1.min.js',
		'./app/js/src/**/*.js'
		
	])
	.pipe(sourcemaps.init())
	.pipe(babel({
        presets: ['@babel/env']
    }))
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./app/js/dist'))
	.pipe( notify( { message: 'TASK: "js" Complété !', onLast: true } ) )
	.pipe(browserSync.reload({stream:true}));
});

// gulp.task('rsync', function() {
// 	return gulp.src('app/**')
// 	.pipe(rsync({
// 		root: 'app/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		// exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

gulp.task('code', function() {
	return gulp.src('**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});
 
gulp.task('watch', function () {
  gulp.watch('./app/css/src/**/*.scss', gulp.parallel('styles'));
  gulp.watch(['libs/**/*.js', 'app/js/src/*.js'], gulp.parallel('scripts'));
  gulp.watch('**/*.html', gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('styles', 'scripts','watch', 'code', 'browser-sync'));