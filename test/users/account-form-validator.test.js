'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var Fixtures = require('../fixtures');
var AccountFormValidator = require('../../src/users/account-form-validator');
var AccountLoaderFactory = require('../../src/users/account-loader-factory');
var UsernamePolicyValidatorFactory = require('../../src/users/username-policy-validator');

describe('AccountFormValidator test', function () {
    var AccountTestBuilder = Fixtures.account;

    describe('#validate username and password matching the policies (valid / happy path)', function () {
        var accountFormValidator;
        var input = {};

        before(function () {
            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                // account not found
                return done(null, null);
            };

            input.account = AccountTestBuilder.anAccount()
                .buildForm();

            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            accountFormValidator = AccountFormValidator.create({
                usernamePolicyValidator: usernamePolicyValidator
            });
        });

        it('should return true', function (testDone) {
            accountFormValidator.validate(input.account, function (err, isValidForm) {
                assert.isTrue(isValidForm);
                testDone();
            });
        });
    });


    describe('#validate username is not match the policy (if account exist)', function () {

        var accountForm,accountFormValidator;

        before(function () {
            var builder = AccountTestBuilder.anAccount();
            accountForm = builder.buildForm();

            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                var existingAccount = builder.build();

                return done(null, existingAccount);
            };

            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            accountFormValidator = AccountFormValidator.create({
                usernamePolicyValidator: usernamePolicyValidator
            });
        });

        it('should return false', function (testDone) {

            accountFormValidator.validate(accountForm, function (err, isValidForm) {
                assert.isFalse(isValidForm);
                testDone();
            });
        });
    });

    describe('#validate password is not match the policy', function () {
        var accountFormValidator;
        var accountForm;

        before(function () {
            accountForm = AccountTestBuilder.anAccount()
                .withPassword('aaaaaa')
                .buildForm();

            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                return done(null, null);
            };

            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            accountFormValidator = AccountFormValidator.create({
                usernamePolicyValidator: usernamePolicyValidator
            });

        });


        it('should return false', function (testDone) {

            accountFormValidator.validate(accountForm, function (err, isValidForm) {
                assert.isFalse(isValidForm);
                testDone();
            });
        });
    });
});

