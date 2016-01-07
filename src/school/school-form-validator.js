'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var SchoolFinderFactory = require('../school/school-finder');
var ErrorCodes = require('../infra/error-codes');
var async = require('async');
var SchoolFormValidator = {
    init: function (args) {
        args = args || {};
        this.schoolFinder = args.schoolFinder || SchoolFinderFactory.create()

    },
    validate: function (schoolForm, done) {

        var self = this;
        async.parallel([
            function validateName(next) {
                var isValidName = self.validateName(schoolForm.name);
                if(!isValidName){
                    return next(null, ErrorCodes.NAME_IS_NOT_VALID);
                }
                self.validateSchoolExistenceInDb(schoolForm.name, function(err,isSchoolExistInDb){
                    if(isSchoolExistInDb){
                        return next(null,ErrorCodes.SCHOOL_IS_ALREADY_EXISTING);
                    }
                    else{
                        return next();
                    }
                });
            },

            function validateEmail(next) {

                var isValidEmail = self.validateEmail(schoolForm.email);
                if(isValidEmail){
                    return next();
                }
                else{
                    return next(null,ErrorCodes.EMAIL_IS_NOT_VALID);
                }
            },
            function validatePhoneNumber(next) {

                var isValidPhone = self.validatePhoneNumber(schoolForm.phone);
                if(isValidPhone){
                    return next();
                }
                else{
                    return next(null, ErrorCodes.PHONE_NUMBER_IS_NOT_VALID);
                }
            },
            function validateAddress(next) {
                var isValidAddress = self.validateAddress(schoolForm.address);
                if(isValidAddress){
                    return next()
                }
                else{
                    return next(null,ErrorCodes.ADDRESS_IS_NOT_VALID);
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
        this.schoolFinder.findSchoolByName(name, function (err, result) {
            if (err) {
                done(err);
            } else {
                if (result !== null) {
                    return done(null, true);
                } else {
                    return done(null, false);
                }
            }
        })
    }
};

var SchoolFormValidatorFactory = {
    create: function (args) {
        var schoolFormValidator = Object.create(SchoolFormValidator);
        schoolFormValidator.init(args);
        return schoolFormValidator;
    }
};

module.exports = SchoolFormValidatorFactory;