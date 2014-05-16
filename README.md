# gulp-fixtures2js

[![Build Status](https://travis-ci.org/jussi-kalliokoski/gulp-fixtures2js.png?branch=master)](https://travis-ci.org/jussi-kalliokoski/gulp-fixtures2js)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/gulp-fixtures2js.svg)](https://coveralls.io/r/jussi-kalliokoski/gulp-fixtures2js)

Ever wondered how to access static text-based files (e.g. JSON, HTML) from your tests? gulp-fixtures2js makes things easier for you by creating a JS file out of your fixtures, containing an object where file contents mapped to their filenames. You can then just include that file in your tests and voilá!

## Installation

You can install gulp-fixtures2js via npm:

```bash
$ npm install --save-dev gulp-fixtures2js
```

## Usage

Include the plugin:

```javascript
var fixtures2js = require("gulp-fixtures2js");
```

This will give you a function that takes the destination filename as its first argument, and options as an optional second argument.

## Options

* `head` (defaults to `window.FIXTURES = `) a string to insert before the generated JSON.
* `tail` (defaults to `;`) a string to insert after the generated JSON.
* `postProcessors` (defaults to `{}`) a string to string object where keys are `minimatch` patterns and values are one of `default`, `json`, `base64` or `bytearray`. If a file is not matched by any pattern, `default` is used.
* `relativeTo` (defaults to `.`) a string file path to base the filenames to (so that you don't get the complete paths as your keys).

## Examples

```javascript
gulp.task("fixtures", function () {
    return gulp.src("./fixtures/*")
        .pipe(fixtures2js("my-fixture-file.js"))
        .pipe(gulp.dest("./"))
});
```

This will read the contents of files in `./fixtures/`, and create something like the following `./my-fixture-file.js`:

```javascript
window.FIXTURES = {
    "myfile.txt": "contents of the file",
    "myotherfile.txt": "contents of the file"
};
```

### I grok **all** the options!

```javascript
gulp.task("fixtures", function () {
    return gulp.src("./fixtures/*")
        .pipe(fixtures2js("my-fixture-file.js", {
            relativeTo: "./fixtures",
            head: "processFixtures(",
            tail: ");",
            postProcessors: {
                "**/*.json": "json"
            }
        }))
        .pipe(gulp.dest("./"))
});
```

Which will generate the following result:

```javascript
processFixtures({
    "one-fixture-file.txt": "The contents of the fixture file here",
    "other-fixture-file.txt": "The contents of another fixture file here",
    "stuff.json": {
        "foo": "bar"
    }
});
```
