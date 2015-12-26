'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var StudentCreatorFactory = require('../../src/school/student-creator');
var Fixtures = require('../fixtures');

describe('StudentCreator test', function () {

    var studentBuilder = Fixtures.student;

    describe('student created from user and student form', function () {

        var studentRegistrationForm = studentBuilder.aStudentForm().buildForm();

        it('student should contain user, grade, classNumber', function () {

            var student = StudentCreatorFactory.create(studentRegistrationForm);
            var expected = studentBuilder.aStudentForm().build();

            assert.deepEqual(student, expected);
        });
    });
});

