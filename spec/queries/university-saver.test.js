'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');
var Fixtures = require('../../test/fixtures');
var UniversitySaver = require('../../src/school/university-saver');
var UniversityFactory = require('../../src/school/university-factory');
var UniversityRepository = require('../../src/school/university-repository');

var UniversityModel = UniversityFactory.getModel();

describe('University saver', function () {
    var universityBuilder = Fixtures.university;

    describe('#save university into db', function () {
        var university;
        before(function (beforeDone) {
            university = universityBuilder.aUniversityForm().build();
            var universitySaver = UniversitySaver.create();

            universitySaver.save(university, function (err, savedUniversity) {
                assert.isNotNull(savedUniversity);
                beforeDone();
            });
        });

        after(function(afterDone){
            UniversityModel.remove({},function(err){
                afterDone();
            })
        });

        it('university should be saved to db', function (testDone) {
            UniversityRepository.findUniversityByName(university.name, function (err, foundUniversity) {
                assert.isNotNull(foundUniversity);
                testDone();
            })
        })
    });

    describe('#save invalid university',function(){
        var university;
        before(function(beforeDone){
            university = universityBuilder.aUniversityForm().build();
            university.name = '';

            var universitySaver = UniversitySaver.create();
            universitySaver.save(university,function(err){
                assert.isNotNull(err);
                beforeDone();
            })
        });

        after(function(afterDone){
            UniversityModel.remove({},function(err){
                afterDone();
            })
        });

        it('university should not be saved',function(testDone){
            UniversityRepository.findUniversityByName(university.name,function(err,foundUniversity){
                assert.isNull(foundUniversity);
                testDone();
            })
        })
    })
});