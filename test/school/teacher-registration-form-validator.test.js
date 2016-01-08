'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;


var TeacherRegistrationFormValidatorFactory = require('../../src/school/teacher-registration-form-validator');
var Fixtures = require('../fixtures');

describe('TeacherRegistrationFormValidatorFactory test', function () {

    var teacherBuilder = Fixtures.teacher;

    describe('#validate with valid information', function(){

        var teacherRegistrationForm;
        var teacherRegistrationFormValidator;
        before(function(){
            teacherRegistrationForm = teacherBuilder.aTeacher().buildForm();
            teacherRegistrationFormValidator = TeacherRegistrationFormValidatorFactory.create();

        });

        it('should return true', function(){
            var validationResult = teacherRegistrationFormValidator.validate(teacherRegistrationForm);
                assert.isTrue(validationResult);

        })

    });

    describe('#validate with invalid form -subject is empty', function(){
        var teacherRegistrationForm;
        var teacherRegistrationFormValidator;

        before(function(){
            teacherRegistrationForm = teacherBuilder.aTeacher().withSubject('').buildForm();
            teacherRegistrationFormValidator = TeacherRegistrationFormValidatorFactory.create();
        });

        it('should return false', function(){
            var validationResult = teacherRegistrationFormValidator.validate(teacherRegistrationForm);
            console.log(teacherRegistrationForm)
            assert.isFalse(validationResult);
        })



    });

});

