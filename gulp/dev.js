import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const webpackConfig = require('../webpack.config.cjs');
import htmlclean from 'gulp-htmlclean';
import webpHtml from 'gulp-webp-html';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import webpCss from 'gulp-webp-css';
const sass = gulpSass(dartSass);

import browserSync from 'browser-sync';
import clean from 'gulp-clean';
import fs from 'fs';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
const del = await import('del');

const bs = browserSync.create();

const watchAndReload = (path, task) => {
  console.log(`watchAndReload path: ${path}`);
  return gulp.watch(path, { usePolling: true }, gulp.series(task, (done) => {
    console.log(`Reloading browser for ${path}`);
    bs.reload();
    done();
  }));
};

gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean({ force: true })).on('end', done);
  }
  done();
});

gulp.task('clean:images', function (done) {
  del.deleteAsync(['build/img/**/*']).then(() => done());
});

const fileInclueSettings = {
  prefix: '@@',
  basePath: '@file',
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
};

gulp.task('html:dev', function (done) {
  gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    // .pipe(changed('./build/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileInclueSettings))
    .pipe(webpHtml())
    .pipe(gulp.dest('./build/'))
    .on('end', done);
});

gulp.task('sass:dev', function (done) {
  if (!fs.existsSync('./build/css/')) {
    fs.mkdirSync('./build/css/', { recursive: true });
  }
  gulp
    .src('./src/scss/*.scss')
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', function (err) {
      console.error('Sass error:', err.message);
      this.emit('end');
    }))
    .pipe(autoprefixer())
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(webpCss())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build/css/'))
    .on('end', done);
});

gulp.task('images:copy', function (done) {
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg,svg}', { encoding: false })
    .pipe(gulp.dest('./build/img/'))
    .on('end', done);
});

gulp.task('images:webp', function (done) {
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg}', { encoding: false })
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest('./build/img/'))
    .on('end', done);
});

gulp.task('images:minify', function (done) {
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg,svg}', { encoding: false })
    .pipe(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 }),
      imageminSvgo(),
    ], { verbose: true }))
    .pipe(gulp.dest('./build/img/'))
    .on('end', done);
});

gulp.task('images:dev', gulp.series('clean:images', 'images:copy', 'images:minify', 'images:webp'));

gulp.task('fonts:dev', function (done) {
  gulp
    .src('./src/fonts/**/*', { encoding: false })
    // .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
    .on('end', done);
});

gulp.task('files:dev', function (done) {
  gulp
    .src('./src/files/**/*')
    // .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'))
    .on('end', done);
});

gulp.task('js:dev', function (done) {
  gulp
    .src('./src/js/*.js')
    // .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./build/js/'))
    .on('end', done);
});

gulp.task('server:dev', function (done) {
  bs.init({
    server: './build/',
    port: 8000,
    open: true,
    notify: false,
  }, done);
});

gulp.task('watch:dev', function () {
  console.log('Starting watch:dev');

  // SCSS із live reload без перезавантаження
  gulp.watch('./src/scss/**/*.scss', { usePolling: true }, function scssWatcher() {
    return gulp
      .src('./src/scss/*.scss')
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(cleanCss({ compatibility: 'ie8' }))
      .pipe(webpCss())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('./build/css/'))
      .pipe(bs.stream());
  });

  watchAndReload('./src/**/*.html', 'html:dev');
  watchAndReload('./src/img/**/*', 'images:dev');
  watchAndReload('./src/fonts/**/*', 'fonts:dev');
  watchAndReload('./src/files/**/*', 'files:dev');
  watchAndReload('./src/js/**/*.js', 'js:dev');
});

gulp.task('dev',
  gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'files:dev', 'js:dev'),
    'server:dev',
    'watch:dev'
  )
);
