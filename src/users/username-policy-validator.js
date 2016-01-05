'use strict';
var AccountLoaderFactory = require('../users/account-loader-factory');

var UsernamePolicyValidator = {

    init: function(args) {
        args = args || {};
        this.accountLoader = args.accountLoader || AccountLoaderFactory.create();
    },
    validate: function(username, done) {
        this.accountLoader.findByUsername(username, function(err, account) {
            if(account) {
                return done(null, false);
            }
            else {
                return done(null, true)
            }
        });
    }
};


var UsernamePolicyValidatorFactory = {

    create: function (args) {
        var newUsernamePolicyValidator = Object.create(UsernamePolicyValidator);
        newUsernamePolicyValidator.init(args);

        return newUsernamePolicyValidator;
    }
};

module.exports = UsernamePolicyValidatorFactory;