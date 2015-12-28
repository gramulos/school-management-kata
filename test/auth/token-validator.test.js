'use strict';

var chai = require('chai');
var assert = chai.assert;
var TokenValidatorFactory = require('../../src/auth/token-validator');

describe('testing the token validator', function () {

    describe('#validate valid Token ', function () {
        var tokenValidator;
        //var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJkODU1YTM2MC1hYTFlLTExZTUtYWQxZC1kNzY3ZjVhOWQzMTMiLCJyb2xlIjoxLCJpYXQiOjE0NTA5NDg1MTUsImV4cCI6MTQ1MTAzNDkxNX0.815QW9QVQ9TNQQaT8347Am6YlQMh9o5t2QfidCJtjI4';
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
        before(function () {
            tokenValidator = TokenValidatorFactory.create();
        });
        it('should return the token', function () {

            tokenValidator.validate(token, function (err, account) {
                assert.isNotNull(account);
            });
        })
    });

    describe('#validate invalid Token  ', function () {
        var tokenValidator;
        var isValid;
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2';
        before(function () {
            tokenValidator = TokenValidatorFactory.create();
        });
        it('should return null', function () {

            isValid = tokenValidator.validate(token, function (err, account) {
                assert.isNull(account);
            });
        })
    })
});