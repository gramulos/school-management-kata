'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));

var LoginManagerFactory = require('../src/auth/login-manager');
var StudentRegistrarFactory = require('../src/school/student-registrar');
var EmailSenderFactory = require('../src/infra/email-sender');
var TokenValidatorFactory = require('../src/auth/token-validator');
var Role = require('../src/infra/role');
var ErrorCodes = require('../src/infra/error-codes');
var DateProviderFactory = require('../src/infra/date-provider');

var mongoose = require('mongoose');
var sinon = require('sinon');

function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();
}

describe('Login manager test', function () {

    var dateProviderStub;
    var dateProviderFactorySpy;
    dateProviderStub = DateProviderFactory.create();
    sinon.stub(dateProviderStub, 'now', function() {
        return new Date(2014, 11, 25);
    });
    dateProviderFactorySpy = sinon.stub(DateProviderFactory, 'create', function() {
        return dateProviderStub;
    });

    describe('#login as student - valid username and password', function () {

        var actualToken;
        var studentRegistrar;
        var emailSenderStub;


        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            var studentRegistrationForm = {
                studentForm: {
                    grade: '650',
                    classNumber: '5a'
                },
                userForm: {
                    firstName: 'rufet',
                    lastName: 'isayev',
                    patronymic: 'kamaleddin',
                    idNumber: '5ZJBKRJ',
                    email: 'rufetisayev@yahoo.com',
                    phone: '0518585529',
                    imageUrl: 'rufet@images.com'
                }
            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
            studentRegistrar.register(testToken, studentRegistrationForm, function (err, result) {
                assert.isNull(err);

                var loginManager = LoginManagerFactory.create();
                var inputLoginUser = {
                    username: 'rufetisayev5Z',
                    password: 'r5ZJBKRJi'
                };

                loginManager.login(inputLoginUser, function (err, token) {
                    assert.isNull(err);
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

        after(function (afterDone) {
            dateProviderFactorySpy.restore();
            clearDB(afterDone);
        });
    });

    describe('#login as student - invalid username', function () {

        var loginError;
        var studentRegistrar;
        var emailSenderStub;
        var actualUserId;

        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            var studentRegistrationForm = {
                studentForm: {
                    grade: '650',
                    classNumber: '5a'
                },
                userForm: {
                    firstName: 'rufet',
                    lastName: 'isayev',
                    patronymic: 'kamaleddin',
                    idNumber: '5ZJBKRJ',
                    email: 'rufetisayev@yahoo.com',
                    phone: '0518585529',
                    imageUrl: 'rufet@images.com'
                }
            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
            studentRegistrar.register(testToken, studentRegistrationForm, function (err, result) {
                assert.isNull(err);

                var loginManager = LoginManagerFactory.create();
                var inputLoginUser = {
                    username: 'rufetisa',
                    password: 'r5ZJBKRJi'
                };

                loginManager.login(inputLoginUser, function (err, token) {
                    loginError = err;
                    beforeDone();
                });
            });
        });

        it('should return error message - username not exists', function () {
            var expectedError = ErrorCodes.USERNAME_NOT_EXIST;

            assert.equal(loginError, expectedError);
        });

        after(function (afterDone) {
            dateProviderFactorySpy.restore();
            clearDB(afterDone);
        });
    });

    describe('#login as student - invalid password', function () {

        var loginError;
        var studentRegistrar;
        var emailSenderStub;

        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            var studentRegistrationForm = {
                studentForm: {
                    grade: '650',
                    classNumber: '5a'
                },
                userForm: {
                    firstName: 'rufet',
                    lastName: 'isayev',
                    patronymic: 'kamaleddin',
                    idNumber: '5ZJBKRJ',
                    email: 'rufetisayev@yahoo.com',
                    phone: '0518585529',
                    imageUrl: 'rufet@images.com'
                }
            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
            studentRegistrar.register(testToken, studentRegistrationForm, function (err, result) {
                assert.isNull(err);

                var loginManager = LoginManagerFactory.create();
                var inputLoginUser = {
                    username: 'rufetisayev5Z',
                    password: 'wrongPassword'
                };

                loginManager.login(inputLoginUser, function (err, token) {
                    //assert.isNull(err);
                    loginError = err;
                    beforeDone();
                });
            });
        });

        it('should return error message - username or password is incorrect', function () {

            assert.equal(loginError, ErrorCodes.LOGIN_FAILED);
        });

        after(function (afterDone) {
            dateProviderFactorySpy.restore();
            clearDB(afterDone);
        });
    });
});