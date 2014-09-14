var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');

gulp.task('clean', function() {
  return gulp.src(['public/build/*'], {read: false}).pipe(clean());
});

// Parse and compress JS and JSX files

gulp.task('browserify', function() {
  gulp.src('src/js/trucker.react.js')
    .pipe(browserify({transform: 'reactify'}))
    .pipe(concat('trucker.js'))
    .pipe(gulp.dest('public/build'));
});

// Compile and minify css
gulp.task('styles', function() {
  return gulp.src('src/**/*.css')
    .pipe(concat('trucker.css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/build/'));
});

// Local development (live reloading)

gulp.task('watch', ['clean'], function() {
  var watching = false;
  gulp.start('browserify', 'styles', function() {
    // Protect against this function being called twice
    if (!watching) {
      watching = true;
      gulp.watch('src/**/*.js', ['browserify']);
      gulp.watch('src/**/*.css', ['styles']);
      nodemon({
        script: 'server.js',
        watch: 'build'
      });
    }
  });
});

gulp.task('default', ['clean'], function() {
  return gulp.start('watch');
});
