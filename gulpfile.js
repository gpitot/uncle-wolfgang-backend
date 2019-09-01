//const gulp = require('gulp-param')(require('gulp'), process.argv);
const zip = require('gulp-zip');
const gulp = require('gulp');
const argv = require('yargs').argv



const PROJECT = argv.PROJECT;
const VERSION = argv.VERSION;


gulp.task('build', function() {
    //copy package.json to build folder
    return gulp.src('package.json')
        .pipe(gulp.dest('build/'));
})

gulp.task('ebexte', function() {
    //copy package.json to build folder
    return gulp.src('.ebextensions')
        .pipe(gulp.dest('build/'));
})

gulp.task('package', function() {
    //zipped folder of build
    return gulp.src('build/**')
        .pipe(zip(`${PROJECT}-${VERSION}.zip`))
        .pipe(gulp.dest('temp/'));
});

gulp.task('default', gulp.series('build', 'ebexte', 'package'), function(cb) {
    cb();
});