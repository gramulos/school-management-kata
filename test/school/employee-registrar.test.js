'use strict';

var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

var EmployeeRegistrarFactory = require('../../src/school/employee-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var UserRegistrarFactory = require('../../src/users/user-registrar');
var AccountFormValidatorFactory = require('../../src/users/account-form-validator');
var UsernamePolicyValidatorFactory = require('../../src/users/username-policy-validator');
var AccountLoaderFactory = require('../../src/users/account-loader-factory');
var EmailSenderFactory = require('../../src/infra/email-sender');
var EmployeeRegistrationFormValidatorFactory = require('../../src/school/employee-registration-form-validator');
var Fixtures = require('../fixtures');
var EmployeeFactory = require('../../src/school/employee-factory');
var EmployeeSaverFactory = require('../../src/school/employee-saver');
var Roles = require('../../src/infra/role');
var Actions = require('../../src/infra/actions');


describe('EmployeeRegistrar test', function () {

    var UserFormBuilder = Fixtures.user;
    var employeeBuilder = Fixtures.employee;
    var AccountBuilderTest = Fixtures.account;

    describe('#register new employee - DIRECTOR', function () {

        var employeeRegistrar;
        var employeeRegistrationForm;

        var tokenValidatorSpy;
        var authorizerSpy;
        var employeeRegistrationFormValidatorSpy;
        var userRegistrarSpy;
        var employeeSaverSpy;
        var userForm;
        var employeeCreatorSpy;
        var emailSenderSpy;

        before(function (beforeDone) {
            employeeRegistrationForm = employeeBuilder.anEmployee().buildForm();
            userForm = UserFormBuilder.aUserForm().buildForm();

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var employeeRegistrationFormValidator = EmployeeRegistrationFormValidatorFactory.create();
            employeeRegistrationFormValidatorSpy = sinon.spy(employeeRegistrationFormValidator, 'validate');

            var accountLoader = AccountLoaderFactory.create();

            var builder = AccountBuilderTest.anAccount();

            accountLoader.findByUsername = function (err, done) {

                var existingAccount = builder.build();
                return done(null, existingAccount);
            };

            var usernamePolicyValidator = UsernamePolicyValidatorFactory.create({accountLoader: accountLoader});

            var accountFormValidator = AccountFormValidatorFactory.create({
                usernamePolicyValidator: usernamePolicyValidator
            });

            var userRegistrar = UserRegistrarFactory.create({email: userForm.email, accountFormValidator: accountFormValidator});
            userRegistrarSpy = sinon.spy(userRegistrar, 'register');

            sinon.stub(userRegistrar.userSaver, 'save', function (user, done) {
                done(null, user);
            });

            employeeCreatorSpy = sinon.spy(EmployeeFactory, 'createFromForm');

            var employeeSaver = EmployeeSaverFactory.create();
            employeeSaverSpy = sinon.stub(employeeSaver, 'save', function (employee, done) {
                done(null, employee);
            });

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            employeeRegistrar = EmployeeRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                employeeRegistrationFormValidator: employeeRegistrationFormValidator,
                userRegistrar: userRegistrar,
                employeeSaver: employeeSaver,
                emailSender: emailSender
            });

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';

            var registrationForm = {
                employeeForm: {
                    salary: 547,
                    role: Roles.DIRECTOR
                },
                userForm: userForm
            };

            employeeRegistrar.register(testToken, registrationForm, function (err, result) {
                beforeDone();
            });
        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as ADMIN', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('employee registration form should be validated', function () {
            assert.isTrue(employeeRegistrationFormValidatorSpy.calledOnce);
        });

        it('user should be registered', function () {
            assert.isTrue(userRegistrarSpy.calledOnce);
        });

        it('should create an employee', function () {
            assert.isTrue(employeeCreatorSpy.calledOnce);
        });

        it('employee should be registered', function () {
            assert.isTrue(employeeSaverSpy.calledOnce);
        });

        it('should send email to registered employee', function () {
            assert.isTrue(emailSenderSpy.calledOnce);
        });

        it('functions should be called in a correct order', function () {
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                employeeRegistrationFormValidatorSpy,
                userRegistrarSpy,
                employeeCreatorSpy,
                employeeSaverSpy,
                emailSenderSpy
            );
        });

        after(function () {
            employeeCreatorSpy.restore();
        })
    });
});