'use strict';
//var UserFormParamsValidator = require('../users/user-form-params-validator');

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var async = require('async');

var ErrorCodes = require('../infra/error-codes');
var UserFinderFactory = require('./user-finder');
var UserFormValidator = {

    init: function (args) {
        args = args || {};
        this.userFinder = args.userFinder || UserFinderFactory.create();
    },

    validate: function (userForm, done) {
        var self = this;
        async.parallel([
            function validateName(next) {
                var isValidName = self.validateName(userForm.firstName);
                if (!isValidName) {
                    return next(null,ErrorCodes.NAME_IS_NOT_VALID);
                }
                else {
                    return next();
                }

            },
            function validateLastName(next) {
                var isLastNameValid = self.validateName(userForm.lastName);
                if (!isLastNameValid) {
                    return next(null,ErrorCodes.LAST_NAME_IS_NOT_VALID)
                }
                else{
                    return next();
                }
            },
            function validatePatronymic(next) {
                var isPatronymicValid = self.validateName(userForm.patronymic);
                if(!isPatronymicValid){
                    return next(null,ErrorCodes.PATRONYMIC_IS_NOT_VALID)
                }
                else{
                    return next();
                }
            },
            function validateIdNumber(next) {
                var isIdNumberValid = self.validateIdNumber(userForm.idNumber);
                if(!isIdNumberValid){
                    return next(null,ErrorCodes.ID_NUMBER_IS_NOT_VALID);
                }
                self.validateUserExistenceInDb(userForm.idNumber, function(err,isUserExistInDb){
                    if(isUserExistInDb){
                        return next(null,ErrorCodes.USER_IS_ALREADY_EXISTING);
                    }
                    else{
                        return next()
                    }
                });

            },
            function validateEmail(next) {
                var isEmailValid = self.validateEmail(userForm.email);
                if(!isEmailValid){
                    return next(null,ErrorCodes.EMAIL_IS_NOT_VALID)
                }
                else{
                    return next();
                }
            },
            function validatePhoneNumber(next) {
                var isPhoneValid = self.validatePhoneNumber(userForm.phone);
                if(!isPhoneValid){
                    return next(null,ErrorCodes.PHONE_NUMBER_IS_NOT_VALID)
                }
                else{
                    return next();
                }
            }
        ], function (err, result) {
            var validationErrors = result.filter(function(item){
                return item !== undefined;
            });
            if (err) {
                return done(err);
            }
            else if(validationErrors.length > 0){
                return done(null,{success:false, validationResults:validationErrors});
            }
            else {
                return done(null, {success:true});
            }
        });


    },

    validateName: function (name) {
        if (String(name).length === 0 || String(name).match(REGEX_DIGIT) || String(name).match(REGEX_SYMBOL)) {
            return false;
        } else {
            return true;
        }
    },
    validateIdNumber: function (idNumber) {
        if (idNumber.length !== 7 || idNumber.match(REGEX_SYMBOL)) {
            return false;
        } else {
            return true;
        }
    },
    validateEmail: function (email) {
        if (email.match(REGEX_EMAIL)) {
            return true;
        } else {
            return false;
        }
    },
    validatePhoneNumber: function (phoneNumber) {
        if (phoneNumber.length !== 10 || phoneNumber.match(REGEX_NOT_DIGIT)) {
            return false;
        } else {
            return true;
        }
    },

    validateUserExistenceInDb: function (idNumber, done) {
        this.userFinder.findByIdNumber(idNumber, function (err, result) {
            if (err) {
                return done(err);
            }
            else {
                if (result !== null) {
                    return done(null, true);
                }
                else {
                    return done(null, false);
                }
            }
        })
    }

};


var UserFormValidatorFactory = {

    create: function (args) {
        var newUserFormValidator = Object.create(UserFormValidator);
        newUserFormValidator.init(args);

        return newUserFormValidator;
    }
};

module.exports = UserFormValidatorFactory;