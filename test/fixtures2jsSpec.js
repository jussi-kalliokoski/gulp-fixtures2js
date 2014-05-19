"use strict";

var gulp = require("gulp");
var fixtures2js = require("../index.js");
var chai = require("chai");
var chaiGulpHelpers = require("chai-gulp-helpers");
var gutil = require("gulp-util");
var through = require("through2");
var File = require("vinyl");

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

    it("should throw an error if the filename option is missing", function () {
        fixtures2js.should.throw("Missing `fileName` option for gulp-fixtures2js");
    });

    it("should throw an error if streaming is attempted", function () {
        var stream = fixtures2js("foo.js");
        void function () {
            stream.write(new File({
                path: "/meow",
                contents: through.obj()
            }));
        }.should.throw("Streaming not supported");
    });

    it("should ignore null files", function () {
        var processor = fixtures2js("test_ignore_null.js", {
            postProcessors: {
                "**/*.txt": "default",
                "**/*.wav": "arraybuffer",
                "**/*.json": "json",
                "**/*": "base64"
            }
        });

        processor.write(new File({
            path: "/meow",
            contents: null
        }));

        var expected = gulp.src("./test/expected/test_ignore_null.js");
        var actual = gulp.src("./test/fixtures/test_ignore_null/*").pipe(processor);
        return actual.should.produce.sameFilesAs(expected);
    });

    it("should not produce anything if no fixtures are given", function () {
        var expected = through.obj();
        var source = through.obj();
        var stream = fixtures2js("foo.js");
        source.pipe(stream);
        stream.emit("end");
        source.emit("end");
        stream.should.produce.sameFilesAs(expected);
    });
});
