'use strict';
var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var AccountParamsGeneratorFactory = require('../src/users/account-params-generator');
var UsernameGenerator = require('../src/users/username-generator');
var PasswordGenerator = require('../src/users/password-generator');
var EmailSenderFactory = require('../src/infra/email-sender');
var Fixtures = require('./fixtures');


describe('Generate Account Params test', function () {

    describe('#generateAccountParams', function () {

        var UserFormBuilder = Fixtures.user.aUserForm();

        var accountParamsGenerator;

        var input = {};

        var usernameGenerator, usernameGeneratorSpy;
        var passwordGenerator, passwordGeneratorSpy;
        var emailSender, emailSenderSpy;

        var actual = {};


        before(function (beforeDone) {

            input.userRegistrationForm = UserFormBuilder.build();


            usernameGenerator = UsernameGenerator.create();
            usernameGeneratorSpy = sinon.spy(usernameGenerator, 'generate');

            passwordGenerator = PasswordGenerator.create();
            passwordGeneratorSpy = sinon.spy(passwordGenerator, 'generate');

            emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            accountParamsGenerator = AccountParamsGeneratorFactory.create({
                email: input.userRegistrationForm.email,
                usernameGenerator: usernameGenerator,
                passwordGenerator: passwordGenerator,
                emailSender: emailSender
            });
            accountParamsGenerator.generate(input.userRegistrationForm, function(err, accountParams){
                actual.accountParams = accountParams;
                assert.ok(accountParams);
                beforeDone();
            });

        });

        it('username should be the name, surname and the first 2 chars of pin code', function () {

            assert.equal(actual.accountParams.username, 'rufetisayev5Z');
            assert.isTrue(usernameGeneratorSpy.calledOnce);

        });

        it('password should be the first letter of name, pin code and the first letter of surname', function () {

            assert.equal(actual.accountParams.password, 'r5ZJBKRJi');
            assert.isTrue(passwordGeneratorSpy.calledOnce)
        });

        it('account params should be sent by email', function(){
            assert.isTrue(emailSenderSpy.calledOnce);
        });

        it('order should be correct', function () {

            sinon.assert.callOrder(
                usernameGeneratorSpy,
                passwordGeneratorSpy,
                emailSenderSpy
            )
        })
    });

});