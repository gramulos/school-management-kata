'use strict';

var async = require('async');

var GradeFinder = require('./grade-finder');
var ErrorCodes = require('../infra/error-codes');


var GradeRegistrationFormValidator = {

    init: function (args) {
        args = args || {};

        this.gradeFinder = args.gradeFinder || GradeFinder.create();

    },
    validate: function (args, done) {

        var self = this;
        var number = args.number;

        async.parallel([
            function validateNumber(next) {
                var isValid = self.validateNumber(number);
                if (!isValid) {
                    return next(null, ErrorCodes.GRADE_NUMBER_IS_NOT_VALID);
                }
                self.validateGradeNumberExistanceInDb(number,function(err,isGradeExistInDb){
                    if(isGradeExistInDb){
                        return next(null,ErrorCodes.GRADE_IS_ALREADY_EXISTS);
                    }else{
                        return next();
                    }
                });
            }
        ],function(err,result){
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

    validateNumber: function (number) {
        return String(number).length != 0 && !number.match(/\D/g);
    },
    validateGradeNumberExistanceInDb: function (number,done) {
        this.gradeFinder.findByNumber(number, function (err, result) {
            if (result !== null) {
                return done(null, true);
            } else {
                return done(null, false)
            }
        });
    }
};


var GradeRegistrationFormValidatorFactory = {

    create: function (args) {
        var newGradeRegistrationFormValidator = Object.create(GradeRegistrationFormValidator);
        newGradeRegistrationFormValidator.init(args);

        return newGradeRegistrationFormValidator;
    }
};

module.exports = GradeRegistrationFormValidatorFactory;