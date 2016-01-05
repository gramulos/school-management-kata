'use strict';

var EmployeeRegistrationFormValidator = {

    init: function (args) {

    },

    validate: function (form) {
        return this.validateRole(form.role) && this.validateSalary(form.salary) ? true : false;
    },

    validateRole: function (role) {
        if(role > 0 && String(role).match(/\d/g)) {
            return true;
        }
        else {
            return false;
        }
    },

    validateSalary: function (salary) {
        if (String(salary).length > 1 && !String(salary).match(/\W+/g)) {
            return true;
        }
        else {
            return false;
        }
    }
};


var EmployeeRegistrationFormValidatorFactory = {
    create: function (args) {
        var newEmployeeRegistrationFormValidator = Object.create(EmployeeRegistrationFormValidator);
        newEmployeeRegistrationFormValidator.init(args);

        return newEmployeeRegistrationFormValidator;
    }
};

module.exports = EmployeeRegistrationFormValidatorFactory;