'use strict';

var PasswordPolicyValidator = {
    validate: function(password) {
        return password.match(/[A-Za-z]/) && password.match(/[0-9]/) && password.length > 6 && !password.match(/\W+/) ? true : false;
    }
};

module.exports = PasswordPolicyValidator;