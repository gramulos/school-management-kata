'use strict';

var ErrorCodes = require('../infra/error-codes');

var UserFactory = require('../users/user-factory');

var AccountLoader = {

    init: function (args) {

    },
    findByUsername: function (username, done) {
        var Model = UserFactory.getModel();
        Model.findOne({'account.username': username}, function (err, user) {
            if (err) {
                return done(err);
            }
            else if(user === null){
                return done(ErrorCodes.USERNAME_NOT_EXIST);
            }
            return done(null,user);
        });

    }
};


var AccountLoaderFactory = {

    create: function (args) {
        var newAccountLoader = Object.create(AccountLoader);
        newAccountLoader.init(args);
        return newAccountLoader;
    }
};

module.exports = AccountLoaderFactory;