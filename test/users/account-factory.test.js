'use strict';

var chai = require('chai');
var assert = chai.assert;
var Role = require('../../src/infra/role');
var AccountFactory = require('../../src/users/account-factory');
var HashProvider = require('../../src/infra/hash-provider');
var ErrorCodes = require('../../src/infra/error-codes');
var Fixtures = require('../fixtures');
describe('Create account test', function () {
    var accountFormBuilder = Fixtures.account.anAccount();
    describe('#createAccount', function () {
        describe('with valid inputs', function () {
            var account,accountData;

            before(function () {

                accountData = accountFormBuilder.withPassword('f12123h').build();
                account = AccountFactory.create(accountData);
            });

            it('should create account (username, hashPassword, role) from input', function () {
                var accountFormBuilder = Fixtures.account.anAccount();

                var expected = accountFormBuilder
                                            .withHashedPassword('81ba016cb1e7887e6a0b9f07a6ae846d4dbb150843863aee02b03ca5ad9b4d65')
                                            .build();
                assert.shallowDeepEqual(account, expected);
            });

        });

        describe('username is not entered', function () {
            var accountData;

            before(function () {

                accountData = accountFormBuilder
                                        .withPassword('f12123h')
                                        .withUsername('')
                                        .build();


            });

            it('should return username does not exist error', function () {

                try {
                    AccountFactory.create(accountData);

                    assert.fail();

                }
                catch (err) {

                    assert.equal(err.message, ErrorCodes.USERNAME_NOT_EXIST);
                }
            });
        });

        describe('password is not entered', function () {
            var accountData;
            var accountDataBuilder = Fixtures.account.anAccount();

            before(function () {

                accountData = accountDataBuilder
                                        .withPassword('')
                                        .build();

            });

            it('should return password does not exist error', function () {

                try {
                    AccountFactory.create(accountData);
                    assert.fail();

                }
                catch (err) {
                    assert.deepEqual(err.message, ErrorCodes.PASSWORD_NOT_EXIST);
                }
            });
        });

        describe('role is not entered', function () {
            var accountData;
            var accountDataBuilder = Fixtures.account.anAccount();

           before(function () {
                accountData = accountDataBuilder
                        .withPassword('f12123h')
                        .withRole('')
                        .build();
            });

            it('should return role does not exist error', function () {

                try {
                    AccountFactory.create(accountData);
                    assert.fail();

                }
                catch (err) {

                    assert.deepEqual(err.message, ErrorCodes.ROLE_NOT_EXIST);
                }
            });
        })

    });
});