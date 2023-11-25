const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const concat = require('gulp-concat')
const include = require('gulp-file-include')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')
const webp = require('gulp-webp')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const browsersync = require('browser-sync').create()
const del = require('del')

const path = {
  watch: {
    html: './src/**/*.html',
    scss: './src/scss/**/*.scss',
    js: './src/js/**/*.js',
    img: './src/assets/img/**/*.{jpg,png,svg,gif,webp}',
  },
}

function html() {
  return src('src/*.html')
    .pipe(
      include({
        prefix: '@@',
      })
    )
    .pipe(dest('dist'))
    .pipe(browsersync.stream())
}

function js() {
  return src('src/js/index.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(dest('dist/js'))
    .pipe(browsersync.stream())
}

function fonts() {
  return src('src/fonts/**')
    .pipe(ttf2woff())
    .pipe(dest('dist/fonts'))
    .pipe(src('src/fonts/**'))
    .pipe(ttf2woff2())
    .pipe(dest('dist/fonts'))
    .pipe(browsersync.stream())
}

function img() {
  return src('src/assets/img/**/*.jpg')
    .pipe(
      webp({
        quality: 100,
      })
    )
    .pipe(dest('dist/assets/img'))
    .pipe(src('src/assets/img/**/*.png'))
    .pipe(
      webp({
        quality: 100,
      })
    )
    .pipe(dest('dist/assets/img'))
    .pipe(src('src/assets/img/**/*.svg'))
    .pipe(dest('dist/assets/img'))
    .pipe(browsersync.stream())
}

function scss() {
  return src('src/scss/style.scss')
    .pipe(sass())
    .pipe(
      autoprefixer(['last 2 versions', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true,
      })
    )
    .pipe(dest('dist/css'))
    .pipe(csso())
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(dest('dist/css'))
    .pipe(browsersync.stream())
}

function clear() {
  return del('dist')
}

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 3000,
    notify: false,
  })
}

function watchFiles() {
  watch([path.watch.html], html)
  watch([path.watch.scss], scss)
  watch([path.watch.img], img)
  watch([path.watch.js], js)
}

const build = series(clear, parallel(html, js, scss, img, fonts))
const start = parallel(build, watchFiles, browserSync)

exports.build = build
exports.start = start
exports.clear = clear
exports.scss = scss
exports.js = js
exports.html = html
exports.img = img
exports.fonts = fonts
