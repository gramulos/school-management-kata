'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var SchoolFormValidatorFactory = require('../../src/school/school-form-validator');
var Fixtures = require('../fixtures');

describe('SchoolFormValidator test', function(){
    var schoolBuilder = Fixtures.school;

    describe('#validate with valid information', function(){
        var schoolRegistrationForm;
        var schoolRegistrationFormValidator;

        before(function(){
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().buildForm();
        });
        it('should return true', function(){
            var validation = schoolRegistrationFormValidator.validate(schoolRegistrationForm);
            assert.isTrue(validation);
        })
    });

    describe('#validate with invalid information- name missing', function(){
        var schoolRegistrationForm;
        var schoolRegistrationFormValidator;

        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().withName('').buildForm();
        });

        it('should return false',function(){
            var validation = schoolRegistrationFormValidator.validate(schoolRegistrationForm);
            assert.isFalse(validation);
        })
    })

    describe('#validate with invalid information- email missing', function(){
        var schoolRegistrationForm;
        var schoolRegistrationFormValidator;

        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().withEmail('').buildForm();
        });

        it('should return false',function(){
            var validation = schoolRegistrationFormValidator.validate(schoolRegistrationForm);
            assert.isFalse(validation);
        })
    })

});