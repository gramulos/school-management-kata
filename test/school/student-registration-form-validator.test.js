'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var StudentRegistrationFormValidatorFactory = require('../../src/school/student-registration-form-validator');
var Fixtures = require('../fixtures');

describe('StudentRegistrationFormValidator test', function () {

    var studentBuilder = Fixtures.student;

    describe('#validate with valid information', function () {

        var studentRegistrationForm;
        var studentForm;

        before(function () {
            studentRegistrationForm = StudentRegistrationFormValidatorFactory.create();
            studentForm = studentBuilder.aStudent().buildForm();
        });

        it('should return true', function () {
            var validationResult = studentRegistrationForm.validate(studentForm);
            assert.isTrue(validationResult);
        });
    });

    describe('#validate with invalid information - grade is empty', function () {

        var studentRegistrationForm;
        var studentForm;

        before(function () {
            studentRegistrationForm = StudentRegistrationFormValidatorFactory.create();
            studentForm = studentBuilder.aStudent().withGrade('').buildForm();
        });

        it('should return true', function () {
            var validationResult = studentRegistrationForm.validate(studentForm);
            assert.isFalse(validationResult);
        });
    });

    describe('#validate with invalid information - class number is empty', function () {

        var studentRegistrationForm;
        var studentForm;

        before(function () {
            studentRegistrationForm = StudentRegistrationFormValidatorFactory.create();
            studentForm = studentBuilder.aStudent().withClassNumber('').buildForm();
        });

        it('should return false', function () {
            var validationResult = studentRegistrationForm.validate(studentForm);
            assert.isFalse(validationResult);
        });
    });

    describe('#validate with invalid information - grade contains letters', function () {

        var studentRegistrationForm;
        var studentForm;

        before(function () {
            studentRegistrationForm = StudentRegistrationFormValidatorFactory.create();
            studentForm = studentBuilder.aStudent().withGrade('ss').buildForm();
        });

        it('should return true', function () {
            var validationResult = studentRegistrationForm.validate(studentForm);
            assert.isFalse(validationResult);
        });
    });

    describe('#validate with invalid information - class number contains symbols', function () {

        var studentRegistrationForm;
        var studentForm;

        before(function () {
            studentRegistrationForm = StudentRegistrationFormValidatorFactory.create();
            studentForm = studentBuilder.aStudent().withClassNumber('@#$').buildForm();
        });

        it('should return true', function () {
            var validationResult = studentRegistrationForm.validate(studentForm);
            assert.isFalse(validationResult);
        });
    });
});

