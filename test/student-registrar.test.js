'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var StudentRegistrarFactory = require('../src/school/student-registrar');
var TokenValidatorFactory = require('../src/auth/token-validator');
var AuthorizerFactory = require('../src/auth/authorizer');
var StudentRegistrationFormValidatorFactory = require('../src/school/student-registration-form-validator');
var StudentCreatorFactory = require('../src/school/student-factory');
var EmailSenderFactory = require('../src/infra/email-sender');
var UserRegistrarFactory = require('../src/users/user-registrar');
var AccountLoaderFactory = require('../src/users/account-loader-factory');
var Fixtures = require('./fixtures');
var UsernamePolicyValidatorFactory = require('../src/users/username-policy-validator');
var AccountFormValidatorFactory = require('../src/users/account-form-validator');
var StudentSaverFactory = require('../src/school/student-saver');
var ErrorCodes = require('../src/infra/error-codes');

describe('StudentRegistrar test', function () {

    var UserFormBuilder = Fixtures.user;
    var AccountBuilderTest = Fixtures.account;
    var studentBuilder = Fixtures.student;
    var TokenBuilder = Fixtures.token;
    var studentRegistrar;
    var studentRegistrationForm;
    var tokenValidatorSpy;
    var authorizerSpy;
    var studentRegistrationFormValidatorSpy;
    var studentForm;
    var userForm;

    describe('#register new student', function () {

        var studentCreatorSpy;
        var emailSenderSpy;
        var userRegistrarSpy;
        var studentSaverSpy;
        before(function (beforeDone) {
            studentForm = StudentRegistrationFormValidatorFactory.create();
            studentRegistrationForm = studentBuilder.aStudent().buildForm();
        var userForm;
            userForm = UserFormBuilder.aUserForm().buildForm();

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
            var userRegistrar = UserRegistrarFactory.create({
                email: userForm.email,
                accountFormValidator: accountFormValidator
            });
            userRegistrarSpy = sinon.spy(userRegistrar, 'register');

            sinon.stub(userRegistrar.userSaver, 'save', function (user, done) {
                done(null, user);
            });
            studentCreatorSpy = sinon.spy(StudentCreatorFactory, 'createFromForm');

            var studentSaver = StudentSaverFactory.create();
            studentSaverSpy = sinon.stub(studentSaver, 'save', function (student, done) {
                done(null, student);
            });


            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            studentRegistrar = StudentRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                studentRegistrationFormValidator: studentRegistrationFormValidator,
                userRegistrar: userRegistrar,
                studentSaver: studentSaver,
                emailSender: emailSender
            });

            var testToken = TokenBuilder.ADMIN_TOKEN;

            var registrationForm = {
                userForm: userForm,
                studentForm: studentRegistrationForm
            };
            studentRegistrar.register(testToken, registrationForm, function (err, result) {
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

        it('should save student', function () {
            assert.isTrue(studentSaverSpy.calledOnce);
        });

        it('should send email to new registered student', function () {
            assert.isTrue(emailSenderSpy.calledOnce);
        });

        it('should be called in correct order', function () {
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                studentRegistrationFormValidatorSpy,
                userRegistrarSpy,
                studentCreatorSpy,
                studentSaverSpy,
                emailSenderSpy
            );
        });

        after(function () {
            studentCreatorSpy.restore();
        })

    });

    describe('#register new student with invalid role {Role=Student}', function () {


        before(function (beforeDone) {

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

            studentRegistrar = StudentRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                studentRegistrationFormValidator: studentRegistrationFormValidator
            });

            var testToken = TokenBuilder.STUDENT_TOKEN;

            var registrationForm = {
                userForm: UserFormBuilder.aUserForm().buildForm(),
                studentForm: studentBuilder.aStudent().buildForm()
            };
            studentRegistrar.register(testToken, registrationForm, function (err, result) {
                assert.equal(err, ErrorCodes.HAS_NO_PERMISSION);
                beforeDone();
            });
        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user should not be authorized as ADMIN', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('student registration form should not be validated', function () {
            assert.isFalse(studentRegistrationFormValidatorSpy.calledOnce);
        });

        it('should called in correct order', function () {
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy
            );
        });
    })
});