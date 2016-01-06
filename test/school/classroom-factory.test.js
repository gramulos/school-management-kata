'use strict';

var chai = require('chai');
var assert = chai.assert;

var ClassroomFactory = require('../../src/school/classroom-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');

var sinon = require('sinon');
describe('ClassroomFactory test', function(){
    var classroomBuilder = Fixtures.classroom;

    describe('#create classroom -with valid input',function(){
        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProviderFake = Fakes.getDateProviderFake();
        var createdClassRoom;
        var classroomForm;
        var classroom;

        before(function(){
            classroomForm = classroomBuilder.aClassroomForm().buildForm();
            createdClassRoom = ClassroomFactory.createFromForm({
                form:classroomForm,
                uuidProvider:uuidProviderFake,
                dateProvider:dateProviderFake
            });
        });


        it('should create new classroom with id,number and description',function(){
            classroom = ClassroomFactory.create({
                id:uuidProviderFake.getValue(),
                createdDate:dateProviderFake.getValue(),
                number:classroomForm.number,
                description:classroomForm.description
            });

            assert.deepEqual(createdClassRoom,classroom);
        })

    })



});


