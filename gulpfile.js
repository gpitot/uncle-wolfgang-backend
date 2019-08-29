const gulp = require('gulp');
const zip = require('gulp-zip');



gulp.task('build', function() {
    //copy package.json to build folder
    return gulp.src('package.json')
        .pipe(gulp.dest('build/'));
})

gulp.task('package', function() {
    //zipped folder of build
    return gulp.src('build/**')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('temp/'));
});

gulp.task('default', gulp.series('build', 'package'), function(cb) {
    cb();
});
