'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var GradeRegistrationFormValidatorFactory = require('../../src/school/grade-registration-form-validator');
var Fixtures = require('../fixtures');

describe('GradeRegistrationFormValidator test', function () {

    var gradeBuilder = Fixtures.grade;

    describe('#validate with valid information', function () {

        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create();
            gradeForm = gradeBuilder.aGradeForm().buildForm();
        });

        it('should return true', function () {
            var validationResult = gradeRegistrationForm.validate(gradeForm);
            assert.isTrue(validationResult);
        });
    });

    describe('#validate with invalid information - number', function() {
        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create();
            gradeForm = gradeBuilder.aGradeForm().withNumber('').buildForm();
        });

        it('should return false - when class number is empty', function () {

            var validationResult = gradeRegistrationForm.validate(gradeForm);
            assert.isFalse(validationResult);
        });

        it('should return false - when class number contains symbols', function () {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2#').buildForm();
            var validationResult = gradeRegistrationForm.validate(gradeForm);
            assert.isFalse(validationResult);
        });

        it('should return false - when class number contains letters', function () {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2eE').buildForm();
            var validationResult = gradeRegistrationForm.validate(gradeForm);
            assert.isFalse(validationResult);
        });
    })
});

