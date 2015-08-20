var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var size = require('gulp-size');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task('styles', function () {
    return gulp.src('app/styles/*.less')
        .pipe(less({style: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('lint', function () {
    return gulp.src('app/scripts/*.ts').pipe(tslint()).pipe(tslint.report('prose'));
});

gulp.task('ts', function () {
    var tsResult = gulp.src('app/scripts/*.ts').pipe(ts({}));
    return tsResult.js
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(browserSync.stream());
});

gulp.task('html', ['styles', 'ts'], function () {
    var assets = useref.assets({searchPath: ['.tmp', 'app']});
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(minifyHtml({conditionals: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['styles', 'ts'], function () {
    browserSync.init({
        server: ['.tmp', 'app', 'tools']
    });
    gulp.watch('app/styles/*.less', ['styles']);
    gulp.watch('app/scripts/*.ts', ['ts']);
    gulp.watch([
        'app/*.html',
        'app/images/**/*'
    ]).on('change', browserSync.reload);
});

gulp.task('serve:dist', ['build'], function () {
    browserSync.init({
        server: ['dist']
    });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['lint', 'html', 'images'], function () {
    return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
