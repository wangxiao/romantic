import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import path from 'path';
import concat from 'gulp-concat';
import rename from 'gulp-rename';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// 将 dist 目录中的文件移动到 LeanEngine 的发布目录中
function moveToPublic() {
  return del([
    '../public/**/*.*'
  ], {
    force: true
  }, function() {

    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src([
      'dist/**/*.*'
    ], {
      base: './dist'
    })
    .pipe(gulp.dest('../public'));
  });
}

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['concat-tpl:build', 'styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});
gulp.task('images:serve', () => {
  return gulp.src('app/images/**/*')
  .pipe(gulp.dest('.tmp/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', [], () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('concat-tpl', () => {
  return gulp.src([
    'app/index.html',
    'app/**/*.tpl'
  ])
  .pipe(concat('index.html'))
  .pipe(gulp.dest('.tmp'));
});

gulp.task('concat-tpl:build', () => {
  return gulp.src([
    'app/index.html',
    'app/**/*.tpl'
  ])
  .pipe(concat('index-concat-all.html'))
  .pipe(gulp.dest('app'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist', '../public'], {force: true}));

gulp.task('serve', [
  'styles',
  'scripts',
  'images:serve',
  'fonts',
  'concat-tpl'
], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/**/*.tpl',
    '.tmp/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/**/*.tpl', ['concat-tpl']);
  gulp.watch('app/**/*.html', ['concat-tpl']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  return gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('rename', ['html', 'extras'], () => {
  gulp.src([
    'dist/index-concat-all.html'
  ])
  .pipe(rename('index.html'))
  .pipe(gulp.dest('dist'));
});

gulp.task('gzip', ['html', 'images', 'fonts', 'extras', 'rename'], () => {
  return gulp.src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}))
});

gulp.task('build', [
  // 'lint',
  'html',
  'images',
  'fonts',
  'extras',
  'rename',
  'gzip'
], () => {

  del([
    'app/index-concat-all.html',
    // 'dist/index-concat-all.html'
  ]);

  moveToPublic();
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
