/*jshint mocha:true, expr: true */
var CacheBuster = require('../index');
var File = require('vinyl');
var ReadableStream = require('stream').Readable;
var expect = require('chai').expect;

function createBufferFile(filename, content) {
    var contentBuffer = new Buffer(content);
    return new File({
          cwd: '/',
          base: '/test/',
          path: '/test/' + filename,
          contents: contentBuffer
    });
}

function createStreamFile(filename, content) {
    var contentStream = ReadableStream({objectMode: true});
    contentStream.push(content);
    contentStream.push(null);
    return new File({
          cwd: '/',
          base: '/test/',
          path: '/test/' + filename,
          contents: contentStream
    });
}



describe('checksum generator', function () {
    var bust;

    beforeEach(function () {
        bust = new CacheBuster();
    });

    describe('for buffer files', function () {

        it('Should produce different checksums for different content.', function () {
            var file1 = createBufferFile('file1', 'content1');
            var file2 = createBufferFile('file2', 'content2');
            var checksum1 = bust.getChecksum(file1);
            var checksum2 = bust.getChecksum(file2);
            // Sanity checks
            expect(file1.isBuffer()).to.be.true;
            expect(file2.isBuffer()).to.be.true;
            expect(file1.isStream()).to.be.false;
            expect(file2.isStream()).to.be.false;
            // The test
            expect(checksum1).to.not.equal(checksum2);
        });
    });

    describe('for stream files', function () {
        it('Should produce different checksums for different content.', function () {
            var file1 = createStreamFile('file1', 'content1');
            var file2 = createStreamFile('file2', 'content2');
            var checksum1 = bust.getChecksum(file1);
            var checksum2 = bust.getChecksum(file2);
            // Sanity checks
            expect(file1.isBuffer()).to.be.false;
            expect(file2.isBuffer()).to.be.false;
            expect(file1.isStream()).to.be.true;
            expect(file2.isStream()).to.be.true;
            // The test
            expect(checksum1).to.not.equal(checksum2);
        });
    });
});






