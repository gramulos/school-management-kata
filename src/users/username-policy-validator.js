'use strict';

var AccountLoader = require('./account-finder');

var UsernamePolicyValidator = {
    validate: function(username, done) {

        AccountLoader.findByUsername(username, function(err, account) {
            if(account) {
                return done(null, false);
            }
            else {
                return done(null, true)
            }
        });
    }
};

module.exports = UsernamePolicyValidator;