var CacheBuster = require('../index');
var File = require('vinyl');
var expect = require('chai').expect;
var _ = require('lodash');

describe('relative mappings', function () {
    var bust;

    beforeEach(function () {
        bust = new CacheBuster();
    });

    it('should convert the mappmings hash to an array of objects', function () {
        debugger
        bust.mappings = {
            orig1: 'busted1',
            orig2: 'busted2',
            orig3: 'busted3'
        };
        var relativeMappings = bust.getRelativeMappings();
        expect(_.find(relativeMappings, function (o) { return o.original === 'orig1' && o.cachebusted === 'busted1';})).to.be.ok;
        expect(_.find(relativeMappings, function (o) { return o.original === 'orig2' && o.cachebusted === 'busted2';})).to.be.ok;
        expect(_.find(relativeMappings, function (o) { return o.original === 'orig3' && o.cachebusted === 'busted3';})).to.be.ok;
    });
});


