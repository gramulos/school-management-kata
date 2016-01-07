'use strict';

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var ClassroomFormValidatorFactory = require('../../src/school/classroom-form-validator');
var ClassroomFinderFactory = require('../../src/school/classroom-finder');
var Fixtures = require('../fixtures');

describe('testing the classroomFormValidator', function () {
    var classroomFormBuilder = Fixtures.classroom;

    describe('#validate the classroomForm with valid information', function () {
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function () {
            var classroomFinder = ClassroomFinderFactory.create();
            sinon.stub(classroomFinder,'findClassroomByNumber',function(number,done){
                done(null,null);
            });

            classroomFormValidator = ClassroomFormValidatorFactory.create({classroomFinder: classroomFinder});
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().buildForm();

        });

        it('should return true', function (testDone) {
            classroomFormValidator.validate(classroomRegistrationForm, function (err, result) {
                assert.isTrue(result.success);
                testDone();
            });
        })
    });

    describe('#validate the classroomForm with invalid information', function () {
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function () {
            var classroomFinder = ClassroomFinderFactory.create();
            sinon.stub(classroomFinder,'findClassroomByNumber',function(number,done){
                done(null,null);
            });

            classroomFormValidator = ClassroomFormValidatorFactory.create({classroomFinder: classroomFinder});
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().withNumber('aa').buildForm();
        });

        it('should return false', function (testDone) {
            classroomFormValidator.validate(classroomRegistrationForm, function (err, result) {
                assert.isFalse(result.success);
                assert.isNotNull(result.validationResults);
                testDone();
            });
        })
    });
    describe('#validate the classroomForm with existance in db', function () {
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function () {
            var classroomFinder = ClassroomFinderFactory.create();
            sinon.stub(classroomFinder,'findClassroomByNumber',function(number,done){
                done(null,number);
            });

            classroomFormValidator = ClassroomFormValidatorFactory.create({classroomFinder: classroomFinder});
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().buildForm();
        });

        it('should return false', function (testDone) {
            classroomFormValidator.validate(classroomRegistrationForm, function (err, result) {
                assert.isFalse(result.success);
                assert.isNotNull(result.validationResults);
                testDone();
            });
        })
    })

});