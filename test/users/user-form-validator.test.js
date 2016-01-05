'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var _ = require('lodash');
var fixtures = require('../fixtures');

var UserFormValidatorFactory = require('../../src/users/user-form-validator');

describe('UserFormValidator test', function () {

    var userFormBuilder = fixtures.user.aUserForm();


    describe('#validate valid form', function () {

        var validateResult;
        before(function () {

            var userForm = userFormBuilder.build();

            var userFormValidator =  UserFormValidatorFactory.create();
            validateResult = userFormValidator.validate(userForm);
        });

        it('should return true', function () {
            assert.isTrue(validateResult);
        });
    });

    describe('#validate invalid form - (when id number is incorrect)', function () {

        var validateResult;
        before(function () {
            var userForm = userFormBuilder
                                .withIdNumber('4s8a4f9d8e')
                                .buildForm();

            var userFormValidator =  UserFormValidatorFactory.create();
            validateResult = userFormValidator.validate(userForm);
        });

        it('should return false', function () {
            assert.isFalse(validateResult);
        });
    });

    describe('#validate invalid form - (when patronymic is incorrect)', function () {

        var validateResult;
        before(function () {
            var userForm = userFormBuilder
                                .withPatronymic('kamaleddin9')
                                .buildForm();

            var userFormValidator =  UserFormValidatorFactory.create();
            validateResult = userFormValidator.validate(userForm);
        });

        it('should return false', function () {
            assert.isFalse(validateResult);
        });
    });

    describe('#validate invalid form - (when phone is incorrect)', function () {

        var validateResult;
        before(function () {
            var userForm = userFormBuilder
                .withPhoneNumber('05185855295555')
                .buildForm();

            var userFormValidator =  UserFormValidatorFactory.create();
            validateResult = userFormValidator.validate(userForm);
        });

        it('should return false', function () {
            assert.isFalse(validateResult);
        });
    });

    describe('#validate invalid form - (when email is incorrect)', function () {

        var validateResult;
        before(function () {
            var userForm = userFormBuilder
                .withEmail('rufet@imagescom')
                .buildForm();

            var userFormValidator =  UserFormValidatorFactory.create();
            validateResult = userFormValidator.validate(userForm);
        });

        it('should return false', function () {
            assert.isFalse(validateResult);
        });
    });
});