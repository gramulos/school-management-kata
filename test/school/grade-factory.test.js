'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var GradeFactory = require('../../src/school/grade-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');

describe('GradeFactory test', function () {

    var GradeBuilder = Fixtures.grade;

    describe('create grade from form', function () {

        var gradeRegistrationForm;
        var currentGrade;

        var uuidProviderFake = Fakes.getUuidProviderFake();

        before(function () {
            gradeRegistrationForm = GradeBuilder.aGradeForm().buildForm();

            currentGrade = GradeFactory.createFromForm({
                gradeForm: gradeRegistrationForm,
                uuidProvider: uuidProviderFake
            });
        });

        it('should return new grade object', function () {
            var grade = GradeFactory.create({
                id: uuidProviderFake.getValue(),
                number: '1',
                groups: {},
                plan: {}
            });

            assert.deepEqual(currentGrade, grade);
        })

    });
});