'use strict';

var chai = require('chai');
var assert = chai.assert;

var ClassroomFormValidatorFactory = require('../../src/school/classroom-form-validator');
var Fixtures = require('../fixtures');
describe('testing the classroomFormValidator', function () {
    var classroomFormBuilder = Fixtures.classroom;

    describe('#validate the classroomForm with valid information', function () {
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function () {
            classroomFormValidator = ClassroomFormValidatorFactory.create();
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().buildForm();
        });

        it('should return true', function (testDone) {
            classroomFormValidator.validate(classroomRegistrationForm, function (err, result) {
                assert.isTrue(result);
                testDone();
            });
        })
    });

    describe('#validate the classroomForm with invalid information', function () {
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function () {
            classroomFormValidator = ClassroomFormValidatorFactory.create();
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().withNumber('').buildForm();
        });

        it('should return true', function (testDone) {
            classroomFormValidator.validate(classroomRegistrationForm, function (err, result) {
                assert.isNotNull(err);
                testDone();
            });
        })
    })

});