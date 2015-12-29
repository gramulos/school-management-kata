'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var DirectorRegistrarFactory = require('../../src/school/director-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var UserRegistrarFactory = require('../../src/users/user-registrar');
var AccountFormValidatorFactory = require('../../src/users/account-form-validator');
var UsernamePolicyValidatorFactory = require('../../src/users/username-policy-validator');
var AccountLoaderFactory = require('../../src/users/account-loader-factory');
var EmailSenderFactory = require('../../src/infra/email-sender');
var Fixtures = require('../fixtures');


describe('DirectorRegistrar test', function () {

    var UserFormBuilder = Fixtures.user;
    var AccountBuilderTest = Fixtures.account;

    describe('#register new director', function () {

        var directorRegistrar;

        var tokenValidatorSpy;
        var authorizerSpy;
        var userRegistrarSpy;
        var userForm;
        var emailSenderSpy;

        before(function (beforeDone) {

            userForm = UserFormBuilder.aUserForm().buildForm();

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var accountLoader = AccountLoaderFactory.create();

            var builder = AccountBuilderTest.anAccount();

            accountLoader.findByUsername = function(err, done){
                var existingAccount = builder.build();
                return done(null, existingAccount);
            };

            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader });

            var accountFormValidator = AccountFormValidatorFactory.create({
                usernamePolicyValidator: usernamePolicyValidator
            });


            var userRegistrar = UserRegistrarFactory.create({email: userForm.email, accountFormValidator: accountFormValidator});
            userRegistrarSpy = sinon.spy(userRegistrar, 'register');

            sinon.stub(userRegistrar.userSaver, 'save', function(user, done){
                done(null, user);
            });

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            directorRegistrar = DirectorRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                userRegistrar: userRegistrar,
                emailSender: emailSender
            });

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';

            var registrationForm = {
                userForm: userForm
            };

            directorRegistrar.register(testToken, registrationForm, function (err, result) {
                console.log('##', result);
                beforeDone();
            });
        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as ADMIN', function(){
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('user should be registered', function(){
            assert.isTrue(userRegistrarSpy.calledOnce);
        });

        it('should send email to registered director', function(){
            assert.isTrue(emailSenderSpy.calledOnce);
        });

        it('functions should be called in a correct order', function(){
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                userRegistrarSpy,
                emailSenderSpy
            );
        });
    });
});

