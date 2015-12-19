'use strict';

var UserFormValidator = {

    init: function(args) {

    },

    validate: function (form) {
        return true;
    }
};


var UserFormValidatorFactory = {

    create: function (args) {
        var newUserFormValidator = Object.create(UserFormValidator);
        newUserFormValidator.init(args);

        return newUserFormValidator;
    }
};

module.exports = UserFormValidatorFactory;