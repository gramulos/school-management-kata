'use strict';

var TokenValidator = {
    init: function(args) {

    },

    validate: function (token, done) {
        var testAccount = {
            username: 'anar',
            role: 'ADMIN'
        };

        done(null, testAccount);
    }
};

var TokenValidatorFactory = {
    create: function(args) {
        var validator = Object.create(TokenValidator);
        validator.init(args);
        return validator;
    }
};

module.exports = TokenValidatorFactory;