'use strict';

var chai = require('chai');
var assert = chai.assert;
var Role = require('../../src/infra/role');
var AccountFactory = require('../../src/users/account-factory');
var HashProvider = require('../../src/infra/hash-provider');
var ErrorCodes = require('../../src/infra/error-codes');
var Fixtures = require('../fixtures');
describe('Create account test', function () {
    var AccountTestBuilder = Fixtures.account;


    describe('#createAccount', function () {
        describe('with valid inputs', function () {
            var actualAccount, accountData;
            var accountBuilder;

            before(function () {
                accountBuilder = AccountTestBuilder.anAccount();

                accountData = {
                    username: 'rufetisayev5Z',
                    password: 'r5ZJBKRJi',
                    role: Role.STUDENT
                };

                actualAccount = AccountFactory.createFromForm(accountData);

            });

            it('should create account (username, hashPassword, role) from input', function () {

                var expectedAccount = accountBuilder.build();

                assert.deepEqual(actualAccount, expectedAccount);
            });

        });

        describe('username is not passed', function () {
            var accountForm;

            before(function () {

                accountForm = AccountTestBuilder.anAccount()
                                                .withUsername('')
                                                .buildForm();
            });

            it('should return username does not exist error', function () {

                assert.throws(function() {
                    AccountFactory.create(accountForm);

                }, ErrorCodes.USERNAME_NOT_EXIST);
            });
        });

        describe('password is not passed', function () {
            var accountData;

            before(function () {

                accountData = AccountTestBuilder.anAccount()
                                                .withPassword('')
                                                .buildForm();
            });

            it('should return password does not exist error', function () {

                try {
                    AccountFactory.createFromForm(accountData);
                    assert.fail();

                }
                catch (err) {
                    assert.deepEqual(err.message, ErrorCodes.PASSWORD_NOT_EXIST);
                }
            });
        });

        describe('role is not passed', function () {
            var accountData;

            before(function () {
                accountData = AccountTestBuilder.anAccount()
                                                .withRole('')
                                                .buildForm();
            });

            it('should return role does not exist error', function () {

                try {
                    AccountFactory.createFromForm(accountData);
                    assert.fail();

                }
                catch (err) {

                    assert.deepEqual(err.message, ErrorCodes.ROLE_NOT_EXIST);
                }
            });
        })

    });
});