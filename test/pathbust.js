var CacheBuster = require('../index');
var File = require('vinyl');
var expect = require('chai').expect;

function createFile(cwd, base, path, filename) {
    var contentBuffer = new Buffer('foo');
    return new File({
          cwd: cwd,
          base: base,
          path: path + '/' + filename,
          contents: contentBuffer
    });
}

describe('path buster', function () {
    var bust;

    beforeEach(function () {
        bust = new CacheBuster();
    });

    describe('with checksum', function () {

        it('should return the full path with checksum', function () {
            bust.getChecksum = function () {
                return '123';
            };
            var fullPath = bust.getBustedPath(createFile('/cwd', 'base', 'folder', 'file.test'));
            expect(fullPath).to.equal('folder/file.123.test');
        });
    });

    describe('with random hash', function () {
        it('should return the full path with checksum', function () {
            bust.random = true;
            bust.hash = '234';
            var fullPath = bust.getBustedPath(createFile('/cwd', 'base', 'folder', 'file.test'));
            expect(fullPath).to.equal('folder/file.234.test');
        });
    });
});




