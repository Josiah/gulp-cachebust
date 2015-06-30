# [gulp](https://github.com/wearefractal/gulp)-cachebust

> Generates checksums and renames references to files

Useful for cachebusting

## Install

Install with [npm](https://npmjs.org/package/gulp-cachebust)

```
npm install --save-dev gulp-cachebust
```


## Example

```js
var gulp = require('gulp');
var CacheBuster = require('gulp-cachebust');

var cachebust = new CacheBuster();

gulp.task('build-css', function () {
    return gulp.src('styles/*.css')
        // Awesome css stuff
        .pipe(cachebust.resources())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build-html', ['build-css'], function () {
    return gulp.src('templates/*')
        // Awesome html stuff
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});
```


## API

### new CacheBuster(options)

#### options.checksumLength

*Optional*

Type: `Number`
Default: 8

#### options.token

*Optional*

Type: `String`
Default: {token}

Replaces token in original filename, unless such is missing in the string. By default checksum token is appended before extension, ex. `vendors.{token}.min.js` converts to `vendors.aabbccdd.min.js`, instead of `vendors.min.aabbccdd.js`.

### CacheBuster.resources()

Renames and collects resources according to their MD5 checksum.

### CacheBuster.references()

Rewrites references to resources which have been renamed according to their MD5
checksum.

### CacheBuster.getHashMap(file)

Returns collection (or single object, if file specified) of tokens of affected files. Ex.: `[{ 'vendors.{token}.min.js': 'aabbccdd' }, ...]`.

## License

MIT © [Josiah Truasheim](//github.com/Josiah)
