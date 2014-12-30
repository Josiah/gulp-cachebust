var crypto = require('crypto');
var through2 = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var PluginError = gutil.PluginError;

module.exports = CacheBuster;

function CacheBuster(options) {
    if (!(this instanceof CacheBuster)) {
        return new CacheBuster(options);
    }

    this.checksumLength = (options && options.checksumLength) || 8;
    this.mappings = {};
}

CacheBuster.prototype.getChecksum = function getChecksum(file) {
    var hash = crypto.createHash('md5');

    if (file.isNull()) {
        return; 
    }

    if (file.isStream()) {
        file.pipe(hash);
        hash.end();
    }

    if (file.isBuffer()) {
        hash.end(file.contents);
    }

    return hash.read().toString('hex').substr(0, this.checksumLength);
}

CacheBuster.prototype.getBustedPath = function getBustedPath(file) {
    var checksum = this.getChecksum(file);

    if (!checksum) {
        return file.path;
    }

    var extname = path.extname(file.path);
    var basename = path.basename(file.path, extname);
    var dirname = path.dirname(file.path);

    return path.join(dirname, basename + '.' + checksum + extname);
};

CacheBuster.prototype.getRelativeMappings = function getRelativeMappings() {
    var mappings = [];

    for (var original in this.mappings) {
        var cachebusted = this.mappings[original];

        mappings.push({original: original, cachebusted: cachebusted});
    }

    return mappings;
};

CacheBuster.prototype.resources = function resources() {
    var cachebuster = this;

    return through2.obj(function transform(file, encoding, callback) {
        var bustedPath = cachebuster.getBustedPath(file);

        if (file.path === bustedPath) {
            this.push(file);
            return callback();
        }

        var original = file.relative;
        file.path = bustedPath;

        cachebuster.mappings[original] = file.relative;

        this.push(file);
        return callback();
    });
};

CacheBuster.prototype.references = function references() {
    var cachebuster = this;

    return through2.obj(function transform(file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (!file.isBuffer()) {
            this.emit('error', new PluginError('gulp-cachebust', 'Non buffer files are not supported for reference rewrites.'));
            this.push(file);
            return callback();
        }

        var contents = file.contents.toString(encoding);

        var mappings = cachebuster.getRelativeMappings(file.path);
        for (var i=0; i < mappings.length; i++) {
            var original = mappings[i].original;
            var cachebusted = mappings[i].cachebusted;

            contents = contents.replace(new RegExp('\\b' + original + '\\b', 'g'), cachebusted);
        }

        file.contents = new Buffer(contents, encoding);
        this.push(file);
        return callback();
    });
};
