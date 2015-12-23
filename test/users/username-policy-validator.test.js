'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var UsernamePolicyValidatorFactory = require('../../src/users/username-policy-validator');
var AccountLoaderFactory = require('../../src/users/account-loader-factory');
var Fixtures = require('../fixtures');

describe('UsernamePolicyValidator test', function () {
    var AccountBuilderTest = Fixtures.account;

    describe('#validate username is valid when username IS NOT exist in database', function () {
        var usernamePolicyValidator;

        before(function () {

            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                return done(null, null);
            };
            usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});
        });

        it('should return true', function () {
            usernamePolicyValidator.validate('azersafarov4s', function (err, result) {
                assert.isTrue(result);
            });
        });
    });

    describe('#validate username is not valid when username EXISTS in database', function () {
        var usernamePolicyValidator;

        before(function () {
            var builder = AccountBuilderTest.anAccount();

            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                var existingAccount = builder.build();
                return done(null, existingAccount);
            };
            usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});
        });

        it('should return false', function () {
            usernamePolicyValidator.validate('azersafarov4s', function (err, result) {
                assert.isFalse(result);
            });
        });
    });
});

