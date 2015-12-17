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

describe('StudentRegistrar test', function () {

    describe('#register new student', function() {

        var studentRegistrar;
        var token = 'accessToken';
        var studentRegistrationForm;

        var tokenValidatorSpy;
        var authorizerSpy;
        var studentRegistrationFormValidatorSpy;
        var studentCreatorSpy;
        var emailSenderSpy;

        before(function (beforeDone) {

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var studentRegistrationFormValidator = StudentRegistrationFormValidatorFactory.create();
            studentRegistrationFormValidatorSpy = sinon.spy(studentRegistrationFormValidator, 'validate');

            var studentCreator = StudentCreatorFactory.create();
            studentCreatorSpy = sinon.spy(studentCreator, 'create');

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            studentRegistrar = StudentRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                studentRegistrationFormValidator: studentRegistrationFormValidator,
                studentCreator: studentCreator,
                emailSender: emailSender
            });

            studentRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };

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
               studentCreatorSpy,
               emailSenderSpy
           );
        });

    });
});