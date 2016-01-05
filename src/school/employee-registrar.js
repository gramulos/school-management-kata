'use strict';

var async = require('async');

var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var UserRegistrarFactory = require('../users/user-registrar');
var EmailSenderFactory = require('../infra/email-sender');
var EmailFactory = require('../infra/email-factory');
var ErrorCodes = require('../infra/error-codes');
var Role = require('../infra/role');
var EmployeeRegistrationFormValidator = require('../school/employee-registration-form-validator');
var EmployeeSaverFactory = require('./employee-saver');
var EmployeeCreatorFactory = require('./employee-factory');
var _ = require('lodash');

var EmployeeRegistrar = {

    init: function (args) {
        args = args || {};

        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.employeeRegistrationFormValidator = args.employeeRegistrationFormValidator || EmployeeRegistrationFormValidator.create();
        this.userRegistrar = args.userRegistrar || UserRegistrarFactory.create();
        this.employeeSaver = args.employeeSaver || EmployeeSaverFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    register: function (token, registrationForm, done) {

        var self = this;

        async.waterfall([
                function validateToken(next) {
                    self.tokenValidator.validate(token, next);
                },

                function authorize(account, next) {
                    var action = self.authorizer.convertRoleToAction(registrationForm.employeeForm.role);
                    var isAuthorized = self.authorizer.authorize(action, account);
                    return next(null, isAuthorized);
                },

                function validateEmployeeForm(isAuthorized, next) {
                    if (!isAuthorized) {
                        return next(ErrorCodes.HAS_NO_PERMISSION)
                    }

                    var isFormValid = self.employeeRegistrationFormValidator.validate(registrationForm.employeeForm);
                    return next(null, isFormValid);
                },

                function registerUser(isFormValid, next) {
                    if(!isFormValid){
                        return next(ErrorCodes.INVALID_FORM)
                    }

                    self.userRegistrar.register(registrationForm.employeeForm.role, registrationForm.userForm, next);
                },

                function createEmployee(registeredEmployee, next) {

                    if (!registeredEmployee) {
                        return next(ErrorCodes.USER_NOT_SAVED);
                    }
                    var employeeData = _.assign({}, {employee: registrationForm.employeeForm}, {userId: registeredEmployee.id});
                    var employee = EmployeeCreatorFactory.createFromForm(employeeData);
                    return next(null, employee);
                },

                function saveEmployee(employee, next) {
                    if (!employee) {
                        return next(ErrorCodes.EMPLOYEE_IS_NOT_DEFINED)
                    }

                    self.employeeSaver.save(employee, next);
                },

                function sendEmailToEmployee(employee, next) {
                    self.emailSender.send(
                        EmailFactory.createEmployeeRegistrationEmail(employee),
                        next);
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

var EmployeeRegistrarFactory = {

    create: function (args) {
        var newEmployeeRegistrar = Object.create(EmployeeRegistrar);
        newEmployeeRegistrar.init(args);

        return newEmployeeRegistrar;
    }
};

module.exports = EmployeeRegistrarFactory;