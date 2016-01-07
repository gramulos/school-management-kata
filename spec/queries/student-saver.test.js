'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');

var StudentSaverFactory = require('../../src/school/student-saver');
var StudentFinderFactory = require('../../src/school/student-finder');
var StudentFactory = require('../../src/school/student-factory');
var Fixtures = require('../../test/fixtures');

var StudentModel = StudentFactory.getModel();

describe('StudentSaver test', function () {

    var studentBuilder = Fixtures.student;

    describe('#save student into db with valid parameters', function () {

        var student;

        before(function (beforeDone) {
            student = studentBuilder.aStudent().build();

            var studentSaver = StudentSaverFactory.create();
            studentSaver.save(student, function (err, savedStudent) {
                assert.isNotNull(savedStudent);
                beforeDone();
            });
        });

        after(function (afterDone) {
            StudentModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('student should be saved in db', function (testDone) {

            var studentFinder = StudentFinderFactory.create();
            studentFinder.findById(student.id, function (err, foundStudent) {

                assert.isDefined(foundStudent);
                assert.equal(foundStudent.grade, student.grade, 'student grade does not match');
                assert.equal(foundStudent.classNumber, student.classNumber, 'student classNumber does not match');

                testDone();
            });
        });
    });

    describe('#save student into db with incorrect parameters', function () {
        var student;

        before(function (beforeDone) {
            student = studentBuilder.aStudent().build();
            student.grade = '';

            var studentSaver = StudentSaverFactory.create();
            studentSaver.save(student, function (err, savedStudent) {
                assert.isUndefined(savedStudent);

                beforeDone();
            });
        });

        after(function (afterDone) {
            StudentModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('student should NOT be saved in db', function (testDone) {
            var studentFinder = StudentFinderFactory.create();
            studentFinder.findById(student.id, function (err, foundStudent) {
                assert.isNull(foundStudent);
                testDone();
            });
        });
    });
});

