'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;

var ClassroomFormValidator = {
    init: function () {

    },
    validate: function (classRoomForm) {
        if(this.validateNumber(classRoomForm.number) &&
        this.validateDescription(classRoomForm.description)){
            return true;
        }else{
            return false;
        }
    },
    validateNumber: function (roomNumber) {
        if (!roomNumber.match(REGEX_DIGIT)) {
            return false;
        }
        return true;
    },
    validateDescription: function (description) {
        if (description.length === 0 || description.length > 40) {
            return false;
        }
        return true;
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