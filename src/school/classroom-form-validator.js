'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var ErrorCodes = require('../infra/error-codes');
var ClassroomFinderFactory = require('../school/classroom-finder');

var async = require('async');

var ClassroomFormValidator = {
    init: function () {

    },
    validate: function (classRoomForm,done) {
        var self = this;
        async.waterfall([
            function validateNumber(next){
                var isValidNumber = self.validateNumber(classRoomForm.number);
                return next(null,isValidNumber);
            },
            function validateClassroomExistanceInDb(isValidNumber,next){
                if(!isValidNumber){
                    return next(ErrorCodes.CLASSROOM_NUMBER_IS_NOT_DEFINED);
                }
                self.validateClassroomExistanceInDb(classRoomForm.number,next);
            },
            function validateDescription(isExistInDb,next){
                if(!isExistInDb){
                    return next(ErrorCodes.CLASSROOM_IS_ALREADY_EXISTING);
                }
                var isValidDescription = self.validateDescription(classRoomForm.description);
                return next(null,isValidDescription);
            }
        ],function(err,result){
            if(err){
                return done(err);
            }else{
                return done(null,result);
            }
        });
    },
    validateNumber: function (roomNumber) {
        if(!roomNumber.match(REGEX_DIGIT)) {
            return false;
        }
        return true;
    },
    validateDescription: function (description) {
        if(description.length === 0 || description.length > 40) {
            return false;
        }
        return true;
    },
    validateClassroomExistanceInDb:function(number,done){
        var classroomFinder = ClassroomFinderFactory.create();
        classroomFinder.findClassroomByNumber(number,function(err,isExist){
            if(err){
                done(err);
            }else{
                if(isExist !== null){
                    return done(null,false);
                }else{
                    return done(null,true);
                }
            }
        })
    }
};

var ClassroomFormValidatorFactory = {
    create: function () {
        var classroomFormValidator = Object.create(ClassroomFormValidator);
        classroomFormValidator.init();
        return classroomFormValidator;
    }
};

module.exports = ClassroomFormValidatorFactory;