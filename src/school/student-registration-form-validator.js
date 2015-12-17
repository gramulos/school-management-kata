'use strict';

var StudentRegistrationFormValidator = {
    init: function(args) {

    },

    validate: function (form) {
        return true;
    }
};

var StudentRegistrationFormValidatorFactory = {
    create: function() {
        var studentRegistrationFormValidator = Object.create(StudentRegistrationFormValidator);
        studentRegistrationFormValidator.init();
        return studentRegistrationFormValidator;
    }
};

module.exports = StudentRegistrationFormValidatorFactory;