'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');

var GradeRegistrationFormValidatorFactory = require('../../src/school/grade-registration-form-validator');
var GradeSaverFactory = require('../../src/school/grade-saver');
var GradeFactory = require('../../src/school/grade-factory');
var Fixtures = require('../fixtures');

var GradeModel = GradeFactory.getModel();

describe('GradeRegistrationFormValidator test', function () {

    var gradeBuilder = Fixtures.grade;

    describe('#validate with valid information', function () {

        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create();
            gradeForm = gradeBuilder.aGradeForm().buildForm();
        });

        it('should return true', function (testDone) {
            gradeRegistrationForm.validate(gradeForm, function(err, isValid) {
                assert.isTrue(isValid);

                testDone();
            });
        });
    });

    describe('#validate with invalid information - number', function() {
        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create();
            gradeForm = gradeBuilder.aGradeForm().withNumber('').buildForm();
        });

        it('should return false - when class number is empty', function (testDone) {

            gradeRegistrationForm.validate(gradeForm, function(err, isValid) {
                assert.isFalse(isValid);

                testDone();
            });
        });

        it('should return false - when class number contains symbols', function (testDone) {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2#').buildForm();
            gradeRegistrationForm.validate(gradeForm, function (err, isValid) {
                assert.isFalse(isValid);

                testDone();
            });
        });

        it('should return false - when class number contains letters', function (testDone) {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2eE').buildForm();
            gradeRegistrationForm.validate(gradeForm, function (err, isValid) {
                assert.isFalse(isValid);

                testDone();
            });
        });
    });

    describe('#validate with valid information - BUT grade is already exist in db', function (){

        var grade;
        var gradeRegistrationForm;

        before(function (beforeDone) {

            grade = gradeBuilder.aGradeForm().build();
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create();
            var gradeSaver = GradeSaverFactory.create();

            gradeSaver.save(grade, function(err, savedGrade){
                assert.isNotNull(savedGrade);

                beforeDone();
            })
        });

        after(function(afterDone){
            GradeModel.remove({}, function(err){
                afterDone();
            });
        });

        it('should return false', function(testDone) {

            console.log('121212121');

            var gradeForm = gradeBuilder.aGradeForm().buildForm();
            gradeRegistrationForm.validate(gradeForm, function(err, isValid){
                console.log('66666', isValid);
                assert.isFalse(isValid);

                testDone();
            });
        });
    });
});

