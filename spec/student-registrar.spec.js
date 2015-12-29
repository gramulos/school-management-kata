'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));
require('./test-helper');

var StudentRegistrarFactory = require('../src/school/student-registrar');
var EmailSenderFactory = require('../src/infra/email-sender');
var UserFinderFactory = require('../src/users/user-finder');
var SchoolRepository = require('../src/school/school-repository');


describe('StudentRegistrar test', function () {

    describe('#register new student', function () {

        var studentRegistrar;
        var emailSenderStub;
        var actualUserId;

        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function (email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            var studentRegistrationForm = {

                studentForm: {
                    grade: '650',
                    classNumber: '5a'
                },
                userForm: {
                    firstName: 'rufet',
                    lastName: 'isayev',
                    patronymic: 'kamaleddin',
                    idNumber: '5ZJBKRJ',
                    email: 'rufetisayev@yahoo.com',
                    phone: '0518585529',
                    imageUrl: 'rufet@images.com'
                }

            };

            studentRegistrar = StudentRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
            studentRegistrar.register(testToken, studentRegistrationForm, function (err, result) {
                assert.isNull(err);

                beforeDone();
            });
        });

        it('should create new user in db', function (testDone) {
            var UserFinder = UserFinderFactory.create();
            UserFinder.findByIdNumber('5ZJBKRJ', function (err, user) {
                var expected = {
                    account: {
                        hashedPassword: '01d7a732aa5c9549f417254155a50591725e3106be36a1d6eebffa54706d0de6',
                        role: 2,
                        username: 'rufetisayev5Z'
                    },
                    imageUrl: 'rufet@images.com',
                    email: 'rufetisayev@yahoo.com',
                    phone: '0518585529',
                    idNumber: '5ZJBKRJ',
                    patronymic: 'kamaleddin',
                    lastName: 'isayev',
                    firstName: 'rufet'

                };
                assert.shallowDeepEqual(user, expected);
                assert.isNotNull(user.id);

                actualUserId = user.id;
                testDone();
            })
        });

        it('student should be created in db', function (testDone) {
            SchoolRepository.findStudentByUserId(actualUserId, function (err, student) {
                assert.isNotNull(student);
                assert.isNotNull(student.account);
                testDone();
            });
        });

        it('should send email with the new account details', function () {
            assert.isTrue(emailSenderStub.sendCalled);
        });

        after(function (afterDone) {
            clearDB(afterDone);
        });

        function clearDB(done) {
            done();
        }
    });
});