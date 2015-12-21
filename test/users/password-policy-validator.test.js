'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var PasswordPolicyValidator = require('../../src/users/password-policy-validator');

describe('PasswordPolicyValidator test', function () {

    describe('#validate', function () {

        it('should return true for valid password', function () {
            var validationResult = PasswordPolicyValidator.validate('a4s9qc63s');
            assert.isTrue(validationResult);
        });

        it('should return false for invalid password (when length of password is less than 6 chars)', function () {
            var validationResult = PasswordPolicyValidator.validate('a4s9');
            assert.isFalse(validationResult);
        });

        it('should return false for invalid password (when password contains letters only)', function () {
            var validationResult = PasswordPolicyValidator.validate('aasdasdasdasd');
            assert.isFalse(validationResult);
        });

        it('should return false for invalid password (when password contains digits only)', function () {
            var validationResult = PasswordPolicyValidator.validate('54654654654654');
            assert.isFalse(validationResult);
        });

        it('should return false for invalid password (when password contains symbols)', function () {
            var validationResult = PasswordPolicyValidator.validate('asd45s*w/4asd');
            assert.isFalse(validationResult);
        });
    });
});

