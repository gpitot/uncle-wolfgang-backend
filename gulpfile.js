//const gulp = require('gulp-param')(require('gulp'), process.argv);
const zip = require('gulp-zip');
const gulp = require('gulp');
const argv = require('yargs').argv



const PROJECT = argv.PROJECT;
const VERSION = argv.VERSION;



gulp.task('ebextensions', function() {
    return gulp.src([
        '.ebextensions/**'
    ])
    .pipe(gulp.dest('build/.ebextensions'));
})

gulp.task('build', function() {
    //copy package.json to build folder
    return gulp.src([
        'package.json',
        'nginx-default.conf'
        ])
        .pipe(gulp.dest('build/'));
})


gulp.task('package', function() {
    //zipped folder of build
    return gulp.src([
        'build/**'
        ], {
            dot : true
        })
        .pipe(zip(`${PROJECT}-${VERSION}.zip`))
        .pipe(gulp.dest('temp/'));
});

gulp.task('default', gulp.series('build', 'ebextensions', 'package'), function(cb) {
    cb();
});