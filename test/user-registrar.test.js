'use strict';
var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var UserRegistrarFactory = require('../src/users/user-registrar');

var AccountParamsGeneratorFactory = require('../src/users/account-params-generator');
var UserFactory = require('../src/users/user-factory');
var UserSaverFactory = require('../src/users/user-saver');
var UserFormValidatorFactory = require('../src/users/user-form-validator');
var AccountFactory = require('../src/users/account-factory');
var AccountFormValidator = require('../src/users/account-form-validator');
var AccountLoader = require('../src/users/account-finder');
var Fixtures = require('./fixtures');
var Role = require('../src/infra/role');

describe('testing user registrar', function () {
    var userFormBuilder = Fixtures.user.aUserForm();

    describe('#generate user account', function () {
        var userRegistrar;
        var input = {};

        var accountParamsGeneratorSpy;
        var userCreatorSpy;
        var userSaverSpy;
        var accountFactorySpy;
        var userFormValidatorSpy;
        var accountFormValidatorSpy;

        before(function (beforeDone) {

            AccountLoader.findByUsername = function (err, done) {
                done(null, false);
            };

            input.userRegistrationForm = userFormBuilder.build();

            var accountParamsGenerator = AccountParamsGeneratorFactory.create({
                email: input.userRegistrationForm.email
            });

            var userFormValidator = UserFormValidatorFactory.create();
            userFormValidatorSpy = sinon.spy(userFormValidator, 'validate');

            accountParamsGeneratorSpy = sinon.spy(accountParamsGenerator, 'generate');

            var accountFormValidator = AccountFormValidator.create();
            accountFormValidatorSpy = sinon.spy(accountFormValidator, 'validate');

            accountFactorySpy = sinon.spy(AccountFactory, 'create');

            userCreatorSpy = sinon.spy(UserFactory, 'create');

            var userSaver = UserSaverFactory.create();
            userSaverSpy = sinon.spy(userSaver, 'save');

            userRegistrar = UserRegistrarFactory.create({
                userFormValidator: userFormValidator,
                accountParamsGenerator: accountParamsGenerator,
                accountFormValidator: accountFormValidator,
                accountCreator: AccountFactory,
                userCreator: UserFactory,
                userSaver: userSaver

            });

            userRegistrar.register(Role.ADMIN, input.userRegistrationForm, function (err, isSaved) {
                beforeDone();
            });

        });

        it('should validate input form', function () {
            assert.isTrue(userFormValidatorSpy.calledOnce);
        });

        it('should generate a user account params', function () {
            assert.isTrue(accountParamsGeneratorSpy.calledOnce);
        });

        it('should validate account', function () {
            assert.isTrue(accountFormValidatorSpy.calledOnce);
        });

        it('should create account', function () {
            assert.isTrue(accountFactorySpy.calledOnce);
        });

        it('should create user', function () {
            assert.isTrue(userCreatorSpy.calledOnce);
        });

        it('should save the user', function () {
            assert.isTrue(userSaverSpy.calledOnce);
        });

        it('should called in correct order', function () {
            sinon.assert.callOrder(
                userFormValidatorSpy,
                accountParamsGeneratorSpy,
                accountFormValidatorSpy,
                accountFactorySpy,
                userCreatorSpy,
                userSaverSpy
            )
        });

        after(function () {
            accountFactorySpy.restore();
            userCreatorSpy.restore();
        })
    })
});