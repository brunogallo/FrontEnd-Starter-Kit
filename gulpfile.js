var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
const { src, dest, watch, series } = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const mode = require('gulp-mode')();

function browsersyncServe(cb){
    browsersync.init({
      server: {
        baseDir: './dist'
      }    
    });
    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

gulp.task('process-sass', () => {
    return gulp.src('src/styles/main.scss')
        .pipe(mode.development(sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(concat('styles.css'))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(mode.development(sourcemaps.write()))
        .pipe(gulp.dest('dist/assets/css'));
});

function imgTask(){
    return src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img/'));
}

gulp.task('process-js', () => {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat('scripts.js'))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(mode.development(sourcemaps.init()))
        .pipe(uglify().on('error', (uglify) => {
            console.error(uglify.message);
            this.emit('end');
        }))
        .pipe(mode.development(sourcemaps.write()))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('default', () => {
    gulp.watch(
        ['src/styles/*.scss','src/styles/*/*.scss'],
        { ignoreInitial: false },
        gulp.series('process-sass', browsersyncReload)
    );

    gulp.watch(
        ['src/scripts/*.js','src/scripts/*/*.js'],
        { ignoreInitial: false },
        gulp.series('process-js', browsersyncReload)
    );

    gulp.watch(
        ['dist/*.html'],
        { ignoreInitial: false },
        gulp.series('bs-reload', browsersyncReload)
    );
});

function watchTask(){
    watch(
        ['src/styles/*.scss','src/styles/*/*.scss'],
        { ignoreInitial: false },
        series('process-sass', browsersyncReload)
    );

    watch(
        ['src/scripts/*.js','src/scripts/*/*.js'],
        { ignoreInitial: false },
        series('process-js', browsersyncReload)
    );

    watch(
        ['dist/*.html'],
        { ignoreInitial: false },
        series(browsersyncReload)
    );
}

exports.default = series(
    imgTask,
    browsersyncServe,
    watchTask
);