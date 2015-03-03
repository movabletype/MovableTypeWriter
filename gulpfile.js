// @file gulpfile.js
var gulp       = require('gulp');
var sass       = require('gulp-ruby-sass');
var plumber    = require('gulp-plumber');
var pleeease   = require('gulp-pleeease');
var del        = require('del');
var vinylPaths = require('vinyl-paths');

// Clean
gulp.task('clean', function (cb) {
  return gulp.src( './dist' )
    .pipe(vinylPaths( del ));
});

// SASS Compile
gulp.task('sass', ['clean'], function () {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      style : 'expanded',
      "sourcemap=none" : true
    }))
    .pipe(pleeease({
      autoprefixer: {
        browsers: ['last 2 versions']
      },
      minifier: false
    }))
    .pipe(gulp.dest('app/styles/'))
    .pipe(gulp.dest('dist/css'));
});

// File Watcher
gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);
});

// Copy to dist
gulp.task('copy', ['sass'], function() {
  // I18N files
  gulp.src('app/_locales/**')
    .pipe(gulp.dest('dist/_locales'));

  // Verder libraries - Bootstrap
  gulp.src('app/bower_components/bootstrap/dist/**')
    .pipe(gulp.dest('dist/vender/bootstrap'));

  // Verder libraries - Angular
  gulp.src('app/bower_components/angular/*.css')
    .pipe(gulp.dest('dist/vender/angular'));
  gulp.src('app/bower_components/angular/*.js')
    .pipe(gulp.dest('dist/vender/angular'));

  // Verder libraries - Angular UI Bootstrap
  gulp.src('app/bower_components/angular-ui-bootstrap-bower/*.js')
    .pipe(gulp.dest('dist/vender/angular-ui-bootstrap-bower'));

  // Vender libraries - Angular Route
  gulp.src('app/bower_components/angular-route/*.js')
    .pipe(gulp.dest('dist/vender/angular-route'));

  // Vender libraries - Angular Messages
  gulp.src('app/bower_components/angular-messages/*.js')
    .pipe(gulp.dest('dist/vender/angular-messages'));

  // Vender libraries - Angular SummerNote
  gulp.src('app/bower_components/angular-summernote/dist/*.js')
    .pipe(gulp.dest('dist/vender/angular-summernote'));

  // Verder libraries - Font Awesome
  gulp.src('app/bower_components/font-awesome/css/**')
    .pipe(gulp.dest('dist/vender/font-awesome/css'));
  gulp.src('app/bower_components/font-awesome/fonts/**')
    .pipe(gulp.dest('dist/vender/font-awesome/fonts'));

  // Verder libraries - jQuery
  gulp.src('app/bower_components/jquery/dist/**')
    .pipe(gulp.dest('dist/vender/jquery'));

  // Verder libraries - Summer Note
  gulp.src('app/bower_components/summernote/dist/**')
    .pipe(gulp.dest('dist/vender/summernote'));

  // Application Files
  gulp.src('app/images/**')
    .pipe(gulp.dest('dist/images'));
  gulp.src('app/scripts/**')
    .pipe(gulp.dest('dist/js'));
  gulp.src('app/views/**')
    .pipe(gulp.dest('dist/views'));
  gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
  gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
  gulp.src('app/*.json')
    .pipe(gulp.dest('dist'));
});

// Default tasks
gulp.task('default', ['copy']);

