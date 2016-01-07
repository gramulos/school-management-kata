'use strict';

var assert = require('assert');

var StudentRegistrationFormValidator = {
    init: function(args) {

    },

    validate: function (form) {

        return this.validateGrade(form.grade) && this.validateClassNumber(form.classNumber) ? true : false;
    },

    validateGrade: function(grade) {
        if (grade > 0 && String(grade).match(/\d/g)) {
            return true;
        }
        else {
            return false;
        }
    },

    validateClassNumber: function(classNumber) {
        if (String(classNumber).length > 1 && !String(classNumber).match(/\W+/g)) {
            return true;
        }
        else {
            return false;
        }
    },


};

var StudentRegistrationFormValidatorFactory = {
    create: function() {
        var studentRegistrationFormValidator = Object.create(StudentRegistrationFormValidator);
        studentRegistrationFormValidator.init();
        return studentRegistrationFormValidator;
    }
};

module.exports = StudentRegistrationFormValidatorFactory;