'use strict';
var async = require('async');
var UserFactory = require('../users/user-creator');
var AccountGeneratorFactory = require('../users/account-generator');
var UserSaverFactory = require('../users/user-saver');

var UserRegistrar = {
    init: function (args) {
        args = args || {};
        this.accountGenerator = args.accountGenerator;
        this.userSaver = args.userSaver || UserSaverFactory.create();
    },

    register: function (userRegistrationForm, done) {
        var self = this;
        async.waterfall([

            function generateAccount(next) {

                var account = self.accountGenerator.generate(userRegistrationForm);
                return next(null, account);
            },

            function createUser(account, next) {
                var createdUser = UserFactory.create({userRegistrationForm: userRegistrationForm, account: account});
                return next(null, createdUser);
            },

            function saveUser(createdUser, next) {

                self.userSaver.save(createdUser, next);
            }
        ], function (err, isSaved) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, isSaved);
            }
        });

    }


};

var UserRegistrarFactory = {
    create: function (args) {
        var userRegistrar = Object.create(UserRegistrar);
        userRegistrar.init(args);
        return userRegistrar;
    }
};

module.exports = UserRegistrarFactory;