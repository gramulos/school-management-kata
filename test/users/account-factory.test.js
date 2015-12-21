'use strict';

var chai = require('chai');
var assert = chai.assert;
var Role = require('../../src/infra/role');
var AccountFactory = require('../../src/users/account-factory');
var HashProvider = require('../../src/infra/hash-provider');
var ErrorCodes = require('../../src/infra/error-codes');
describe('Create account test', function () {

    describe('#createAccount', function () {
        describe('with valid inputs', function () {
            var accountData;
            var account;
            before(function () {
                accountData = {
                    username: 'feridheziyev12',
                    role: Role.STUDENT,
                    password: 'f12123h'
                };

                account = AccountFactory.create(accountData);
            });

            it('should create account (username, hashPassword, role) from input', function () {

                var expected = {
                    username: 'feridheziyev12',
                    role: Role.STUDENT,
                    hashedPassword: '81ba016cb1e7887e6a0b9f07a6ae846d4dbb150843863aee02b03ca5ad9b4d65'
                };

                assert.shallowDeepEqual(account, expected);
            });

        });

        describe('username is not entered', function () {
            var accountData;
            var account;
            before(function () {
                accountData = {
                    role: Role.STUDENT,
                    password: 'f12123h'
                };

                //account = AccountFactory.create(accountData);
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

            before(function () {
                accountData = {
                    username: 'feridheziyev12',
                    role: Role.STUDENT
                };

                //account = AccountFactory.create(accountData);
            });

            it('should return password does not exist error', function () {

                try {
                    AccountFactory.create(accountData);
                    assert.fail();

                }
                catch (err) {

                    assert.equal(err.message, ErrorCodes.PASSWORD_NOT_EXIST);
                }
            });
        });

        describe('role is not entered', function () {
            var accountData;
            before(function () {
                accountData = {
                    username: 'feridheziyev12',
                    password: 'f12123h'
                };

                //account = AccountFactory.create(accountData);
            });

            it('should return role does not exist error', function () {

                try {
                    AccountFactory.create(accountData);
                    assert.fail();

                }
                catch (err) {

                    assert.equal(err.message, ErrorCodes.ROLE_NOT_EXIST);
                }
            });
        })

    });
});