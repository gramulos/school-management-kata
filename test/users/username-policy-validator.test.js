'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var UsernamePolicyValidator = require('../../src/users/username-policy-validator');
var AccountLoader = require('../../src/users/account-finder');

describe('UsernamePolicyValidator test', function () {

    describe('#validate when username IS NOT exist in database', function () {

        before(function(){
            AccountLoader.findByUsername = function(err, done){
                return done(null, false);
            };
        });

        it('should return true', function () {
            UsernamePolicyValidator.validate('azersafarov4s', function(err, result) {
                assert.isTrue(result);
            });
        });
    });

    describe('#validate when username EXISTS in database', function () {

        before(function(){
            AccountLoader.findByUsername = function(err, done){
                return done(null, true);
            };
        });

        it('should return false', function () {
            UsernamePolicyValidator.validate('azersafarov4s', function(err, result) {
                assert.isFalse(result);
            });
        });
    });
});

