'use strict';

var chai = require('chai');
var assert = chai.assert;

var ClassroomFormValidatorFactory = require('../../src/school/classroom-form-validator');
var Fixtures = require('../fixtures');
describe('testing the classroomFormValidator',function(){
   var classroomFormBuilder = Fixtures.classroom;

   describe('#validate the classroomForm with valid information', function(){
       var classroomFormValidator;
       var classroomRegistrationForm;
       before(function(){
           classroomFormValidator = ClassroomFormValidatorFactory.create();
           classroomRegistrationForm = classroomFormBuilder.aClassroomForm().buildForm();
       });

       it('should return true', function(){
           var validation = classroomFormValidator.validate(classroomRegistrationForm);
           assert.isTrue(validation);
       })

   });

    describe('#validate the classrooForm with invalid information', function(){
        var classroomFormValidator;
        var classroomRegistrationForm;
        before(function(){
            classroomFormValidator = ClassroomFormValidatorFactory.create();
            classroomRegistrationForm = classroomFormBuilder.aClassroomForm().withNumber('').buildForm();
        });

        it('should return true', function(){
            var validation = classroomFormValidator.validate(classroomRegistrationForm);
            assert.isFalse(validation);
        })

    })

});