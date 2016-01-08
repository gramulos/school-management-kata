'use strict';

var chai = require('chai');
var assert = chai.assert;
require('../../spec/test-helper')
var sinon = require('sinon');

var AccountLoaderFactory = require('../../src/users/account-loader-factory');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var TeacherFormValidatorFactory = require('../../src/school/teacher-registration-form-validator');
var EmployeeRegistrarFactory = require('../../src/school/employee-registrar');
var TeacherFactory = require('../../src/school/teacher-factory');
var TeacherSaverFactory = require('../../src/school/teacher-saver');
var TeacherRegistrarFactory = require('../../src/school/teacher-registrar');
var Roles = require('../../src/infra/role');
var EmailSenderFactory = require('../../src/infra/email-sender');
var Fixtures = require('../fixtures');

describe('TeacherRegistrar test', function () {
    var TeacherFormBuilder = Fixtures.teacher;
    var UserFormBuilder = Fixtures.user;
    var AccountBuilderTest = Fixtures.account;
    var TokenBuilder = Fixtures.token;
    var EmployeeBuilder = Fixtures.employee;

    describe('#register new teacher', function () {
        var tokenValidatorSpy;
        var authorizerSpy;
        var teacherFormValidatorSpy;
        var employeeRegistrarSpy;
        var teacherCreatorSpy;
        var teacherSaverSpy;
        var teacherRegistrar;
        var teacherRegistrationForm;
        var emailSenderSpy;
        before(function (beforeDone) {

            teacherRegistrationForm = TeacherFormBuilder.aTeacher().buildForm();
            var userForm = UserFormBuilder.aUserForm().buildForm();
            var employeeForm = EmployeeBuilder.anEmployee().buildForm(Roles.ADMIN);
            var builder = AccountBuilderTest.anAccount();

            var accountLoader = AccountLoaderFactory.create();
            accountLoader.findByUsername = function (err, done) {
                var existingAccount = builder.build();
                return done(null, existingAccount);
            };

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var teacherRegistrationFormValidator = TeacherFormValidatorFactory.create();
            teacherFormValidatorSpy = sinon.spy(teacherRegistrationFormValidator, 'validate');

            var employeeRegistrar = EmployeeRegistrarFactory.create();
            employeeRegistrarSpy = sinon.spy(employeeRegistrar, 'register');

            sinon.stub(employeeRegistrar.employeeSaver, 'save', function (employee, done) {
                done(null, employee);
            });

            sinon.stub(employeeRegistrar.userRegistrar.userSaver, 'save', function (user, done) {
                done(null, user);
            });


            teacherCreatorSpy = sinon.spy(TeacherFactory, 'createFromForm');

            var teacherSaver = TeacherSaverFactory.create();
            teacherSaverSpy = sinon.stub(teacherSaver, 'save', function (teacher, done) {
                return done(null,teacher);
            });

            var emailSender = EmailSenderFactory.create();
            emailSenderSpy = sinon.spy(emailSender, 'send');

            teacherRegistrar = TeacherRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                teacherRegistrationFormValidator: teacherRegistrationFormValidator,
                employeeRegistrar: employeeRegistrar,
                teacherSaver: teacherSaver,
                emailSender: emailSender
            });

            var testToken = TokenBuilder.ADMIN_TOKEN;

            var registrationForm = {
                userForm: userForm,
                employeeForm: employeeForm,
                teacherForm: teacherRegistrationForm
            };

            teacherRegistrar.register(testToken, registrationForm, function (err, result) {
                beforeDone();
            })

        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });
        it('user has to be authorized as admin', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });
        it('teacher registration form should be validated', function () {
            assert.isTrue(teacherFormValidatorSpy.calledOnce);
        });
        it('employee should be registered', function () {
            assert.isTrue(employeeRegistrarSpy.calledOnce);
        });
        it('should create teacher', function () {
            assert.isTrue(teacherCreatorSpy.calledOnce);
        });
        it('should save teacher', function () {
            assert.isTrue(teacherSaverSpy.calledOnce);
        });
        it('should send email to registered teacher', function () {
            assert.isTrue(emailSenderSpy.calledOnce);
        });
        it('should be called in correct order', function () {
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                teacherFormValidatorSpy,
                employeeRegistrarSpy,
                teacherCreatorSpy,
                teacherSaverSpy,
                emailSenderSpy
            );
        });
        after(function () {
            teacherCreatorSpy.restore();
        })

    })
});