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
var AccountLoaderFactory = require('../src/users/account-loader-factory');
var Fixtures = require('./fixtures');
var Role = require('../src/infra/role');
var UsernamePolicyValidatorFactory = require('../src/users/username-policy-validator');
var ErrorCode = require('../src/infra/error-codes');

describe('testing user registrar', function () {
    var userFormBuilder = Fixtures.user;

    describe('#generate user account with correct input', function () {

        var userRegistrar;
        var input = {};

        var accountParamsGeneratorSpy;
        var userCreatorSpy;
        var userSaverSpy;
        var accountFactorySpy;
        var userFormValidatorSpy;
        var accountFormValidatorSpy;
        var accountLoader;

        before(function (beforeDone) {

            accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                return done(null, null);
            };
            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            input.userRegistrationForm = userFormBuilder.aUserForm().buildForm();

            var accountParamsGenerator = AccountParamsGeneratorFactory.create({
                email: input.userRegistrationForm.email
            });

            var userFormValidator = UserFormValidatorFactory.create();
            userFormValidatorSpy = sinon.spy(userFormValidator, 'validate');

            accountParamsGeneratorSpy = sinon.spy(accountParamsGenerator, 'generate');

            var accountFormValidator = AccountFormValidator.create({usernamePolicyValidator: usernamePolicyValidator});
            accountFormValidatorSpy = sinon.spy(accountFormValidator, 'validate');

            accountFactorySpy = sinon.spy(AccountFactory, 'createFromForm');

            userCreatorSpy = sinon.spy(UserFactory, 'createFromForm');

            var userSaver = UserSaverFactory.create();
            userSaverSpy = sinon.stub(userSaver, 'save', function (user, done) {
                done();
            });

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

    describe('#generate user account with incorrect input', function () {


        var userRegistrar;
        var input = {};

        var accountParamsGeneratorSpy;
        var userFormValidatorSpy;
        before(function (beforeDone) {

            input.userRegistrationForm = userFormBuilder.aUserForm()
                                                        .withIdNumber('')
                                                        .buildForm();

            var accountParamsGenerator = AccountParamsGeneratorFactory.create({
                email: input.userRegistrationForm.email
            });

            accountParamsGeneratorSpy = sinon.spy(accountParamsGenerator, 'generate');

            var userFormValidator = UserFormValidatorFactory.create();
            userFormValidatorSpy = sinon.spy(userFormValidator, 'validate');

            userRegistrar = UserRegistrarFactory.create({
                userFormValidator: userFormValidator,
                accountParamsGenerator: accountParamsGenerator
            });

            userRegistrar.register(Role.ADMIN, input.userRegistrationForm, function (err, user) {
                assert.isDefined(err);
                assert.isUndefined(user);
                assert.equal(err,ErrorCode.ID_NUMBER_IS_NOT_VALID);
                beforeDone();
            });

        });

        it('should validate input form', function () {
            assert.isTrue(userFormValidatorSpy.calledOnce);
        });

        it('should not generate account', function () {
            assert.isFalse(accountParamsGeneratorSpy.calledOnce);
        });

        it('should called in correct order', function () {
            sinon.assert.callOrder(
                userFormValidatorSpy
            )
        });
    })
});