'use strict';

var GradeRegistrationFormValidator = {

    init: function(args) {

    },
    validate: function(args){

        return this.validateNumber(args.number);
    },

    validateNumber: function(number){

        return String(number).length != 0 && !number.match(/\D/g);
    }
};


var GradeRegistrationFormValidatorFactory = {

    create: function (args) {
        var newGradeRegistrationFormValidator = Object.create(GradeRegistrationFormValidator);
        newGradeRegistrationFormValidator.init(args);

        return newGradeRegistrationFormValidator;
    }
};

module.exports = GradeRegistrationFormValidatorFactory;