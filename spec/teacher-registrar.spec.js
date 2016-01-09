'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));
var sinon = require('sinon');

var mongoose = require('mongoose');

require('./test-helper');

var TeacherRegistrarFactory = require('../src/school/teacher-registrar');
var EmployeeFactory = require('../src/school/employee-factory');
var EmailSenderFactory = require('../src/infra/email-sender');
var ErrorCodes = require('../src/infra/error-codes');
var Fixtures = require('../test/fixtures');
var DateProviderFactory = require('../src/infra/date-provider');
var EmployeeFinderFactory = require('../src/school/employee-finder');
var UserFinderFactory = require('../src/users/user-finder');
var TeacherFinderFactory = require('../src/school/teacher-finder');
var Roles = require('../src/infra/role');

function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function () {
        });
    }
    return done();
}

describe('TeacherRegistrar test', function () {
    var userFormBuilder = Fixtures.user;
    var teacherFormBuilder = Fixtures.teacher;
    var employeeFormBuilder = Fixtures.employee;
    var TokenBuilder = Fixtures.token;
    var dateProviderStub;
    var dateProviderFactorySpy;

    before(function(beforeDone){
        dateProviderStub = DateProviderFactory.create();
        sinon.stub(dateProviderStub, 'now', function() {
            return new Date(2014, 11, 25);
        });
        dateProviderFactorySpy = sinon.stub(DateProviderFactory, 'create', function() {
            return dateProviderStub;
        });
        beforeDone();
    });

    describe('#register new teacher', function () {

        var teacherRegistrar;
        var emailSenderStub;
        var registrationForm;
        var actualUserId;
        var actualEmployeeId;


        before(function (beforeDone) {
            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            registrationForm = {
                userForm: userFormBuilder.aUserForm().buildForm(),
                employeeForm: employeeFormBuilder.anEmployee().buildForm(Roles.TEACHER),
                teacherForm: teacherFormBuilder.aTeacher().buildForm()
            };

            teacherRegistrar = TeacherRegistrarFactory.create({
                emailSenderStub: emailSenderStub,
                dateProvider: dateProviderStub
            });

            var testToken = TokenBuilder.ADMIN_TOKEN;

            teacherRegistrar.register(testToken, registrationForm, function (err, result) {
                assert.isNull(err);
                beforeDone();
            });

        });

        it('should create new user in db', function (testDone) {
            var UserFinder = UserFinderFactory.create();
            UserFinder.findByIdNumber(registrationForm.userForm.idNumber, function (err, user) {

                actualUserId = user.id;
                var expected = userFormBuilder.aUserForm().build();
                expected.account.role = Roles.TEACHER;
                delete expected.id;
                assert.shallowDeepEqual(user, expected);
                assert.isNotNull(user.id);

                testDone();
            })
        });  

        it('employee should be created in db', function (testDone) {
            var employeeFinder = EmployeeFinderFactory.create();
            employeeFinder.findEmployeeByUserId(actualUserId, function (err, employee) {
                actualEmployeeId = employee.id;

                assert.isNotNull(employee);
                testDone();
            })
        });

        it('teacher should be created in db', function (testDone) {
            var teacherFinder = TeacherFinderFactory.create();
            teacherFinder.findTeacherByEmployeeId(actualEmployeeId, function (err, teacher) {
                assert.isNotNull(teacher);
                testDone();
            })
        });

        after(function (afterDone) {
            dateProviderFactorySpy.restore();
            clearDB(afterDone);
        })
    });


});