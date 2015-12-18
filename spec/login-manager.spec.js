'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));

var LoginManagerFactory = require('../src/auth/login-manager');
var UserRepository = require('../src/auth/user-repository');
var TokenValidatorFactory = require('../src/auth/token-validator');
var Role = require('../src/infra/role');

describe.skip('Login manager test', function () {
    describe('#login new account', function () {
        var actualToken;
        before(function (beforeDone) {

            var registeredUser = {
                account: {
                    userId: '4rer3r',
                    username: 'azersafarov4s',
                    hashedPassword: 'fsdfsdfsd43223423dsadsa',
                    role: Role.ADMIN
                }
            };

            UserRepository.insertUser(registeredUser, function (err, saveResult) {
                assert.isUndefined(err);

                var loginManager = LoginManagerFactory.create();
                var inputLoginUser = {
                    username: registeredUser.username,
                    password: 'a4s9qc63s'
                };
                loginManager.login(inputLoginUser, function (err, token) {
                    assert.isUndefined(err);
                    actualToken = token;
                    beforeDone();
                });
            });


        });

        it('should return valid token', function (testDone) {
            var tokenValidator = TokenValidatorFactory.create();
            tokenValidator.validate(actualToken, function(err, account){
                assert.isNotNull(account);
                testDone();
            });
        });

    });
});