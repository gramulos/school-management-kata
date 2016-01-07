'use strict';
//var UserFormParamsValidator = require('../users/user-form-params-validator');

var  REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var async = require('async');

var ErrorCodes = require('../infra/error-codes');
var UserFinderFactory = require('./user-finder');
var UserFormValidator = {

    init: function (args) {
        args = args || {};
    },

    validate: function (userForm,done) {
        var self = this;
        async.waterfall([
            function validateName(next){
               var isNameValid = self.validateName(userForm.firstName);
               return next(null,isNameValid);
            },
            function validateLastName(isNameValid,next){
              if(!isNameValid){
                  return next(ErrorCodes.NAME_IS_NOT_VALID);
              }
              var isLastNameValid = self.validateName(userForm.lastName);
              return next(null,isLastNameValid);
            },
            function validatePatronymic(isLastNameValid,next){
                if(!isLastNameValid){
                    return next(ErrorCodes.LAST_NAME_IS_NOT_VALID);
                }
                var isPatronymicValid = self.validateName(userForm.patronymic);
                return next(null,isPatronymicValid);
            },
            function validateIdNumber(isPatronymicValid,next){

                if(!isPatronymicValid){
                    return next(ErrorCodes.PATRONYMIC_IS_NOT_VALID);
                }
                var isIdNumberValid = self.validateIdNumber(userForm.idNumber);
                return next(null,isIdNumberValid);
            },
            function validateEmail(isIdNumberValid,next){
                if(!isIdNumberValid){
                    return next(ErrorCodes.ID_NUMBER_IS_NOT_VALID);
                }
                var isEmailValid = self.validateEmail(userForm.email);
                return next(null,isEmailValid);
            },
            function validatePhoneNumber(isEmailValid,next){
                if(!isEmailValid){
                    return next(ErrorCodes.EMAIL_IS_NOT_VALID);
                }
                var isPhoneValid = self.validatePhoneNumber(userForm.phone);
                return next(null,isPhoneValid);
            },
            function validateUserExistence(isPhoneValid,next){
                if(!isPhoneValid){
                    return next(ErrorCodes.PHONE_NUMBER_IS_NOT_VALID);
                }
                self.validateUserExistenceInDb(userForm.idNumber,next);
            }
        ], function(err,result){
            if(err){
                return done(err);
            }
            else{
                return done(null,result);
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
        if(phoneNumber.length !== 10 || phoneNumber.match(REGEX_NOT_DIGIT)){
            return false;
        }else{
            return true;
        }
    },

    validateUserExistenceInDb:function(idNumber,done){
        var userFinder = UserFinderFactory.create();
        userFinder.findByIdNumber(idNumber,function(err,result){
            if(err){
                return done(err);
            }
            else{
                if(result !== null){
                    return done(null,false);
                }
                else{
                    return done(null,true);
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