var gulp    = require('gulp'),
uglify      = require('gulp-uglify'),
changed     = require('gulp-changed')
imagemin    = require('gulp-imagemin'),
stripDebug  = require('gulp-strip-debug'),
minifyCSS   = require('gulp-minify-css'),
minifyHTML  = require('gulp-minify-html'),
browserify  = require('gulp-browserify');

gulp.task('js', function(){
	gulp.src('js/controllers/*.js')
	.pipe(browserify()).on('error', errorHandler)
	.pipe(uglify({compress: true}))
	.pipe(stripDebug())
	.pipe(gulp.dest('public/js'));
});

gulp.task('images', function () {
  var imgSrc = 'imgs/**/*',
      imgDst = 'public/imgs';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('html', function () {
  var htmlSrc = 'views/*.html',
      htmlDst = 'public';

  gulp.src(htmlSrc)
  .pipe(minifyHTML())
  .pipe(gulp.dest(htmlDst));
});

gulp.task('default', [ 'js', 'images', 'html' ]);

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

