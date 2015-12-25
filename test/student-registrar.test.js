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
var AccountLoaderFactory = require('../src/users/account-loader-factory');
var Fixtures = require('./fixtures');
var UsernamePolicyValidatorFactory = require('../src/users/username-policy-validator');
var AccountFormValidatorFactory = require('../src/users/account-form-validator');

describe('StudentRegistrar test', function () {

    var UserFormBuilder = Fixtures.user;
    var AccountBuilderTest = Fixtures.account;
    var studentBuilder = Fixtures.student;

    describe('#register new student', function () {

        var studentRegistrar;
        var studentRegistrationForm;

        var tokenValidatorSpy;
        var authorizerSpy;
        var studentRegistrationFormValidatorSpy;
        var studentCreatorSpy;
        var emailSenderSpy;
        var userRegistrarSpy;
        var studentForm;
        var userForm;

        before(function (beforeDone) {
            studentForm = StudentRegistrationFormValidatorFactory.create();
            studentRegistrationForm = studentBuilder.aStudentForm().buildForm();
            userForm = UserFormBuilder.aUserForm().build();
            //studentRegistrationForm = UserFormBuilder.build();

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var studentRegistrationFormValidator = StudentRegistrationFormValidatorFactory.create();
            studentRegistrationFormValidatorSpy = sinon.spy(studentRegistrationFormValidator, 'validate');

            var builder = AccountBuilderTest.anAccount();

            var accountLoader = AccountLoaderFactory.create();

            accountLoader.findByUsername = function (err, done) {

                var existingAccount = builder.build();
                return done(null, existingAccount);
            };
            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            var accountFormValidator = AccountFormValidatorFactory.create({

                usernamePolicyValidator: usernamePolicyValidator
            });
            //console.log('test',studentRegistrationForm)
            var userRegistrar = UserRegistrarFactory.create({email: userForm.email, accountFormValidator: accountFormValidator});
            userRegistrarSpy = sinon.spy(userRegistrar, 'register');

            //var studentCreator = StudentCreatorFactory.create();
            studentCreatorSpy = sinon.spy(StudentCreatorFactory, 'create');

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            studentRegistrar = StudentRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                studentRegistrationFormValidator: studentRegistrationFormValidator,
                userRegistrar: userRegistrar,
                emailSender: emailSender
            });

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJkODU1YTM2MC1hYTFlLTExZTUtYWQxZC1kNzY3ZjVhOWQzMTMiLCJyb2xlIjoxLCJpYXQiOjE0NTA5NDg1MTUsImV4cCI6MTQ1MTAzNDkxNX0.815QW9QVQ9TNQQaT8347Am6YlQMh9o5t2QfidCJtjI4';

            studentRegistrar.register(testToken, studentRegistrationForm,userForm, function (err, result) {

                    beforeDone();
            });
        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as ADMIN', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('student registration form should be validated', function () {
            assert.isTrue(studentRegistrationFormValidatorSpy.calledOnce);
        });

        it('user should be registered', function () {
            assert.isTrue(userRegistrarSpy.calledOnce);
        });

        it('should create student', function () {
            assert.isTrue(studentCreatorSpy.calledOnce);
        });

        it('should send email to new registered student', function () {
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

        after(function () {
            studentCreatorSpy.restore();
        })

    });
});