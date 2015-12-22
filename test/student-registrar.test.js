'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var StudentRegistrarFactory = require('../src/school/student-registrar');
var TokenValidatorFactory = require('../src/auth/token-validator');
var AuthorizerFactory = require('../src/auth/authorizer');
var StudentRegistrationFormValidatorFactory = require('../src/school/student-registration-form-validator');
var StudentCreatorFactory = require('../src/school/student-creator');
var EmailSenderFactory = require('../src/infra/email-sender');
var UserRegistrarFactory = require('../src/users/user-registrar');
var AccountLoader = require('../src/users/account-finder');
var Fixtures  = require('./fixtures');

describe('StudentRegistrar test', function () {

    var UserFormBuilder = Fixtures.user.aUserForm();

    describe('#register new student', function() {

        var studentRegistrar;
        var studentRegistrationForm;

        var tokenValidatorSpy;
        var authorizerSpy;
        var studentRegistrationFormValidatorSpy;
        var studentCreatorSpy;
        var emailSenderSpy;
        var userRegistrarSpy;

        before(function (beforeDone) {
            studentRegistrationForm = UserFormBuilder.build();

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var studentRegistrationFormValidator = StudentRegistrationFormValidatorFactory.create();
            studentRegistrationFormValidatorSpy = sinon.spy(studentRegistrationFormValidator, 'validate');

            AccountLoader.findByUsername = function(err, done){
                return done(null, true);
            };

            var userRegistrar = UserRegistrarFactory.create({email:studentRegistrationForm.email});
            userRegistrarSpy = sinon.spy(userRegistrar, 'register');

            var studentCreator = StudentCreatorFactory.create();
            studentCreatorSpy = sinon.spy(studentCreator, 'create');

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            studentRegistrar = StudentRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                studentRegistrationFormValidator: studentRegistrationFormValidator,
                userRegistrar:userRegistrar,
                studentCreator: studentCreator,
                emailSender: emailSender
            });

            var testToken = 'test-token';

            studentRegistrar.register(testToken, studentRegistrationForm, function(err, result) {
                beforeDone();
            });
        });

        it('user should have valid access token', function() {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('student registration form should be validated', function () {
            assert.isTrue(studentRegistrationFormValidatorSpy.calledOnce);
        });

        it('user should be registered', function () {
            assert.isTrue(userRegistrarSpy.calledOnce);
        });

        it('should create student', function() {
            assert.isTrue(studentCreatorSpy.calledOnce);
        });

        it('should send email to new registered student', function() {
            assert.isTrue(emailSenderSpy.calledOnce);
        });

        it('should called in correct order', function () {
           sinon.assert.callOrder(
               tokenValidatorSpy,
               authorizerSpy,
               studentRegistrationFormValidatorSpy,
               userRegistrarSpy,
               studentCreatorSpy,
               emailSenderSpy
           );
        });

    });
});