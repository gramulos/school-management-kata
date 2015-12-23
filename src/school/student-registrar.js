'use strict';

var async = require('async');

var ErrorCodes = require('../infra/error-codes');

var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var StudentRegistrationFormValidatorFactory = require('../school/student-registration-form-validator');
var StudentCreatorFactory = require('../school/student-creator');
var EmailSenderFactory = require('../infra/email-sender');
var EmailFactory = require('../infra/email-factory');
var UserRegistrarFactory = require('../users/user-registrar');
var Role = require('../infra/role');

var StudentRegistrar = {

    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.studentRegistrationFormValidator = args.studentRegistrationFormValidator || StudentRegistrationFormValidatorFactory.create();
        this.userRegistrar = args.userRegistrar || UserRegistrarFactory.create();
        this.studentCreator = args.studentCreator || StudentCreatorFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    register: function (token, studentRegistrationForm, done) {
        var self = this;
        async.waterfall([

            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },

            function authorize(account, next) {

                self.authorizer.authorize('ADMIN', account, next);
            },

            function validateStudentForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION)
                }

                var isFormValid = self.studentRegistrationFormValidator.validate(studentRegistrationForm);
                return next(null, isFormValid);
            },

            function registerUser(isFormValid,next){
                if(!isFormValid){
                    return next(ErrorCodes.INVALID_FORM);
                }
                self.userRegistrar.register(Role.STUDENT,studentRegistrationForm,next);
            },

            function createStudent(isSaved, next) {
                if (!isSaved) {
                    return next(ErrorCodes.USER_NOT_SAVED);
                }

                self.studentCreator.create(studentRegistrationForm, next);
            },

            function sendEmailToStudent(student, next) {

                self.emailSender.send(
                    EmailFactory.createStudentRegistrationEmail(student.user),
                    next);
            }

        ], function (err, result) {
            if (err) {
                return done(err);
            }
            else {
                return done();
            }
        });

    }
};

var StudentRegistrarFactory = {

    create: function (args) {
        var newEmailSender = Object.create(StudentRegistrar);
        newEmailSender.init(args);

        return newEmailSender;
    }
};

module.exports = StudentRegistrarFactory;