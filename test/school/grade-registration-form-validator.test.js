'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var sinon = require('sinon');
require('../test-helper');

var GradeRegistrationFormValidatorFactory = require('../../src/school/grade-registration-form-validator');
var GradeSaverFactory = require('../../src/school/grade-saver');
var GradeFactory = require('../../src/school/grade-factory');
var Fixtures = require('../fixtures');
var GradeFinderFactory  = require('../../src/school/grade-finder');
var GradeModel = GradeFactory.getModel();

describe('GradeRegistrationFormValidator test', function () {

    var gradeBuilder = Fixtures.grade;

    describe('#validate with valid information', function () {

        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            var gradeFinder = GradeFinderFactory.create();
            sinon.stub(gradeFinder,"findByNumber",function(name,done){
                done(null,null);
            });

            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create({gradeFinder:gradeFinder});
            gradeForm = gradeBuilder.aGradeForm().buildForm();
        });

        it('should return true', function (testDone) {
            gradeRegistrationForm.validate(gradeForm, function(err, gradeResult) {
                assert.isTrue(gradeResult.success);
                testDone();
            });
        });
    });

    describe('#validate with invalid information - number', function() {
        var gradeForm;
        var gradeRegistrationForm;

        before(function () {
            var gradeFinder = GradeFinderFactory.create();
            sinon.stub(gradeFinder,"findByNumber",function(name,done){
                done(null,null);
            });
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create({gradeFinder:gradeFinder});
            gradeForm = gradeBuilder.aGradeForm().withNumber('').buildForm();
        });

        it('should return false - when class number is empty', function (testDone) {

            gradeRegistrationForm.validate(gradeForm, function(err, gradeResult) {
                assert.isFalse(gradeResult.success);
                assert.isNotNull(gradeResult.validationResults);
                testDone();
            });
        });

        it('should return false - when class number contains symbols', function (testDone) {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2#').buildForm();
            gradeRegistrationForm.validate(gradeForm, function (err, gradeResult) {
                assert.isFalse(gradeResult.success);
                assert.isNotNull(gradeResult.validationResults);
                testDone();
            });
        });

        it('should return false - when class number contains letters', function (testDone) {

            gradeForm = gradeBuilder.aGradeForm().withNumber('2eE').buildForm();
            gradeRegistrationForm.validate(gradeForm, function (err, gradeResult) {
                assert.isFalse(gradeResult.success);
                assert.isNotNull(gradeResult.validationResults);
                testDone();
            });
        });
    });

    describe('#validate with valid information - BUT grade is already exist in db', function (){

        var grade;
        var gradeRegistrationForm;

        before(function () {

            var gradeFinder = GradeFinderFactory.create();
            sinon.stub(gradeFinder,"findByNumber",function(name,done){
                done(null,name);
            });

            grade = gradeBuilder.aGradeForm().build();
            gradeRegistrationForm = GradeRegistrationFormValidatorFactory.create({gradeFinder:gradeFinder});
        });

        it('should return false', function(testDone) {

            var gradeForm = gradeBuilder.aGradeForm().buildForm();
            gradeRegistrationForm.validate(gradeForm, function(err, gradeResult){
                assert.isFalse(gradeResult.success);
                assert.isNotNull(gradeResult.validationResults);
                testDone();
            });
        });
    });
});

