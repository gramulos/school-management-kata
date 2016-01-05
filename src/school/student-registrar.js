'use strict';

var async = require('async');


var ErrorCodes = require('../infra/error-codes');
var _ = require('lodash');
var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var StudentRegistrationFormValidatorFactory = require('../school/student-registration-form-validator');
var StudentCreatorFactory = require('./student-factory');
var StudentSaverFactory = require('./student-saver');
var EmailSenderFactory = require('../infra/email-sender');
var EmailFactory = require('../infra/email-factory');
var UserRegistrarFactory = require('../users/user-registrar');
var Role = require('../infra/role');
var Actions = require('../infra/actions');

var StudentRegistrar = {

    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.studentRegistrationFormValidator = args.studentRegistrationFormValidator || StudentRegistrationFormValidatorFactory.create();
        this.userRegistrar = args.userRegistrar || UserRegistrarFactory.create();
        //this.studentCreator = args.studentCreator || StudentCreatorFactory.create();
        this.studentSaver = args.studentSaver || StudentSaverFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    register: function (token, registrationForm, done) {
        var self = this;
        async.waterfall([

            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },

            function authorize(account, next) {
                var isAuthorized = self.authorizer.authorize(Actions.CREATE_STUDENT, account);
                return next(null, isAuthorized);
            },

            function validateStudentForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION)
                }
                var isFormValid = self.studentRegistrationFormValidator.validate(registrationForm.studentForm);
                return next(null, isFormValid);
            },

            function registerUser(isFormValid, next) {
                if (!isFormValid) {

                    return next(ErrorCodes.INVALID_FORM);
                }

                self.userRegistrar.register(Role.STUDENT, registrationForm.userForm, next);
            },

            function createStudent(registeredStudent, next){
                if (!registeredStudent) {
                    return next(ErrorCodes.USER_NOT_SAVED);
                }
                var studentData = _.assign({}, {student: registrationForm.studentForm}, {userId: registeredStudent.id});
                var student = StudentCreatorFactory.createFromForm(studentData);

                return next(null, student);
            },

            function saveStudent(student, next) {
                if (!student) {
                    return next(ErrorCodes.STUDENT_IS_NOT_DEFINED)
                }

                self.studentSaver.save(student, next);
            },

            function sendEmailToStudent(student, next) {
                self.emailSender.send(
                    EmailFactory.createStudentRegistrationEmail(student),
                    next);
            }

        ], function (err, result) {
            if (err) {
                return done(err);
            }
            else {
                return done(null,result);
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