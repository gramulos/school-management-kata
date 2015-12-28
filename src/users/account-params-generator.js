'use strict';

var async = require('async');
var assert = require('assert');

var EmailSenderFactory = require('../infra/email-sender');
var ErrorCodes = require('../infra/error-codes');
var EmailFactory = require('../infra/email-factory');

var UsernameGenerator = require('./username-generator');
var PasswordGenerator = require('./password-generator');

var AccountGenerator = {

    init: function (args) {
        args = args || {};

        //assert.ok(args.email, 'invalid input. email address missing');
        //
        //this.email = args.email;
        this.usernameGenerator = args.usernameGenerator || UsernameGenerator.create();
        this.passwordGenerator = args.passwordGenerator || PasswordGenerator.create();
        this.emailSender = args.emailSender || EmailSenderFactory.create();
    },

    generate: function (userForm, done) {

        var username = this.usernameGenerator.generate(userForm.firstName, userForm.lastName, userForm.idNumber);
        var password = this.passwordGenerator.generate(userForm.firstName, userForm.lastName, userForm.idNumber);

        var email = EmailFactory.createAccountDetailsEmail({ to: userForm.email, username: username, password: password });
        this.emailSender.send(email, function(err) {
            if (err) {
                console.error(err);
                return done(err);
            }
            return done(null, { form:{username: username, password: password} });
        });
    }


};

var AccountGeneratorFactory = {
    create: function (args) {
        var accountGenerator = Object.create(AccountGenerator);
        accountGenerator.init(args);
        return accountGenerator;
    }
};

module.exports = AccountGeneratorFactory;