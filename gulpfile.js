var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var useref      = require('gulp-useref');
var uglify      = require('gulp-uglify');
var gulpIf      = require('gulp-if');
var cssnano     = require('gulp-cssnano');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
var del         = require('del');
var runSequence = require('gulp4-run-sequence');

// Install the NPM
// ----------------
// npm install gulp gulp-sass browser-sync gulp-useref gulp-if gulp-uglify gulp-cache gulp-cssnano gulp-imagemin del gulp4-run-sequence



// Main General task (SASS, browser-sync and watch)

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/**/*.+(scss|sass)")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./app/"
    });

    gulp.watch("app/scss/**/*.+(scss|sass)", gulp.series('sass'));
    gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
}));




// Optimization Tasks

// Minifying the Js files
gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if its a Javascript file
    .pipe(gulpIf('*.js',uglify()))
    .pipe(gulp.dest('dist'))
});

// Minifying the CSS files
gulp.task ('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    // Minify only if its a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Optimizing the Images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// Copying the fonts in dist
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// // Cleaning 
// gulp.task('clean', function() {
//     return del.sync('dist').then(function(cb) {
//         return cache.clearAll(cb);
//     });
// })

// gulp.task('clean:dist', function() {
//     return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
// });

// Build Sequences
// ---------------

gulp.task('default', gulp.series('serve'));


gulp.task('build', function(callback) {
    runSequence(
        // 'clean:dist',
        'sass',['useref', 'images', 'fonts'],
        callback
    )
})
