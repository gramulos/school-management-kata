'use strict';
var async = require('async');
var ErrorCodes = require('../infra/error-codes');
var AccountFinderFactory = require('../users/account-loader-factory');
var PasswordValidatorFactory = require('./password-matcher');
var TokenGeneratorFactory = require('../auth/token-generator');

var LoginManager = {
    init: function (args) {
        args = args || {};
        this.accountFinder = args.userFinder || AccountFinderFactory.create();
        this.passwordValidator = args.passwordValidator || PasswordValidatorFactory.create();
        this.tokenGenerator = args.tokenGenerator || TokenGeneratorFactory.create();
    },
    login: function (loginUser, done) {
        var self = this;

        async.waterfall([
            function findUser(next) {
                self.accountFinder.findByUsername(loginUser.username, next);
            },

            function validatePassword(user, next) {
                var account = user.account;

                var isPasswordMatch = self.passwordValidator.match({password: loginUser.password, hashedPassword: account.hashedPassword});
                return next(null, {isPasswordMatch: isPasswordMatch, user: user});
            },

            function generateToken(passwordValidationResult, next) {
                var isPasswordMatch = passwordValidationResult.isPasswordMatch;
                var user = passwordValidationResult.user;

                if (!isPasswordMatch) {
                    return next(ErrorCodes.LOGIN_FAILED);
                }

                var token = self.tokenGenerator.generate(user.id, user.account.role);
                if(token) {
                    return next(null, token);
                }
            }

        ], function (err, token) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, token);
            }
        })
    }
};

var LoginManagerFactory = {
    create: function (args) {
        var loginManager = Object.create(LoginManager);
        loginManager.init(args);
        return loginManager;
    }
};

module.exports = LoginManagerFactory;