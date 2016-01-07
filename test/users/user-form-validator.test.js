'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var sinon = require('sinon');
var _ = require('lodash');
var fixtures = require('../fixtures');

var UserFinderFactory = require('../../src/users/user-finder');
var UserFormValidatorFactory = require('../../src/users/user-form-validator');

describe('UserFormValidator test', function () {

    var userFormBuilder = fixtures.user.aUserForm();


    describe('#validate valid form', function () {

        var userForm;
        var userFormValidator;
        before(function () {

            userForm = userFormBuilder.build();
            var userFinder = UserFinderFactory.create();
            sinon.stub(userFinder,'findByIdNumber',function(idNumber,done){
                done(null,null);
            });
            userFormValidator =  UserFormValidatorFactory.create({userFinder:userFinder});

        });

        it('should return true', function (testDone) {
            userFormValidator.validate(userForm, function (err, result) {
                assert.isTrue(result.success);
                testDone();
            });
        });
    });

    describe('#validate invalid form - (when id number is incorrect)', function () {

        var userForm;
        var userFormValidator;
        before(function () {
            userForm = userFormBuilder
                                .withIdNumber('4s8a4f9d8e')
                                .buildForm();
            var userFinder = UserFinderFactory.create();
            sinon.stub(userFinder,'findByIdNumber',function(idNumber,done){
                done(null,null);
            });

            userFormValidator =  UserFormValidatorFactory.create({userFinder:userFinder});
        });

        it('should return false', function (testDone) {
            userFormValidator.validate(userForm,function(err,result){
                assert.isFalse(result.success);
                testDone();
            });

        });
    });

    describe('#validate invalid form - (when patronymic is incorrect)', function () {

        var userForm;
        var userFormValidator;
        before(function () {
            userForm = userFormBuilder
                                .withPatronymic('kamaleddin9')
                                .buildForm();

            var userFinder = UserFinderFactory.create();
            sinon.stub(userFinder,'findByIdNumber',function(idNumber,done){
                done(null,null);
            });

            userFormValidator =  UserFormValidatorFactory.create({userFinder:userFinder});
        });

        it('should return false', function (testDone) {
            userFormValidator.validate(userForm,function(err,result){
               assert.isFalse(result.success);
               assert.isNotNull(result.validationResults);
               testDone();
            });

        });
    });

    describe('#validate invalid form - (when phone is incorrect)', function () {

        var userForm;
        var userFormValidator;
        before(function () {
            userForm = userFormBuilder
                .withPhoneNumber('05185855295555')
                .buildForm();
            var userFinder = UserFinderFactory.create();
            sinon.stub(userFinder,'findByIdNumber',function(idNumber,done){
                done(null,null);
            });

            userFormValidator =  UserFormValidatorFactory.create({userFinder:userFinder});
        });

        it('should return false', function (testDone) {
            userFormValidator.validate(userForm,function(err,result){
                assert.isFalse(result.success);
                assert.isNotNull(result.validationResults)
                testDone();
            });
        });
    });

    describe('#validate invalid form - (when email is incorrect)', function () {

        var userForm;
        var userFormValidator;
        before(function () {
            userForm = userFormBuilder
                .withEmail('rufet@imagescom')
                .buildForm();

            userFormValidator =  UserFormValidatorFactory.create();
        });

        it('should return false', function (testDone) {
            userFormValidator.validate(userForm,function(err,result){
                assert.isFalse(result.success);
                assert.isNotNull(result.validationResults);
                testDone();
            });
        });
    });
});