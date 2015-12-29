'use strict';

var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-shallow-deep-equal'));
require('./test-helper');

var EmailSenderFactory = require('../src/infra/email-sender');
var EmployeeRegistrarFactory = require('../src/school/employee-registrar');
var UserFinderFactory = require('../src/users/user-finder');
var Roles = require('../src/infra/role');

describe('EmployeeRegistrar test', function(){

    describe('#register new employee - DIRECTOR', function(){

        var employeeRegistrar;
        var emailSenderStub;
        var actualUserId;

        before(function(beforeDone) {

            emailSenderStub = EmailSenderFactory.create();
            emailSenderStub.send = function(email, done) {
                this.sendCalled = true;
                done(null, this.sendCalled);
            };

            var employeeRegistrationForm = {
                employeeForm: {
                    salary: 547,
                    role: Roles.DIRECTOR
                },
                userForm: {
                    firstName: 'azer',
                    lastName: 'safarov',
                    patronymic: 'aydin',
                    idNumber: '4s9qc63',
                    email: 'gramulos@gmail.com',
                    phone: '0518585529',
                    imageUrl: 'gramulos@images.com'
                }
            };

            employeeRegistrar = EmployeeRegistrarFactory.create({emailSender: emailSenderStub});

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';
            employeeRegistrar.register(testToken, employeeRegistrationForm, function (err, result) {
                assert.isNull(err);

                beforeDone();
            });
        });

        it('should create new user in db', function (testDone) {
            var UserFinder = UserFinderFactory.create();
            UserFinder.findByIdNumber('4s9qc63', function (err, user) {
                var expected = {
                    account: {
                        hashedPassword: '864d608a2dccfab024c3304030bcbb1caa8f38f1baa06a841cefe73a50c61ac0',
                        role: Roles.DIRECTOR,
                        username: 'azersafarov4s'
                    },
                    imageUrl: 'gramulos@images.com',
                    email: 'gramulos@gmail.com',
                    phone: '0518585529',
                    idNumber: '4s9qc63',
                    patronymic: 'aydin',
                    lastName: 'safarov',
                    firstName: 'azer'

                };
                assert.shallowDeepEqual(user, expected);
                assert.isNotNull(user.id);

                actualUserId = user.id;
                testDone();
            })
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