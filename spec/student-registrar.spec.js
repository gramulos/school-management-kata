'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));
var sinon = require('sinon');


var mongoose = require('mongoose');

require('./test-helper');

var StudentRegistrarFactory = require('../src/school/student-registrar');
var EmailSenderFactory = require('../src/infra/email-sender');
var UserFinderFactory = require('../src/users/user-finder');
//var SchoolRepository = require('../src/school/student-repository');
var StudentFinderFactory = require('../src/school/student-finder');
var UserFactory = require('../src/users/user-factory');

var ErrorCodes = require('../src/infra/error-codes');
var Fixtures = require('../test/fixtures');
var DateProviderFactory = require('../src/infra/date-provider');


function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();
}

describe('StudentRegistrar test', function () {
    var studentFormBuilder = Fixtures.student;
    var userFormBuilder = Fixtures.user;
    var tokenBuilder = Fixtures.token;

    describe('#register new student', function () {

        var studentRegistrar;
        var emailSenderStub;
        var actualUserId;
        var registrationForm;

        var dateProviderStub;
        var dateProviderFactorySpy;

        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            dateProviderStub = DateProviderFactory.create();
            sinon.stub(dateProviderStub, 'now', function() {
                return new Date(2014, 11, 25);
            });
            dateProviderFactorySpy = sinon.stub(DateProviderFactory, 'create', function() {
                return dateProviderStub;
            });

            registrationForm = {
                userForm: userFormBuilder.aUserForm().buildForm(),
                studentForm: studentFormBuilder.aStudent().buildForm()
            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = tokenBuilder.ADMIN_TOKEN;

            studentRegistrar.register(testToken, registrationForm, function (err, result) {
                assert.isNull(err);

                beforeDone();
            });
        });

        it('should create new user in db', function (testDone) {
            var UserFinder = UserFinderFactory.create();
            UserFinder.findByIdNumber(registrationForm.userForm.idNumber, function (err, user) {
                actualUserId = user.id;
                var expected = userFormBuilder.aUserForm().build();
                delete expected.id;

                assert.shallowDeepEqual(user, expected);
                assert.isNotNull(user.id);

                testDone();
            })
        });

        it('student should be created in db', function (testDone) {
            var studentFinder = StudentFinderFactory.create();
            studentFinder.findStudentByUserId(actualUserId, function (err, student) {
                assert.isNotNull(student);
                testDone();
            });
        });

        it('should send email with the new account details', function () {
            assert.isTrue(emailSenderStub.sendCalled);
        });

        after(function (afterDone) {
            dateProviderFactorySpy.restore();
            clearDB(afterDone);
        });

    });

    describe('#register student with invalid token', function () {

        var studentRegistrar;
        var registrationForm;

        before(function (beforeDone) {

            registrationForm = {
                studentForm: studentFormBuilder.aStudent().buildForm(),
                userForm: userFormBuilder.aUserForm().buildForm()
            };

            studentRegistrar = StudentRegistrarFactory.create();
            var testToken = tokenBuilder.invalidToken('fake');

            studentRegistrar.register(testToken, registrationForm, function (err, student) {
                assert.equal(err, ErrorCodes.INVALID_TOKEN);

                beforeDone();
            });
        });

        it('should not save user in db', function (testDone) {
            var UserFinder = UserFinderFactory.create();
            UserFinder.findByIdNumber(registrationForm.userForm.idNumber, function (err, user) {
                assert.isNull(user);
                testDone();
            })
        });

        after(function (afterDone) {
            clearDB(afterDone);
        });


    });

    describe('#register invalid registration form - grade missing', function () {

        var studentRegistrar;
        var emailSenderStub;
        var registrationForm;
        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.sendCalled = false;
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            registrationForm = {
                studentForm: studentFormBuilder.aStudent().withGrade('').buildForm(),
                userForm: userFormBuilder.aUserForm().buildForm()
            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = tokenBuilder.ADMIN_TOKEN;
            studentRegistrar.register(testToken, registrationForm, function (err, result) {
                assert.isDefined(err);
                assert.equal(err, ErrorCodes.INVALID_FORM);

                beforeDone();
            });
        });

        it('should not create new user in db', function (testDone) {
            var userFinder = UserFinderFactory.create();
            userFinder.findByIdNumber(registrationForm.studentForm.idNumber, function (err, user) {
                assert.isNull(user);

                testDone();
            })
        });


        it('should not send email with the new account details', function () {
            assert.isFalse(emailSenderStub.sendCalled);
        });

        after(function (afterDone) {
            clearDB(afterDone);
        });

    });
});