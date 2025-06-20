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

// Ініціалізація BrowserSync
const bs = browserSync.create();

// Універсальна функція для watch із перезавантаженням
const watchAndReload = (path, task) => {
  console.log(`watchAndReload path: ${path}`);
  return gulp.watch(path, { usePolling: true }, gulp.series(task, (done) => {
    console.log(`Reloading browser for ${path}`);
    bs.reload();
    done();
  }));
};

gulp.task('clean:docs', function (done) {
  console.log('Starting clean:docs');
  if (fs.existsSync('./docs/')) {
    return gulp
      .src('./docs/', { read: false })
      .pipe(clean({ force: true }))
      .on('end', () => {
        console.log('clean:docs completed');
        done();
      })
      .on('error', (err) => {
        console.error('clean:docs error:', err.message);
        done(err);
      });
  }
  console.log('clean:docs completed (no docs folder)');
  done();
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

gulp.task('html:docs', function (done) {
  console.log('Starting html:docs');
  gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileInclueSettings))
    .pipe(webpHtml())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'))
    .on('end', () => {
      console.log('html:docs completed');
      done();
    })
    .on('error', (err) => {
      console.error('html:docs error:', err.message);
      done(err);
    });
});

gulp.task('sass:docs', function (done) {
  console.log('Starting sass:docs');
  if (!fs.existsSync('./docs/css/')) {
    fs.mkdirSync('./docs/css/', { recursive: true });
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
    .pipe(gulp.dest('./docs/css/'))
    .on('end', () => {
      console.log('sass:docs completed');
      done();
    })
    .on('error', (err) => {
      console.error('sass:docs error:', err.message);
      done(err);
    });
});

gulp.task('clean:images', function (done) {
  console.log('Starting clean:images');
  del.deleteAsync(['docs/img/**/*']).then(() => {
    console.log('clean:images completed');
    done();
  }).catch((err) => {
    console.error('clean:images error:', err.message);
    done(err);
  });
});

gulp.task('images:copy', function (done) {
  console.log('Starting images:copy');
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg,svg}', { encoding: false })
    .pipe(gulp.dest('./docs/img/'))
    .on('end', () => {
      console.log('images:copy completed');
      done();
    })
    .on('error', (err) => {
      console.error('images:copy error:', err.message);
      done(err);
    });
});

gulp.task('favicon:copy', function (done) {
  console.log('Starting favicon:copy from ./src/img/favicon.ico to ./docs/');
  gulp
    .src('./src/img/favicon.ico', { encoding: false })
    .pipe(gulp.dest('./docs/'))
    .on('end', () => {
      console.log('favicon:copy completed, file copied to ./docs/favicon.ico');
      done();
    })
    .on('error', (err) => {
      console.error('favicon:copy error:', err.message);
      done(err);
    });
});

gulp.task('images:webp', function (done) {
  console.log('Starting images:webp');
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg}', { encoding: false })
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest('./docs/img/'))
    .on('end', () => {
      console.log('images:webp completed');
      done();
    })
    .on('error', (err) => {
      console.error('images:webp error:', err.message);
      done(err);
    });
});

gulp.task('images:minify', function (done) {
  console.log('Starting images:minify');
  gulp
    .src('./src/img/**/*.{png,jpg,jpeg,svg}', { encoding: false })
    .pipe(
      imagemin([
        imageminMozjpeg({ quality: 75, progressive: true }),
        imageminOptipng({ optimizationLevel: 5 }),
        imageminSvgo(),
      ], { verbose: true })
    )
    .pipe(gulp.dest('./docs/img/'))
    .on('end', () => {
      console.log('images:minify completed');
      done();
    })
    .on('error', (err) => {
      console.error('images:minify error:', err.message);
      done(err);
    });
});

gulp.task('images:docs', gulp.series('clean:images', 'images:copy', 'images:minify', 'images:webp', 'favicon:copy')); //! deleted 'favicon:copy'

gulp.task('fonts:docs', function (done) {
  console.log('Starting fonts:docs');
  gulp
    .src('./src/fonts/**/*', { encoding: false })
    .pipe(gulp.dest('./docs/fonts/'))
    .on('end', () => {
      console.log('fonts:docs completed');
      done();
    })
    .on('error', (err) => {
      console.error('fonts:docs error:', err.message);
      done(err);
    });
});

gulp.task('files:docs', function (done) {
  console.log('Starting files:docs');
  gulp
    .src('./src/files/**/*', { encoding: false })
    .pipe(gulp.dest('./docs/files/'))
    .on('end', () => {
      console.log('files:docs completed');
      done();
    })
    .on('error', (err) => {
      console.error('files:docs error:', err.message);
      done(err);
    });
});

gulp.task('js:docs', function (done) {
  console.log('Starting js:docs');
  gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./docs/js/'))
    .on('end', () => {
      console.log('js:docs completed');
      done();
    })
    .on('error', (err) => {
      console.error('js:docs error:', err.message);
      done(err);
    });
});

gulp.task('server:docs', function (done) {
  console.log('Starting server:docs');
  bs.init({
    server: './docs/',
    port: 8000,
    open: true,
    notify: false,
  }, (err) => {
    if (err) {
      console.error('server:docs error:', err.message);
      done(err);
    } else {
      console.log('server:docs started on http://localhost:8000');
      done();
    }
  });
});

gulp.task('watch:docs', function () {
  console.log('Starting watch:docs');

  // SCSS: оновлення без перезавантаження
  gulp.watch('./src/scss/**/*.scss', { usePolling: true }, gulp.series('sass:docs', (done) => {
    bs.stream();
    done();
  }));

  // Використовуємо універсальну функцію для інших таск
  watchAndReload('./src/html/**/*.html', 'html:docs');
  watchAndReload('./src/img/**/*', 'images:docs');
  watchAndReload('./src/fonts/**/*', 'fonts:docs');
  watchAndReload('./src/files/**/*', 'files:docs');
  watchAndReload('./src/js/**/*.js', 'js:docs');
  // watchAndReload('./src/img/favicon.ico', 'favicon:copy');
});

gulp.task('docs', gulp.series(
  'clean:docs',
  gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'files:docs', 'js:docs', 'favicon:copy'), //! deleted 'favicon:copy'
  'server:docs',
  'watch:docs'
));