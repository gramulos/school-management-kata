'use strict';
var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var UserRegistrarFactory = require('../src/users/user-registrar');

var AccountGeneratorFactory = require('../src/users/account-params-generator');
var UserFactory = require('../src/users/user-creator');
var UserSaverFactory = require('../src/users/user-saver');
var UserFormValidatorFactory = require('../src/users/user-form-validator');
var AccountFactory = require('../src/users/account-factory');

var Role = require('../src/infra/role');

describe('testing user registrar', function(){

    describe('#generate user account', function(){
        var userRegistrar;
        var input = {};

        var accountGeneratorSpy;
        var userCreatorSpy;
        var userSaverSpy;
        var accountFactorySpy;
        var userFormValidatorSpy;

        before(function(beforeDone){
            input.studentRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };

            var accountGenerator = AccountGeneratorFactory.create({
                emailAddress: input.studentRegistrationForm.email
            });

            var userFormValidator = UserFormValidatorFactory.create();
            userFormValidatorSpy = sinon.spy(userFormValidator, 'validate');

            accountGeneratorSpy = sinon.spy(accountGenerator, 'generate');

            accountFactorySpy = sinon.spy(AccountFactory, 'create');

            userCreatorSpy = sinon.spy(UserFactory, 'create');

            var userSaver = UserSaverFactory.create();
            userSaverSpy = sinon.spy(userSaver, 'save');

            userRegistrar = UserRegistrarFactory.create({
                userFormValidator: userFormValidator,
                accountGenerator: accountGenerator,
                userCreator: UserFactory,
                userSaver: userSaver

            });

            userRegistrar.register(Role.ADMIN, input.studentRegistrationForm, function(err, isSaved){
                beforeDone();
            });

        });

        it('should generate a user account', function(){
            assert.isTrue(accountGeneratorSpy.calledOnce);
        });


        it('should create a user', function(){
            assert.isTrue(userCreatorSpy.calledOnce);
        });

        it('should save the user', function(){
            assert.isTrue(userSaverSpy.calledOnce);
        });

        it('should called in correct order', function(){
            sinon.assert.callOrder(
                userFormValidatorSpy,
                accountGeneratorSpy,
                accountFactorySpy,
                userCreatorSpy,
                userSaverSpy
            )
        });

        after(function(){
            accountFactorySpy.restore();
            userCreatorSpy.restore();
        })
    })
});