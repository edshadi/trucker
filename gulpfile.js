var gulp = require('gulp');
var gutil = require('gulp-util');
var react = require('gulp-react');
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

gulp.task('javascript', function() {
  return gulp.src('assets/js/**/*.js')
    .pipe(react())
    .pipe(concat('trucker.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('public/build/'));
});

// Browserify the source tree into a client-side library

function browserifyTask() {
  return gulp.src('public/build/trucker.js')
    .pipe(browserify({
      transform: ['envify']
    }))
    .pipe(gulp.dest('public/build/'))
    .pipe(gulp.dest('public/build/'));
}

gulp.task('browserify', ['javascript'], browserifyTask);

// Compile and minify css
gulp.task('styles', function() {
  return gulp.src('assets/**/*.css')
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
      gulp.watch('assets/**/*.js', ['javascript']);
      gulp.watch('assets/**/*.css', ['styles']);
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
