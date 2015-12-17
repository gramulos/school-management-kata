'use strict';

var Email = {

    init: function(args) {

    },

    send: function (email, done) {

    }
};


var EmailFactory = {

    createStudentRegistrationEmail: function (user) {
        var newEmail = Object.create(Email);
        newEmail.init(user);

        return newEmail;
    }
};

module.exports = EmailFactory;