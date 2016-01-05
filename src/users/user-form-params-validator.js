'use strict';
var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;

var UserFormParamsValidator = {
    validateName: function (name) {
        if (name.length === 0 || name.match(REGEX_DIGIT) || name.match(REGEX_SYMBOL)) {
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

module.exports = UserFormParamsValidator;