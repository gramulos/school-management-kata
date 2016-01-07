'use strict';

var async = require('async');

var GradeFinder = require('./grade-finder');
var ErrorCodes = require('../infra/error-codes');



var GradeRegistrationFormValidator = {

    init: function(args) {
        args = args || {};

        this.gradeFinder = args.gradeFinder || GradeFinder.create();

    },
    validate: function(args, done){

        var self = this;
        var number = args.number;

        async.waterfall([
            function validateNumber(next){

                var isValid = self.validateNumber(number);

                return next(null, isValid);
            },

            function findByNumber(isValid, next){

                if(isValid){

                    self.gradeFinder.findByNumber(number, function(err,result){
                        if(!result){
                            return next(null, true);
                        } else {
                            return next(null, false)
                        }
                    });

                }
                else{
                    return next(null, false);
                }
            }
        ], function(err, result){
            if(err){
                return done(err);
            }
            else{
                return done(null, result);
            }
        });

    },

    validateNumber: function(number){
        return String(number).length != 0 && !number.match(/\D/g);
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