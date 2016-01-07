'use strict';

var async = require('async');

var TokenValidatorFatory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var SchoolFormValidatorFactory = require('./school-form-validator');
var SchoolFactory = require('./school-factory');
var SchoolSaverFactory = require('./school-saver');
var ErrorCodes = require('../infra/error-codes');
var Actions = require('../infra/actions');

var SchoolRegistrar = {
    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFatory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.schoolFormValidator = args.schoolFormValidator || SchoolFormValidatorFactory.create();
        this.schoolSaver = args.schoolSaver || SchoolSaverFactory.create();

    },
    register: function (token, schoolForm, done) {
        var self = this;
        async.waterfall([

            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },
            function authorize(account, next) {
                var isAuthorized = self.authorizer.authorize(Actions.CREATE_SCHOOL,account);
                return next(null, isAuthorized);
            },
            function validateSchoolForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION)
                }
                self.schoolFormValidator.validate(schoolForm,next);
             },

            function createSchool(isFormValid, next) {
                if (!isFormValid) {
                    return next(ErrorCodes.INVALID_FORM);
                }
                var school = SchoolFactory.createFromForm({form: schoolForm});
                return next(null, school);
            },
            function saveSchool(school, next) {
                if (!school) {
                    return next(ErrorCodes.SCHOOL_IS_NOT_DEFINED);
                }
                self.schoolSaver.save(school, next);
            }
        ], function (err, result) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, result);
            }
        })
    }
};

var SchoolRegistrarFactory = {
    create: function (args) {
        var schoolRegistrar = Object.create(SchoolRegistrar);
        schoolRegistrar.init(args);
        return schoolRegistrar;
    }
};


module.exports = SchoolRegistrarFactory;