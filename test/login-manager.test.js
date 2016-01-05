'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var LoginManagerFactory = require('../src/auth/login-manager');
var UserFinderFactory = require('../src/users/account-loader-factory');
var PasswordValidatorFactory = require('../src/auth/password-matcher');
var TokenGeneratorFactory = require('../src/auth/token-generator');
var Fixtures = require('./fixtures');

var AccountTestBuilder = Fixtures.account;

describe('Login test', function () {

    describe('#login user', function () {

        var loginManager;
        var inputLoginUser;

        var userFinderSpy;
        var passwordValidatorSpy;
        var tokenGeneratorSpy;

        var VALID_TOKEN = 'valid-token';
        var actualReturnedToken;
        //var accountFormBuilder = Fixtures.account.anAccount();
        before(function (beforeDone) {
            // Given
            var someUser = {
                account: {
                    hashedPassword: '01d7a732aa5c9549f417254155a50591725e3106be36a1d6eebffa54706d0de6',
                    role: 2,
                    username: 'rufetisayev5Z'
                },
                imageUrl: 'rufet@images.com',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                idNumber: '5ZJBKRJ',
                patronymic: 'kamaleddin',
                lastName: 'isayev',
                firstName: 'rufet',
                id: '4992dcf0-ad62-11e5-b5c4-19cb5e73b978'
            };

            var userFinder = UserFinderFactory.create();
            userFinderSpy = sinon.stub(userFinder, 'findByUsername', function (username, done) {
                return done(null, someUser);
            });

            var passwordValidator = PasswordValidatorFactory.create();
            passwordValidatorSpy = sinon.stub(passwordValidator, 'match', function (passwords) {
                return true;
            });

            var tokenGenerator = TokenGeneratorFactory.create();
            tokenGeneratorSpy = sinon.stub(tokenGenerator, 'generate', function (userId, role) {
                return VALID_TOKEN;
            });

            loginManager = LoginManagerFactory.create({
                userFinder: userFinder,
                passwordValidator: passwordValidator,
                tokenGenerator: tokenGenerator
            });

            // When
            inputLoginUser = {
                username: 'feridheziyev12',
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

        it('should called in correct order', function () {
            sinon.assert.callOrder(
                userFinderSpy,
                passwordValidatorSpy,
                tokenGeneratorSpy
            );
        });
    });
});