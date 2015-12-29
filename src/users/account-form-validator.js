'use strict';

var async = require('async');
var assert = require('assert');
var UsernamePolicyValidatorFactory = require('./username-policy-validator');
var PasswordPolicyValidator= require('./password-policy-validator');

var AccountFormValidator = {

    init: function (args) {
        args = args || {};
        this.usernamePolicyValidator = args.usernamePolicyValidator || UsernamePolicyValidatorFactory.create();
    },
    validate: function (args, done) {
        assert.ok(args.form.username && args.form.password, 'Username or password is incorrect');
        var username = args.form.username;
        var password = args.form.password;
        var self= this;
        async.parallel({
            isValidUsername: function (next) {
                self.usernamePolicyValidator.validate(username, next);
            },
            isValidPassword: function (next) {
                var passwordValidationResult = PasswordPolicyValidator.validate(password);

                return next(null, passwordValidationResult);
            }

        }, function (err, result) {
            if (err) {
                return done(err);
            } else {
                if (result.isValidUsername && result.isValidPassword) {
                    return done(null, true);
                }
                else {
                    return done(null, false)
                }
            }
        });
    }
};


var AccountFormValidatorFactory = {

    create: function (args) {
        var newAccountFormValidator = Object.create(AccountFormValidator);
        newAccountFormValidator.init(args);

        return newAccountFormValidator;
    }
};

module.exports = AccountFormValidatorFactory;