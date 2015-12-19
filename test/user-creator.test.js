'use strict';
var chai = require('chai');
var assert = chai.assert;

var userCreator = require('../src/users/user-creator');

describe('Create User test', function(){

    describe('creating user', function(){
        var createdUser;
        var userRegistrationForm;

        before(function(){
            userRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };
            //createdUser = userCreator(userRegistrationForm)
        });

        it('should return the created user equal to the given user', function(){

        });
    });
});
