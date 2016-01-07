'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var sinon = require('sinon');

var SchoolFormValidatorFactory = require('../../src/school/school-form-validator');
var Fixtures = require('../fixtures');
var SchoolFinderFactory = require('../../src/school/school-finder');

describe('SchoolFormValidator test', function () {
    var schoolBuilder = Fixtures.school;
    var schoolRegistrationForm;
    var schoolRegistrationFormValidator;

    describe('#validate with valid information', function () {
        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().buildForm();
        });
        it('should return true', function () {
            schoolRegistrationFormValidator.validate(schoolRegistrationForm,function(err,result){
                assert.isTrue(result);
            });

        })
    });

    describe('#validate with invalid information- name missing', function () {
        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().withName('').buildForm();
        });

        it('should return false', function () {
            schoolRegistrationFormValidator.validate(schoolRegistrationForm,function(err,result){
                assert.isNotNull(err);
            });

        })
    });
    //
    describe('#validate with invalid information- email missing', function () {
        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().withEmail('').buildForm();
        });

        it('should return false', function () {
            schoolRegistrationFormValidator.validate(schoolRegistrationForm,function(err,result){
                assert.isNotNull(err);
            });

        })
    });

    describe.skip('#validate with valid school information although already in db', function () {
        before(function () {
            schoolRegistrationFormValidator = SchoolFormValidatorFactory.create();
            schoolRegistrationForm = schoolBuilder.aSchoolForm().buildForm();

            var school = {id:465};
            var schoolFinder = SchoolFinderFactory.create();
            sinon.stub(schoolFinder, 'findSchoolByName', function (err, done) {
                done(null, school);
            });

        });
        it('should return false', function () {
            schoolRegistrationFormValidator.validate(schoolRegistrationForm,function(err,result){
                assert.isFalse(result);
            });
        })
    })

});