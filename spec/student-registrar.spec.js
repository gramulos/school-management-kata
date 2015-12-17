'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));

var StudentRegistrarFactory = require('../src/school/student-registrar');
var EmailSenderFactory = require('../src/infra/email-sender');
var UserRepository = require('../src/auth/user-repository');
var SchoolRepository = require('../src/school/school-repository');


describe('StudentRegistrar test', function () {

    describe('#register new student', function() {

        var studentRegistrar;
        var emailSenderStub;
        var actualUserId;
        before(function (beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function(email, done) {
                this.sendCalled = true;
                done();
            };

            studentRegistrar = StudentRegistrarFactory.create();

            var studentRegistrationForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };

            var testToken = 'put here real JWT access token';
            studentRegistrar.register(testToken, studentRegistrationForm, function (err, result) {
                assert.isUndefined(err);

                beforeDone();
            });
        });

        it ('should create new user in db', function (testDone) {
            UserRepository.findByIdNumber('5ZJBKRJ', function(err, user) {
                var expected = {
                    account: {
                        username: 'risayev',
                        password: '5ZJBKRJ'
                    },
                    firstName: 'rufet',
                    lastName: 'isayev',
                    email: 'rufetisayev@yahoo.com'
                };

                assert.deepEqual(user, expected);
                assert.isNotNull(user.userId);

                actualUserId = user.userId;
                testDone();
            })
        });

        it ('student should be created in db', function (testDone) {
            SchoolRepository.findStudentByUserId({ userId: actualUserId}, function(err, student) {
                assert.isNotNull(student);
                assert.isNotNull(student.account);
                testDone();
            });
        });

        it('should send email with the new account details', function () {
            assert.isTrue(emailSenderStub.sendCalled);
        });

        after(function(afterDone) {
            clearDB(afterDone);
        });

        function clearDB(done) {
            done();
        }
    });
});