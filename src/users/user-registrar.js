'use strict';
var async = require('async');
var UserFactory = require('./user-creator');
//var AccountGeneratorFactory = require('account-params-generator');
var UserSaverFactory = require('./user-saver');
var AccountFactory = require('./account-factory');

var ErrorCodes = require('../infra/error-codes');

var UserRegistrar = {
    init: function (args) {
        args = args || {};
        this.userFormValidator = args.userFormValidator;
        this.accountGenerator = args.accountGenerator;
        this.userSaver = args.userSaver || UserSaverFactory.create();
    },

    register: function (role, userRegistrationForm, done) {
        var self = this;
        async.waterfall([

            function validateUserForm(next) {
                var isFormValid = self.userFormValidator.validate(userRegistrationForm);
                return next(null, isFormValid)
            },

            function generateAccount(isFormValid, next) {
                if (!isFormValid) {
                    console.warn('User form is invalid');
                    return next(ErrorCodes.INVALID_USER_FORM);
                }

                self.accountGenerator.generate(userRegistrationForm, next);
            },

            function createAccountFromParams(accountParams, next) {
                var account = AccountFactory.create({
                    username: accountParams.username,
                    password: accountParams.password,
                    role: role
                });

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