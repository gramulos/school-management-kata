'use strict';
//var UserFormParamsValidator = require('../users/user-form-params-validator');

var  REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;

var UserFormValidator = {

    init: function (args) {
        args = args || {};
    },

    validate: function (userForm) {
        if (this.validateName(userForm.firstName) &&
            this.validateName(userForm.lastName) &&
            this.validateName(userForm.patronymic) &&
            this.validateIdNumber(userForm.idNumber) &&
            this.validateEmail(userForm.email) &&
            this.validatePhoneNumber(userForm.phone)) {
            return true;
        }
        else {
            return false;
        }
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