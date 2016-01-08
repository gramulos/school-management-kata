'use strict';
var async = require('async');
var _ = require('lodash');
var DateProviderFactory = require('../infra/date-provider');
var ErrorCodes = require('../infra/error-codes');
var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var TeacherRegistrationFormValidatorFactory = require('./teacher-registration-form-validator');
var EmployeeRegistrarFactory = require('./employee-registrar');
var TeacherSaverFactory = require('./teacher-saver');
var Actions = require('../infra/actions');
var Role = require('../infra/role');
var EmailSenderFactory = require('../infra/email-sender');
var EmailFactory = require('../infra/email-factory');
var TeacherFactory = require('./teacher-factory');
var TeacherRegistrar = {
    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.teacherRegistrationFormValidator = args.teacherRegistrationFormValidator || TeacherRegistrationFormValidatorFactory.create();
        this.employeeRegistrar = args.employeeRegistrar || EmployeeRegistrarFactory.create();
        this.teacherSaver = args.teacherSaver || TeacherSaverFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },
    register: function (token, registrationForm, done) {
        var self = this;
        async.waterfall([
            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },
            function authorize(account, next) {
                var isAuthorized = self.authorizer.authorize(Actions.CREATE_TEACHER, account);
                return next(null, isAuthorized);
            },

            function validateTeacherForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION);
                }
                var isFormValid = self.teacherRegistrationFormValidator.validate(registrationForm.teacherForm);
                return next(null, isFormValid);
            },
            function registerEmployee(isFormValid, next) {
                console.log('23',token,registrationForm)
                if (!isFormValid) {
                    return next(ErrorCodes.INVALID_FORM);
                }
                self.employeeRegistrar.register(token, registrationForm, next);
            },
            function createTeacher(registeredTeacher, next) {
                if (!registeredTeacher) {
                    return next(ErrorCodes.Employee_NOT_SAVED);
                }
                var teacherData = _.assign({}, {
                    teacher: registrationForm.teacherForm,
                    employeeId: registeredTeacher.employee.id
                });
                var teacher = TeacherFactory.createFromForm(teacherData);

                return next(null, teacher);
            },

            function saveTeacher(teacher, next) {
                if (!teacher) {
                    return next(ErrorCodes.TEACHER_IS_NOT_DEFINED);
                }
                self.teacherSaver.save(teacher, next);
            },

            function sendEmail(teacher, next) {
                self.emailSender.send(EmailFactory.createTeacherRegistrationEmail(teacher),
                    next);
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

var TeacherRegistrarFactory = {
    create: function (args) {
        var teacherRegistrar = Object.create(TeacherRegistrar);
        teacherRegistrar.init(args);
        return teacherRegistrar;
    }
};

module.exports = TeacherRegistrarFactory;