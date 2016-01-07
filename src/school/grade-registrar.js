'use strict';

var async = require('async');

var GradeRegistrationFormValidator = require('../school/grade-registration-form-validator');
var TokenValidatorFactory = require('../auth/token-validator');
var GradeFactory = require('../school/grade-factory');
var AuthorizerFactory = require('../auth/authorizer');
var GradeSaver = require('../school/grade-saver');
var ErrorCodes = require('../infra/error-codes');
var Actions = require('../infra/actions');
var _ = require('lodash');

var GradeRegistrar = {

    init: function (args) {
        args = args || {};

        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.gradeRegistrationFormValidator = args.gradeRegistrationFormValidator || GradeRegistrationFormValidator.create();
        this.gradeSaver = args.gradeSaver || GradeSaver.create();
    },
    register: function (token, registrationForm, done) {

        var self = this;

        async.waterfall([
                function validateToken(next) {
                    self.tokenValidator.validate(token, next);
                },

                function authorize(account, next) {

                    var isAuthorized = self.authorizer.authorize(Actions.CREATE_GRADE, account);
                    return next(null, isAuthorized);
                },

                function validateGradeForm(isAuthorized, next) {

                    if (!isAuthorized) {
                        return next(ErrorCodes.HAS_NO_PERMISSION)
                    }

                    self.gradeRegistrationFormValidator.validate(registrationForm.gradeForm, function(err, isFormValid){
                        if(err){
                            return next(ErrorCodes.INVALID_FORM);
                        }
                        else{
                            return next(null, isFormValid);
                        }
                    });

                },

                function registerGrade(isFormValid, next) {

                    if(!isFormValid){
                        return next(ErrorCodes.INVALID_FORM)
                    }

                    var grade = GradeFactory.createFromForm(registrationForm);

                    return next(null, grade);
                },

                function saveGrade(grade, next) {
                    if (!grade) {
                        return next(ErrorCodes.GRADE_IS_NOT_DEFINED)
                    }

                    self.gradeSaver.save(grade, next);
                }
            ],
            function (err, result) {
                if (err) {
                    return done(err);
                }
                else {
                    return done(null, result);
                }
            });
    }
};


var GradeRegistrarFactory = {

    create: function (args) {
        var newGradeRegistrar = Object.create(GradeRegistrar);
        newGradeRegistrar.init(args);

        return newGradeRegistrar;
    }
};

module.exports = GradeRegistrarFactory;