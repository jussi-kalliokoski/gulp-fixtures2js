"use strict";

var glob = require("glob");
var path = require("path");
var fs = require("fs");

exports.fixture2js = {
    setUp: function (done) {
        done();
    },

    defaultOptions: function (test) {
        var testCases = glob.sync(path.join(__dirname, "expected", "*"));

        testCases.forEach(function (testCase) {
            var expected = fs.readFileSync(testCase, "utf8");
            var actual = fs.readFileSync(path.join(__dirname, "actual", path.basename(testCase)), "utf8");
            test.equal(actual, expected, path.basename(testCase));
        });

        test.done();
    }
};
