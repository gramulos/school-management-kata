'use strict';

var async = require('async');

var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var UserRegistrarFactory = require('../users/user-registrar');
var EmailSenderFactory = require('../infra/email-sender');
var EmailFactory = require('../infra/email-factory');
var ErrorCodes = require('../infra/error-codes');
var Role = require('../infra/role');

var DirectorRegistrar = {

    init: function (args) {
        args = args || {};

        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.userRegistrar = args.userRegistrar || UserRegistrarFactory.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    register: function (token, registrationForm, done) {

        var self = this;

        async.waterfall([
                function validateToken(next) {
                    self.tokenValidator.validate(token, next);
                },

                function authorize(account, next) {
                    var isAuthorized = self.authorizer.authorize(Role.ADMIN, account);
                    return next(null, isAuthorized);
                },

                function registerUser(isAuthorized, next) {
                    if(!isAuthorized){
                        return next(ErrorCodes.HAS_NO_PERMISSION)
                    }

                    self.userRegistrar.register(Role.DIRECTOR, registrationForm.userForm, next);
                },

                function sendEmailToDirector(director, next) {
                    self.emailSender.send(
                        EmailFactory.createDirectorRegistrationEmail(director),
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


var DirectorRegistrarFactory = {

    create: function (args) {
        var newDirectorRegistrar = Object.create(DirectorRegistrar);
        newDirectorRegistrar.init(args);

        return newDirectorRegistrar;
    }
};

module.exports = DirectorRegistrarFactory;