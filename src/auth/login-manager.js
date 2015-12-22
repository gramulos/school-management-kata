'use strict';
var async = require('async');
var ErrorCodes = require('../infra/error-codes');
var UserFinderFactory = require('../users/user-finder');
var PasswordValidatorFactory = require('../auth/password-validator');
var TokenGeneratorFactory = require('../auth/token-generator');

var LoginManager = {
    init: function (args) {
        args = args || {};
        this.userFinder = args.userFinder || UserFinderFactory.create();
        this.passwordValidator = args.passwordValidator || PasswordValidatorFactory.create();
        this.tokenGenerator = args.tokenGenerator || TokenGeneratorFactory.create();
    },
    login: function (loginUser, done) {
        var self = this;

        async.waterfall([
            function findUser(next) {
                self.userFinder.find(loginUser, next);
            },

            function validatePassword(user, next) {
                var account = user;
                var isPasswordMatch = self.passwordValidator.validate(loginUser.password, account.hashedPassword);
                return next(null, {isPasswordMatch: isPasswordMatch, account: account});
            },

            function generateToken(passwordValidationResult, next) {
                var isPasswordMatch = passwordValidationResult.isPasswordMatch;
                var account = passwordValidationResult.account;

                if (!isPasswordMatch) {
                    return next(ErrorCodes.LOGIN_FAILED);
                }
                self.tokenGenerator.generate(account.userId, account.role, next);
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