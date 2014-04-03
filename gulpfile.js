"use strict";

var gulp = require("gulp");
var nodeunit = require("gulp-nodeunit");
var fixtures2js = require("./index.js");

gulp.task("fixtures2js:test_defaults", function () {
    return gulp.src("./test/fixtures/test_defaults/*")
        .pipe(fixtures2js("test_defaults.js"))
        .pipe(gulp.dest("./test/actual/"));
});

gulp.task("fixtures2js:test_head_tail", function () {
    return gulp.src("./test/fixtures/test_head_tail/*")
        .pipe(fixtures2js("test_head_tail.js", {
            head: "foobar(",
            tail: ")"
        }))
        .pipe(gulp.dest("./test/actual/"));
});

gulp.task("fixtures2js:test_post_processors", function () {
    return gulp.src("./test/fixtures/test_post_processors/*")
        .pipe(fixtures2js("test_post_processors.js", {
            postProcessors: {
                "**/*.txt": "default",
                "**/*.wav": "arraybuffer",
                "**/*.json": "json",
                "**/*": "base64"
            }
        }))
        .pipe(gulp.dest("./test/actual/"));
});

gulp.task("test", ["fixtures2js:test_defaults", "fixtures2js:test_head_tail", "fixtures2js:test_post_processors"], function () {
    return gulp.src("./test/*_test.js")
        .pipe(nodeunit());
});
