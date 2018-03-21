var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    copy = require('gulp-copy'),
    image = require('gulp-image'),
    sass = require('gulp-sass'),
    cleancss = require('gulp-clean-css'),
    maps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    sequence = require('run-sequence'),
    uglify = require('gulp-uglify');

//run the gulp scripts or gulp styles commands at the command line, source maps are generated for the JavaScript and CSS files respectively.
//run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.
gulp.task("scripts", function(){
  return gulp.src("js/**/*.js")
  .pipe(maps.init())
  .pipe(concat("all.js"))
  .pipe(uglify())
  .pipe(rename("all.min.js"))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'))
  //sourcemaps
})

//run the gulp styles command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder
gulp.task("styles", function(){
  return gulp.src("sass/**/*.scss")
  .pipe(maps.init())
  .pipe(sass())
  .pipe(cleancss())
  .pipe(rename("all.min.css"))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'))
})

//run the gulp images command at the command line to optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.
gulp.task("images", function(){
  return gulp.src(["images/*.jpg", "images/*.png"])
  .pipe(image())
  .pipe(gulp.dest('dist/content'))
})

//run the gulp clean command at the command line to delete all of the files and folders in the dist folder
gulp.task("clean", function(){
  return gulp.src("dist/*", { read: false })
  .pipe(clean())
})

// run the gulp build command at the command line to run the clean, scripts, styles, and images tasks with confidence that the clean task completes before the other commands.
gulp.task('copy', function() {
  return gulp.src(['index.html', 'icons'])
  .pipe(gulp.dest('dist/'))
})

gulp.task("build", function(done){
  return sequence('clean', ['scripts', 'styles','images', 'copy'], done)
});

//run the gulp command at the command line to run the build task and serve my project using a local web server.
gulp.task('default', ['build'], function() {
  return gulp.src('./dist')
  .pipe(webserver({
      fallback: './dist/index.html',
      livereload: true,
      host: 'localhost',
      port: 3000,
      directoryListing: false,
      open: true
    }));
})
