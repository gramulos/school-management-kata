'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var UniversityFactory = require('../../src/school/university-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');
var DateProviderFactory = require('../../src/infra/date-provider');

var sinon = require('sinon');
describe('UniversityFactory test', function(){
    var universityBuilder = Fixtures.university;
    describe('#create university -with valid input', function(){
        var uuidProviderFake = Fakes.getUuidProviderFake();
        var createdUniversity;
        var universityForm;
        var university;
        var dateProviderStub;

        before(function(){
            universityForm = universityBuilder.aUniversityForm().buildForm();
            createdUniversity = UniversityFactory.createFromForm({form:universityForm});
        });

        dateProviderStub = DateProviderFactory.create();
        sinon.stub(dateProviderStub, 'now', function() {
            return new Date(2014, 11, 25);
        });


        it('should create new university with id,name,email,phone,addres and created date',function(){
             university = UniversityFactory.create({
                id:uuidProviderFake.getValue(),
                name:universityForm.name,
                email:universityForm.email,
                phone:universityForm.phone,
                address:universityForm.address,
                createdDate:dateProviderStub.now()
            })
        })
    })

})