'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');


var GradeSaverFactory = require('../../src/school/grade-saver');
var GradeFactory = require('../../src/school/grade-factory');
var GradeFinderFactory = require('../../src/school/grade-finder');
var Fixtures = require('../../test/fixtures');

var GradeModel = GradeFactory.getModel();

describe('GradeSaver test', function () {

    var gradeBuilder = Fixtures.grade;


    describe('#save grade to db with the valid parameters', function () {

        var grade;

        before(function (beforeDone) {

            grade = gradeBuilder.aGradeForm().build();

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

        it('grade should be saved in db', function (testDone) {
            var gradeFinder = GradeFinderFactory.create();

            gradeFinder.findByNumber(grade.number, function(err, foundGrade){

                assert.isDefined(foundGrade);
                assert.equal(foundGrade.number, grade.number, 'grade number does not match');

                testDone();
            });

        });
    });


    describe('#save grade to db with the invalid parameters', function () {

        var grade;

        before(function (beforeDone) {

            grade = gradeBuilder.aGradeForm().buildForm();
            grade.number = '';

            var gradeSaver = GradeSaverFactory.create();
            gradeSaver.save(grade, function(err, savedGrade){

                assert.isUndefined(savedGrade);
                beforeDone();
            })
        });

        after(function(afterDone){
            GradeModel.remove({}, function(err){
                afterDone();
            });
        });

        it('grade should NOT be saved in db', function (testDone) {
            var gradeFinder = GradeFinderFactory.create();
            gradeFinder.findByNumber(grade, function(err, foundGrade){
                assert.isUndefined(foundGrade);

                testDone();
            });
        });
    });


});

