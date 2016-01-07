'use strict';

var async = require('async');
var UserFactory = require('./user-factory');
var AccountParamsGeneratorFactory = require('./account-params-generator');
var UserSaverFactory = require('./user-saver');
var AccountFactory = require('./account-factory');
var UserFormValidatorFactory = require('./user-form-validator');
var AccountFormValidator = require('./account-form-validator');

var ErrorCodes = require('../infra/error-codes');

var UserRegistrar = {
    init: function (args) {
        args = args || {};
        this.userFormValidator = args.userFormValidator || UserFormValidatorFactory.create();
        this.accountGenerator = args.accountParamsGenerator || AccountParamsGeneratorFactory.create();
        this.accountFormValidator = args.accountFormValidator || AccountFormValidator.create();
        this.userSaver = args.userSaver || UserSaverFactory.create();
    },

    register: function (role, userRegistrationForm, done) {
        var self = this;
        async.waterfall([
            function validateUserForm(next) {
                self.userFormValidator.validate(userRegistrationForm,next);

            },

            function generateAccount(isFormValid, next) {
                if (!isFormValid) {
                    return next(ErrorCodes.INVALID_USER_FORM);
                }

                self.accountGenerator.generate(userRegistrationForm, next);
            },

            function validateAccountForm(accountParams, next) {
                self.accountFormValidator.validate(accountParams, function (err, result) {
                    if (err) {

                    }
                    else {
                        return next(null, {isAccountValid: result, accountParams: accountParams});
                    }
                });
            },

            function createAccountFromParams(accountForm, next) {

                if (accountForm) {
                    var form = accountForm.accountParams.form;
                    var account = AccountFactory.createFromForm({
                        username: form.username,
                        password: form.password,
                        role: role
                    });

                    return next(null, account);
                }
                else {
                    return next(ErrorCodes.INVALID_FORM);
                }
            },

            function createUser(account, next) {
                var createdUser = UserFactory.createFromForm({form: userRegistrationForm, account: account});
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