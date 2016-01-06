'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var UniversityFormValidatorFactory = require('../../src/school/university-form-validator');
var Fixtures = require('../fixtures');

describe('UniversityFormValidator test', function(){
    var universityBuilder = Fixtures.university;

    describe('#validate with valid information', function(){
        var universityRegistrationForm;
        var universityRegistrationFormValidator;

        before(function(){
            universityRegistrationFormValidator = UniversityFormValidatorFactory.create();
            universityRegistrationForm = universityBuilder.aUniversityForm().buildForm();
        });
        it('should return true', function(){
            var validation = universityRegistrationFormValidator.validate(universityRegistrationForm);
            assert.isTrue(validation);
        })
    });

    describe('#validate with invalid information- name missing', function(){
        var universityRegistrationForm;
        var universityRegistrationFormValidator;

        before(function () {
            universityRegistrationFormValidator = UniversityFormValidatorFactory.create();
            universityRegistrationForm = universityBuilder.aUniversityForm().withName('').buildForm();
        });

        it('should return false',function(){
            var validation = universityRegistrationFormValidator.validate(universityRegistrationForm);
            assert.isFalse(validation);
        })
    })

    describe('#validate with invalid information- email missing', function(){
        var universityRegistrationForm;
        var universityRegistrationFormValidator;

        before(function () {
            universityRegistrationFormValidator = UniversityFormValidatorFactory.create();
            universityRegistrationForm = universityBuilder.aUniversityForm().withEmail('').buildForm();
        });

        it('should return false',function(){
            var validation = universityRegistrationFormValidator.validate(universityRegistrationForm);
            assert.isFalse(validation);
        })
    })

});