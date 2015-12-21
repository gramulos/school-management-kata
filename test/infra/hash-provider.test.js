'use strict';

var chai = require('chai');
var assert = chai.assert;
var HashProvider = require('../../src/infra/hash-provider');
var sha256 = require('sha256');

describe('testing the hashProvider', function(){
    var hashedPassword;
    var password;
    before(function(){
        password = 'as123';
        hashedPassword = HashProvider.hash(password);
    });
    it('should return the hashed password', function(){
        var expected = sha256(password);
        assert.equal(hashedPassword, expected);
    })
});
