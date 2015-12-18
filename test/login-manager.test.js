'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var LoginManagerFactory = require('../src/auth/login-manager');
var UserFinderFactory = require('../src/users/user-finder');
var PasswordValidatorFactory = require('../src/auth/password-validator');
var TokenGeneratorFactory = require('../src/auth/token-generator');

describe('Login test', function () {

    describe('#login user', function () {

        var loginManager;
        var inputLoginUser;

        var userFinderSpy;
        var passwordValidatorSpy;
        var tokenGeneratorSpy;

        var VALID_TOKEN = 'valid-token';
        var actualReturnedToken;

        before(function (beforeDone) {
            // Given
            var someUser = {

                getAccount: function() {
                    return {
                        userId: 'uuid',
                        username: 'azersafarov4s',
                        hashedPassword: 'hashed_password',
                        role:'ADMIN'
                    };
                }
            };

            var userFinder = UserFinderFactory.create();
            userFinderSpy = sinon.stub(userFinder, 'find', function(username, done) {
                return done(null, someUser);
            });

            var passwordValidator = PasswordValidatorFactory.create();
            passwordValidatorSpy = sinon.stub(passwordValidator, 'validate', function(password, hashedPassword) {
                return true;
            });

            var tokenGenerator = TokenGeneratorFactory.create();
            tokenGeneratorSpy = sinon.stub(tokenGenerator, 'generate', function(userId, role, done) {
                return done(null, VALID_TOKEN);
            });

            loginManager = LoginManagerFactory.create({
                userFinder: userFinder,
                passwordValidator: passwordValidator,
                tokenGenerator: tokenGenerator
            });


            // When
            inputLoginUser = {
                username: 'azersafarov4s',
                password: 'a4s9qc63s'
            };

            loginManager.login(inputLoginUser, function (err, token) {
                actualReturnedToken = token;
                beforeDone();
            });
        });

        it('should find user by username', function () {
            assert.isTrue(userFinderSpy.calledOnce);
        });

        it('should validate user password', function () {
            assert.isTrue(passwordValidatorSpy.calledOnce);
        });

        it('should generate token for validated user', function () {
            assert.isTrue(tokenGeneratorSpy.calledOnce);
        });

        it('should return valid JWT token', function () {
           assert.equal(actualReturnedToken, VALID_TOKEN);
        });

        it('should called in correct order', function() {
            sinon.assert.callOrder(
                userFinderSpy,
                passwordValidatorSpy,
                tokenGeneratorSpy
            );
        });
    });
});