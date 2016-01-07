'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var SchoolFinderFactory = require('../school/school-finder');
var ErrorCodes = require('../infra/error-codes');
var async = require('async');
var SchoolFormValidator = {
    init: function () {

    },
    validate: function (schoolForm, done) {

        var self = this;
        async.waterfall([
            function validateName(next) {
                var isNameValid = self.validateName(schoolForm.name);
                return next(null, isNameValid);
            },
            function validateSchoolExistence(isNameValid,next) {
                if (!isNameValid) {
                    return next(ErrorCodes.NAME_IS_NOT_VALID);
                }
                self.validateSchoolExistenceInDb(schoolForm.name, next);
            },
            function validateEmail(isValid, next) {
                if (!isValid) {
                    return next(ErrorCodes.SCHOOL_IS_ALREADY_EXISTING);
                }
                var isEmailValid = self.validateEmail(schoolForm.email);
                return next(null, isEmailValid);
            },
            function validatePhoneNumber(isEmailValid, next) {
                if (!isEmailValid) {
                    return next(ErrorCodes.EMAIL_IS_NOT_VALID);
                }
                var isPhoneValid = self.validatePhoneNumber(schoolForm.phone);
                return next(null, isPhoneValid);
            },
            function validateAddress(isPhoneValid, next) {
                if (!isPhoneValid) {
                    return next(ErrorCodes.PHONE_NUMBER_IS_NOT_VALID);
                }
                var isAddressValid = self.validateAddress(schoolForm.address);
                return next(null, isAddressValid);
            }
        ], function (err, result) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, result);
            }
        });
    },

    validateName: function (name) {
        if (String(name).length === 0 || String(name).match(REGEX_SYMBOL)) {
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
    validateAddress: function (address) {
        if (address.length < 0 || address.length > 40) {
            return false;
        } else {
            return true;
        }
    },
    validateSchoolExistenceInDb: function (name, done) {
        var schoolFinder = SchoolFinderFactory.create();
        schoolFinder.findSchoolByName(name, function (err, result) {
            if (err) {
                done(err);
            } else {
                if (result !== null) {
                    return done(null, false);
                } else {
                    return done(null, true);
                }
            }
        })
    }
};

var SchoolFormValidatorFactory = {
    create: function () {
        var schoolFormValidator = Object.create(SchoolFormValidator);
        schoolFormValidator.init();
        return schoolFormValidator;
    }
};

module.exports = SchoolFormValidatorFactory;