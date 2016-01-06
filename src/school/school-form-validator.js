'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;

var SchoolFormValidator = {
    init:function(){

    },
    validate: function(schoolForm){
        if(this.validateName(schoolForm.name) &&
        this.validateEmail(schoolForm.email) &&
        this.validatePhoneNumber(schoolForm.phone) &&
        this.validateAddress(schoolForm.address)){
            return true;
        }else{
            return false;
        }
    },
    validateName: function(name){
        if (String(name).length === 0 || String(name).match(REGEX_DIGIT) || String(name).match(REGEX_SYMBOL)) {
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
    validateAddress: function(address){
        if(address.length < 0 || address.length > 40){
            return false;
        }else{
            return true;
        }
    }
};

var SchoolFormValidatorFactory = {
    create:function(){
        var schoolFormValidator = Object.create(SchoolFormValidator);
        schoolFormValidator.init();
        return schoolFormValidator;
    }
};

module.exports = SchoolFormValidatorFactory;