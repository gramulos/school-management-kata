'use strict';

var EmailSender = {

    init: function(args) {

    },

    send: function (email, done) {
        done(null, true);
    }
};


var EmailSenderFactory = {

    create: function (args) {
        var newEmailSender = Object.create(EmailSender);
        newEmailSender.init(args);

        return newEmailSender;
    }
};

module.exports = EmailSenderFactory;