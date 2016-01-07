'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');
var Fixtures = require('../../test/fixtures');
var ClassroomSaver = require('../../src/school/classroom-saver');
var ClassroomFactory = require('../../src/school/classroom-factory');
var ClassroomFinderFactory = require('../../src/school/classroom-finder');

var ClassroomModel = ClassroomFactory.getModel();

describe('Classroom saver', function(){
    var classroomBuilder = Fixtures.classroom;

    describe('#save the classroom', function(){
        var classroom;
        var classroomSaver;

        before(function(beforeDone){
            classroom = classroomBuilder.aClassroomForm().build();
            classroomSaver = ClassroomSaver.create();
            classroomSaver.save(classroom, function(err,classroom){
                assert.isNotNull(classroom);
                beforeDone();
            })
        });

        after(function(afterDone){
            ClassroomModel.remove({},function(err){
                afterDone();
            })
        });

        it('classroom should be saved to db',function(testdone){
            var classroomFinder = ClassroomFinderFactory.create();
            classroomFinder.findClassroomByNumber(classroom.number,function(err,classroom){
                assert.isNotNull(classroom);
                testdone();
            })
        })
    })
});