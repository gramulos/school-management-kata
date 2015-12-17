'use strict';

var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var StudentRegistrationFormValidatorFactory = require('../school/student-registration-form-validator');
var StudentCreatorFactory = require('../school/student-creator');
var EmailSenderFactory = require('../infra/email-sender');

var EmailFactory = require('../infra/email-factory');

var StudentRegistrar = {

    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.studentRegistrationFormValidator = args.studentRegistrationFormValidator || StudentRegistrationFormValidatorFactory.create();
        this.studentCreator = args.studentCreator || StudentCreatorFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    register: function (token, studentRegistrationForm, done) {
        var self = this;
        self.tokenValidator.validate(token, function (err, account) {
            if (err) {
                console.error(err);
                return done(err);
            }

            if (!account.error) {
                self.authorizer.authorize('ADMIN', account, function (err, isAuthorized) {

                    if (isAuthorized) {
                        var isFormValid = self.studentRegistrationFormValidator.validate(studentRegistrationForm);

                        if (isFormValid) {

                            self.studentCreator.create(studentRegistrationForm, function (err, student) {
                                if (err) {
                                    console.error(err);
                                    return done(err);
                                }

                                if (!student.error) {

                                    self.emailSender.send(
                                        EmailFactory.createStudentRegistrationEmail(student.user),
                                        function (err, result) {
                                            if (err) {
                                                console.error(err);
                                                return done(err);
                                            }

                                            if (result.error) {
                                                return done(null, {error: 'problem with the email'});
                                            }
                                            else {
                                                return done();
                                            }
                                        });

                                }

                            });

                        }
                        else {
                            return done(null, {error: 'form is not valid '});
                        }

                    }
                    else {
                        return done(null, {error: 'has no permission'});
                    }
                });
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