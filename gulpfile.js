var autoprefixer = require('gulp-autoprefixer'),
  cache = require('gulp-cache'),
  combineMq = require('gulp-combine-mq'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  fs = require('fs'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  livereload = require('gulp-livereload'),
  mkpath = require('mkpath'),
  minifycss = require('gulp-minify-css'),
  notify = require("gulp-notify"),
  order = require("gulp-order"),
  p = require('./package.json'),
  path = require('path'),
  plumber = require('gulp-plumber'),
  rename = require("gulp-rename"),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch');

// Error handling
// ========================================
// Setup an error handler to format errors, output to terminal, and create a notification

var errorHandler = function(error) {
  notify.onError({
    title: 'Error: <%= error.message %>',
    subtitle: "On line <%= error.lineNumber %> of <%= error.fileName.substr(error.fileName.lastIndexOf('/') + 1) %>",
    message: "<%= error.fileName %>",
    sound: 'Basso',
    open: '<%= error.fileName %>',
    emitError: true
  })(error);

  gutil.log(gutil.colors.cyan(error.plugin)+': ['+gutil.colors.red.bold("ERROR")+'] '+gutil.colors.red(error.name));
  gutil.log(gutil.colors.blue('Line '+error.lineNumber+': '+error.fileName));
  if(error.message) {
    gutil.log(gutil.colors.red.bold(error.message));
  } else {
    guitl.log("No Error Message!");
  }
  
  if(error.stack != undefined) {
    gutil.log(gutil.colors.yellow('STACK TRACE -> '));
    gutil.log(error.stack);
  }
};


// Livereload & webserver
// ========================================

// Tiny Webserver + Livereload
gulp.task('webserver', function() {
 connect.server({
  root: '/',
  livereload: true,
 });
});


//Task for creating sass partials that runs after bower installs
gulp.task('cssToScss', function() {
  return gulp.src("./bower_components/**/*.css")
  .pipe(plumber(errorHandler))
  .pipe(rename({
    prefix: "_",
    extname: ".scss"
  }))
  .pipe(gulp.dest(function(file) { return file.base; }))
  .pipe(plumber.stop());
});


// Styles tasks
// ========================================

// Compile Sass, autoprefix, combine mediaqueries and minify css
gulp.task('styles', function() {

  return gulp.src('scss/styles.scss')
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded'}, {sourcemap: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(combineMq())
    .pipe(gulp.dest('/css/'))
    .pipe(minifycss())
    .pipe(rename(function(path) {
      path.basename += "-min";
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: '/css'
    }))
    .pipe(gulp.dest('/css/'))
    .pipe(plumber.stop());
});


// Javascript tasks
// ========================================

// Concatenate and minify libraries, plugins, and main.js
// gulp.task('scripts', function() {
//   return gulp.src('/js/*.js')
//     .pipe(plumber(errorHandler))
//     .pipe(order([
//         "bower_components/**/*.js",
//         "bower_components/hope-framework/plugins/*.js",
//         folders.src+"/js/plugins/*.js",
//         "bower_components/hope-framework/components/*.js",
//         folders.src+"/js/**/*.js",
//         folders.src+"js/*.js"
//       ], { base: "./" }))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('/js'))
//     .pipe(uglify())
//     .pipe(rename('main-min.js'))
//     .pipe(gulp.dest('/js'))
//     .pipe(plumber.stop());
// });


// Default task
gulp.task('default', function() {
    gulp.start('watch');
});


// Watching things
// ========================================

gulp.task('watch', function() {

  gulp.start('webserver');
  livereload.listen();

  var path = require('path');

  // Watch for changes in source files
  // gulp.watch(folders.src+'/assets/fonts/**/*', ['fonts']);
  gulp.watch(['scss/*.scss'], ['styles']);
  // gulp.watch([folders.src+'/js/**/*.js'], ['scripts']);
  // gulp.watch(folders.src+'/js/vendor/*.js', ['markup']);
  // gulp.watch(folders.src+'/assets/img/**/*', ['images']);
  // gulp.watch(folders.src+'/assets/vid/**/*', ['videos']);
  // gulp.watch([folders.src+'/assets/icons/*.svg'], ['icons']);
  // gulp.watch([folders.src+'/data/**/*'], ['markup']);
  // gulp.watch(['src/styleref/**/*'], ['styleref']);

  // Choose whether to use Nunjucks, markdown or straight HTML
  // ==================

  // Compile Nunjucks
  // gulp.watch([folders.src+'/**/*.html', folders.src+'/data/locales/*.yaml'], ['markup']);

   // Compile Markdown
   // gulp.watch([folders.src+'/**/*.md', folders.src+'/data/locales/*.json'], ['markdown']);

  // Process HTML
  // gulp.watch([folders.src+'/**/*.html', folders.src+'/data/locales/*.json'], ['html']);

  // Watch for changes in 'compiled' files
   gulp.watch('/**/*', function (file) {
       var relPath = '\\' + path.relative('/', file.path);
       gutil.log('File changed: ' + gutil.colors.magenta(relPath));
       notify({ 
         title: "Success",
         message: 'File '+relPath+' compiled successfully', 
         sound: 'Bottle',
       });
       livereload.changed(file.path);
       livereload();
   });

});
