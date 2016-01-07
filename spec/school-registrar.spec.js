'use strict';
var chai = require('chai');
var assert = chai.assert;

var Fixtures = require('../test/fixtures');
var SchoolRegistrarFactory = require('../src/school/school-registrar');
var SchoolFinderFactory = require('../src/school/school-finder');
var ErrorCodes = require('../src/infra/error-codes');
var mongoose = require('mongoose');

function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();
}

describe('SchoolRegistrar test', function(){
    var tokenBuilder = Fixtures.token;
    var schoolFormBuilder = Fixtures.school;
    describe('#register new school',function(){
        var schoolRegistrar;
        var schoolForm;
        before(function(beforeDone){
            schoolRegistrar = SchoolRegistrarFactory.create();

            var testToken = tokenBuilder.ROOT_ADMIN_TOKEN;
            schoolForm = schoolFormBuilder.aSchoolForm().buildForm();
            schoolRegistrar.register(testToken,schoolForm,function(err, school){
               assert.isNull(err);

               beforeDone();
            })
        });

        it('should create new School in db', function(testDone){
            var schoolFinder = SchoolFinderFactory.create();
            schoolFinder.findSchoolByName(schoolForm.name,function(err, school){
                assert.isNotNull(school);
                testDone();
            })
        });
        after(function (afterDone) {
            clearDB(afterDone);
        });
    });

    describe('#register school with invalid token', function(){
        var schoolRegistrar;
        var schoolForm;
        before(function(beforeDone){
            schoolForm = schoolFormBuilder.aSchoolForm().buildForm();

            schoolRegistrar = SchoolRegistrarFactory.create();

            var testToken = tokenBuilder.invalidToken('fake');

            schoolRegistrar.register(testToken,schoolForm,function(err, school){

                assert.equal(err,ErrorCodes.INVALID_TOKEN);
                beforeDone();
            })
        });

        it('should not save school to the db', function(testDone){
            var schoolFinder = SchoolFinderFactory.create();
            schoolFinder.findSchoolByName(schoolForm.name, function (err, school) {
                assert.isNull(school);
                testDone();
            })
        })
    })

});
