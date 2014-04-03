"use strict";

var _ = require("lodash");
var path = require("path");
var through = require("through");
var fixtures2js = require("fixtures2js");
var gutil = require("gulp-util");
var File = gutil.File;
var PluginError = gutil.PluginError;

module.exports = function (fileName, options) {
    if ( !fileName ) {
        throw new PluginError("gulp-fixtures2js", "Missing `fileName` option for gulp-fixtures2js");
    }

    options = _.extend({
        relativeTo: "."
    }, options);

    var fixtures = fixtures2js(options);
    var firstFile;

    var processFile = function (file) {
        if ( file.isNull() ) { return; }

        if ( file.isStream() ) {
            throw new PluginError("gulp-fixtures2js", "Streaming not supported");
        }

        if ( !firstFile ) {
            firstFile = file;
        }

        try {
            fixtures.addFixture(path.relative(options.relativeTo, file.path), file.contents);
        } catch (error) {
            throw new PluginError("gulp-fixtures2js", error.message);
        }
    };

    var endStream = function () {
        if ( !firstFile ) {
            this.emit("end");
            return;
        }

        var joinedPath = path.join(firstFile.base, fileName);

        var fixtureFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: joinedPath,
            contents: fixtures.finish()
        });

        this.emit("data", fixtureFile);
        this.emit("end");
    };

    return through(processFile, endStream);
};
