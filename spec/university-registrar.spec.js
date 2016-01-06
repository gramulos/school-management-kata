'use strict';
var chai = require('chai');
var assert = chai.assert;

var Fixtures = require('../test/fixtures');
var UniversityRegistrarFactory = require('../src/school/university-registrar');
var UniversityRepository = require('../src/school/university-repository');
var ErrorCodes = require('../src/infra/error-codes');
var mongoose = require('mongoose');

function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();
}

describe('UniversityRegistrar test', function(){
    var tokenBuilder = Fixtures.token;
    var universityFormBuilder = Fixtures.university;
    describe('#register new university',function(){
        var universityRegistrar;
        var universityForm;
        var actualId;

        before(function(beforeDone){
            universityRegistrar = UniversityRegistrarFactory.create();

            var testToken = tokenBuilder.ROOT_ADMIN_TOKEN;
            universityForm = universityFormBuilder.aUniversityForm().buildForm();
            universityRegistrar.register(testToken,universityForm,function(err,university){
               assert.isNull(err);

               beforeDone();
            })
        });

        it('should create new University in db', function(testDone){
            UniversityRepository.findUniversityByName(universityForm.name,function(err,university){
                assert.isNotNull(university);
                testDone();
            })
        });
        after(function (afterDone) {
            clearDB(afterDone);
        });
    });

    describe('#register university with invalid token', function(){
        var universityRegistrar;
        var universityForm;
        var actualId;
        before(function(beforeDone){
            universityForm = universityFormBuilder.aUniversityForm().buildForm();

            universityRegistrar = UniversityRegistrarFactory.create();

            var testToken = tokenBuilder.invalidToken('fake');

            universityRegistrar.register(testToken,universityForm,function(err,university){

                assert.equal(err,ErrorCodes.INVALID_TOKEN);
                beforeDone();
            })
        });

        it('should not save university to the db', function(testDone){
            UniversityRepository.findUniversityByName(universityForm.name, function (err,university) {
                assert.isNull(university);
                testDone();
            })
        })
    })

});
