'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var SchoolFactory = require('../../src/school/school-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');
var DateProviderFactory = require('../../src/infra/date-provider');

var sinon = require('sinon');
describe('SchoolFactory test', function(){
    var schoolBuilder = Fixtures.school;
    describe('#create school -with valid input', function(){
        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProviderFake = Fakes.getDateProviderFake();
        var createdSchool;
        var schoolForm;
        var school;
        var dateProviderStub;

        before(function(){
            schoolForm = schoolBuilder.aSchoolForm().buildForm();
            createdSchool = SchoolFactory.createFromForm({
                form:schoolForm,

                uuidProvider: uuidProviderFake,
                dateProvider: dateProviderFake
            });
        });




        it('should create new school with id,name,email,phone,addres and created date',function(){
             school = SchoolFactory.create({
                id:uuidProviderFake.getValue(),
                name:schoolForm.name,
                email:schoolForm.email,
                phone:schoolForm.phone,
                address:schoolForm.address,
                createdDate:dateProviderFake.getValue()
            });

            assert.deepEqual(createdSchool,school);
        })
    })

})