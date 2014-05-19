"use strict";

var gulp = require("gulp");
var fixtures2js = require("../index.js");
var chai = require("chai");
var chaiGulpHelpers = require("chai-gulp-helpers");

chai.use(chaiGulpHelpers);
chai.should();

describe("fixtures2js", function () {
    it("should work with the default options", function () {
        var expected = gulp.src("./test/expected/test_defaults.js");
        var actual = gulp.src("./test/fixtures/test_defaults/*")
            .pipe(fixtures2js("test_defaults.js"));
        return actual.should.produce.sameFilesAs(expected);
    });

    it("should work with the `head` and `tail` options`", function () {
        var expected = gulp.src("./test/expected/test_head_tail.js");
        var actual = gulp.src("./test/fixtures/test_head_tail/*")
            .pipe(fixtures2js("test_head_tail.js", {
                head: "foobar(",
                tail: ")"
            }));
        return actual.should.produce.sameFilesAs(expected);
    });

    it("should work with the `postProcessors` option", function () {
        var expected = gulp.src("./test/expected/test_post_processors.js");
        var actual = gulp.src("./test/fixtures/test_post_processors/*")
            .pipe(fixtures2js("test_post_processors.js", {
                postProcessors: {
                    "**/*.txt": "default",
                    "**/*.wav": "arraybuffer",
                    "**/*.json": "json",
                    "**/*": "base64"
                }
            }));
        return actual.should.produce.sameFilesAs(expected);
    });
});
