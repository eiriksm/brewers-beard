var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
  libs: ['src/static/js/lib/angular/*.js', 'src/static/js/lib/*.js']
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.libs)
    .pipe(uglify())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('src/static/js/build/lib'));
});

