"use strict";

const merge = require("merge-stream");
const csso = require("gulp-csso");
const del = require("del");
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify-es").default;
const connect = require("gulp-connect");
const replace = require("gulp-replace");

const svgs = [
  "regular/copyright",
  "solid/percent",
  "solid/draw-polygon",
  "solid/tools",
  "solid/tachometer-alt",
  "solid/hand-holding-usd",
  "solid/medal",
  "solid/piggy-bank",
  "solid/rocket",
  "solid/phone",
  "brands/whatsapp",
  "solid/envelope",
  "solid/map-marked-alt",
  "brands/instagram",
  "brands/twitter",
];

const base = "/stone-crusher-plant/";

// CLEAN

gulp.task("clean", () => {
  return del(["dist", "serve"]);
});

// BUILD

gulp.task("build:style", () => {
  return gulp.src("src/asset/**/*.scss")
    // Compile SASS files
    .pipe(sass({
      outputStyle: "nested",
      precision: 10,
      includePaths: ["."],
      onError: console.error.bind(console, "Sass error:"),
    }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest("dist/asset"));
});

gulp.task("build:script", () => {
  return gulp.src("src/asset/**/*.js")
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest("dist/asset"));
});

gulp.task("build:html", () => {
  return gulp.src(["src/**/*.html"])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(replace("node_modules/@fortawesome/fontawesome-free", "asset"))
    .pipe(replace("node_modules/bootstrap.native/dist", "asset"))
    .pipe(replace("<base href=\"/\">", "<base href=\"" + base + "\">"))
    .pipe(gulp.dest("dist"));
});

gulp.task("build:asset", () => {
  return merge(
    gulp.src("src/asset/*/**/*")
      .pipe(gulp.dest("dist/asset/")),
    gulp.src(["node_modules/@fortawesome/fontawesome-free/svgs/{" + svgs.join() + "}.svg"])
      .pipe(gulp.dest("dist/asset/svgs")),
  );
});

gulp.task("build:node", () => {
  return gulp.src("node_modules/bootstrap.native/dist/bootstrap-native.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/asset/"));
});

gulp.task("build", gulp.series(
  "clean",
  "build:style",
  "build:script",
  "build:html",
  "build:asset",
  "build:node",
));

// SERVE

gulp.task("serve:html", () => {
  return gulp.src(["src/**/*.html"])
    .pipe(replace("node_modules/@fortawesome/fontawesome-free", "asset"))
    .pipe(replace("node_modules/bootstrap.native/dist", "asset"))
    .pipe(gulp.dest("serve"));
});

gulp.task("serve:style", () => {
  return gulp.src("src/asset/*.scss")
    .pipe(sass({
      outputStyle: "nested",
      precision: 10,
      includePaths: ["."],
      onError: console.error.bind(console, "Sass error:"),
    }))
    .pipe(gulp.dest("serve/asset/"));
});

gulp.task("serve:asset", () => {
  return merge(
    gulp.src(["src/asset/*/**/*", "src/asset/*.js"])
      .pipe(gulp.dest("serve/asset/")),
    gulp.src(["node_modules/@fortawesome/fontawesome-free/svgs/{" + svgs.join() + "}.svg"])
      .pipe(gulp.dest("serve/asset/svgs")),
  );
});

gulp.task("serve:node", () => {
  return gulp.src([
    "node_modules/bootstrap.native/dist/bootstrap-native.js",
  ]).pipe(gulp.dest("serve/asset/"));
});

gulp.task("serve:reload", () => {
  return gulp.src("serve").pipe(connect.reload());
});

gulp.task("serve:watch", async () => {
  return gulp.watch("src/**/*", gulp.series(
    "clean",
    "serve:html",
    "serve:node",
    "serve:style",
    "serve:asset",
    "serve:reload",
  ));
});

gulp.task("serve:connect", async () => {
  connect.server({
    port: 4000,
    root: "serve",
    livereload: true,
  });
});

gulp.task("serve", gulp.series(
  "clean",
  "serve:html",
  "serve:asset",
  "serve:node",
  "serve:style",
  "serve:reload",
  "serve:connect",
  "serve:watch",
));

// DEFAULT

gulp.task("default", async () => {
  console.log("Check scripts in package.json to see development commands.");
});
