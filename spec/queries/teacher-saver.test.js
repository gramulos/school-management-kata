'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');
var Fixtures = require('../../test/fixtures');
var TeacherSaver = require('../../src/school/teacher-saver');
var TeacherFactory = require('../../src/school/teacher-factory');
var TeacherFinderFactory = require('../../src/school/teacher-finder');

var TeacherModel = TeacherFactory.getModel();

describe('Teacher saver',function(){
    var teacherBuilder = Fixtures.teacher;

    describe('#save teacher into db', function(){
        var teacher;
        before(function(beforeDone){
            teacher = teacherBuilder.aTeacher().build();
            var teacherSaver = TeacherSaver.create();

            teacherSaver.save(teacher, function(err, savedTeacher){
                assert.isNotNull(savedTeacher);
                beforeDone();
            });
        });

        after(function(afterDone){
            TeacherModel.remove({},function(err){
                afterDone();
            });
        });

        it('teacher should be saved in db', function (testDone) {
            var teacherFinder = TeacherFinderFactory.create();
            teacherFinder.findTeacherById(teacher.id, function(err,foundTeacher){
                console.log('bsasa',foundTeacher);
                assert.isNotNull(foundTeacher);
                testDone();
            });
        });
    });


});