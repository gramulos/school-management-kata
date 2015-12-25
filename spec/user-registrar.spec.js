'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));
var UserRepository = require('../src/auth/user-repository');
var UserRegistrarFactory = require('../src/users/user-registrar');

describe.skip('register user test', function () {

    describe('#generate account', function () {
        var userRegistrar;
        var studentRegistrationForm;
        var expectedUser = {
            firstName: 'rufet',
            lastName: 'isayev',
            idNumber: '5ZJBKRJ',
            account: {

            }
        };

        before(function (beforeDone) {

            studentRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };

            userRegistrar = UserRegistrarFactory.create();
            userRegistrar.register(studentRegistrationForm, function (err, user) {
                assert.isUndefined(err);
                assert.shallowDeepEqual(user, expectedUser);
                beforeDone();

            });


        });

        it('should save a user', function (testDone) {

            UserRepository.findByIdNumber(studentRegistrationForm.idNumber, function (err, user) {
                assert.shallowDeepEqual(user, expectedUser);
                testDone();
            });


        })
    });
});

