'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');
var Fixtures = require('../../test/fixtures');
var SchoolSaver = require('../../src/school/school-saver');
var SchoolFactory = require('../../src/school/school-factory');
var SchoolFinderFactory = require('../../src/school/school-finder');

var SchoolModel = SchoolFactory.getModel();

describe('School saver', function () {
    var schoolBuilder = Fixtures.school;

    describe('#save school into db', function () {
        var school;
        before(function (beforeDone) {
            school = schoolBuilder.aSchoolForm().build();
            var schoolSaver = SchoolSaver.create();

            schoolSaver.save(school, function (err, savedSchool) {
                assert.isNotNull(savedSchool);
                beforeDone();
            });
        });

        after(function(afterDone){
            SchoolModel.remove({},function(err){
                afterDone();
            })
        });

        it('school should be saved to db', function (testDone) {
            var schoolFinder = SchoolFinderFactory.create();
            schoolFinder.findSchoolByName(school.name, function (err, foundSchool) {
                assert.isNotNull(foundSchool);
                testDone();
            })
        })
    });

    describe('#save invalid school',function(){
        var school;
        before(function(beforeDone){
            school = schoolBuilder.aSchoolForm().build();
            school.name = '';

            var schoolSaver = SchoolSaver.create();
            schoolSaver.save(school,function(err){
                assert.isNotNull(err);
                beforeDone();
            })
        });

        after(function(afterDone){
            SchoolModel.remove({},function(err){
                afterDone();
            })
        });

        it('school should not be saved',function(testDone){
            var schoolFinder = SchoolFinderFactory.create();
            schoolFinder.findSchoolByName(school.name,function(err, school){
                assert.isNull(school);
                testDone();
            })
        })
    })
});