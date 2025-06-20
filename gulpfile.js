import gulp from 'gulp';

// Імпортуємо таски
import './gulp/dev.js';
import './gulp/docs.js';

// Таск default (запускається командою gulp)
gulp.task(
  'default',
  gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'files:dev', 'js:dev'),
    'server:dev', // Спочатку запускаємо сервер
    'watch:dev'   // Потім відстежуємо зміни
  )
);

// Таск docs (запускається командою gulp docs)
gulp.task(
  'docs',
  gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'files:docs', 'js:docs'),
    'server:docs', // Спочатку запускаємо сервер
    'watch:docs'   // Потім відстежуємо зміни
  )
);