"use strict";

var gulp = require("gulp");
var istanbul = require("gulp-istanbul");
var mocha = require("gulp-mocha");

gulp.task("mocha", function (callback) {
  gulp.src("./index.js")
    .pipe(istanbul())
    .on("finish", function () {
      gulp.src(["test/*Spec.js"])
        .pipe(mocha({
          reporter: "spec"
        }))
        .pipe(istanbul.writeReports())
        .on("end", callback);
    });
});

gulp.task("test", ["mocha"]);
