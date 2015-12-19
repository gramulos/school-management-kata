'use strict';
var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var UserRegistrarFactory = require('../src/users/user-registrar');

var AccountGeneratorFactory = require('../src/users/account-generator');
var UserFactory = require('../src/users/user-creator');
var UserSaverFactory = require('../src/users/user-saver');

describe('testing user registrar', function(){

    describe('#generate user account', function(){
        var userRegistrar;
        var studentRegistrationForm;

        var accountGeneratorSpy;
        var userCreatorSpy;
        var userSaverSpy;

        before(function(beforeDone){

            var accountGenerator = AccountGeneratorFactory.create();
            accountGeneratorSpy = sinon.spy(accountGenerator, 'generate');

            userCreatorSpy = sinon.spy(UserFactory, 'create');

            var userSaver = UserSaverFactory.create();
            userSaverSpy = sinon.spy(userSaver, 'save');

            studentRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };

            userRegistrar = UserRegistrarFactory.create({
                accountGenerator: accountGenerator,
                userCreator: UserFactory,
                userSaver: userSaver

            });

            userRegistrar.register(studentRegistrationForm, function(err, isSaved){
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
                accountGeneratorSpy,
                userCreatorSpy,
                userSaverSpy
            )
        });

        after(function(){
            userCreatorSpy.restore();
        })
    })
});