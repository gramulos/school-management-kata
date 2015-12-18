'use strict';

var PasswordValidator = {
    init: function () {

    },
    validate: function () {

    }
};

var PasswordValidatorFactory = {
    create:function(){
        var passwordValidator = Object.create(PasswordValidator);
        passwordValidator.init();
        return passwordValidator;
    }
};

module.exports = PasswordValidatorFactory;
