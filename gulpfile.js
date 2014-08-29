var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var del = require('del');

var paths = {
  libs: ['static/js/lib/angular/*.js', 'static/js/lib/*.js'],
  controllers: ['./static/js/components/**/*.js']
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.libs)
    .pipe(uglify())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('static/js/build/lib'));
});

gulp.task('inject', function() {
  return gulp.src('./static/partials/index.html')
    .pipe(inject(gulp.src(paths.controllers, {read: false}), {
      ignorePath: 'static'
    }))
    .pipe(gulp.dest('./static'));
});

gulp.task('clean', function(cb) {
  return del([
    'static/js/build',
    'static/index.html'
  ], cb);
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts', 'inject');
});
