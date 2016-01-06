'use strict';

var async = require('async');

var TokenValidatorFatory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var UniversityFormValidatorFactory = require('../school/university-form-validator');
var UniversityFactory = require('../school/university-factory');
var UniversitySaverFactory = require('../school/university-saver');
var ErrorCodes = require('../infra/error-codes');

var UniversityRegistrar = {
    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFatory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.universityFormValidator = args.universityFormValidator || UniversityFormValidatorFactory.create();
        this.universitySaver = args.universitySaver || UniversitySaverFactory.create();

    },
    register: function (token, universityForm, done) {
        var self = this;
        async.waterfall([

            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },
            function authorize(account, next) {
                var isAuthorized = self.authorizer.authorize(account);
                return next(null, isAuthorized);
            },
            function validateUniversityForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION)
                }
                var isFormValid = self.universityFormValidator.validate(universityForm);
                return next(null, isFormValid);
            },

            function createUniversity(isFormValid, next) {
                if (!isFormValid) {
                    return next(ErrorCodes.INVALID_FORM);
                }
                var university = UniversityFactory.createFromForm({form: universityForm});
                return next(null, university);
            },
            function saveUniversity(university, next) {
                if (!university) {
                    return next(ErrorCodes.UNIVERSITY_IS_NOT_DEFINED);
                }
                self.universitySaver.save(university, next);
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

var UniversityRegistrarFactory = {
    create: function (args) {
        var universityRegistrar = Object.create(UniversityRegistrar);
        universityRegistrar.init(args);
        return universityRegistrar;
    }
};


module.exports = UniversityRegistrarFactory;