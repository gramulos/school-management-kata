'use strict';

var PasswordValidator = {
    init: function (args) {

    },
    validate: function (args) {

    }
};

var PasswordValidatorFactory = {
    create: function (args) {
        var passwordValidator = Object.create(PasswordValidator);
        passwordValidator.init(args);
        return passwordValidator;
    }
};

module.exports = PasswordValidatorFactory;
