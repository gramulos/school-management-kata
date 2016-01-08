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
    },

    createAccountDetailsEmail: function (args) {

    },

    createEmployeeRegistrationEmail: function(user){
        var newEmail = Object.create(Email);
        newEmail.init(user);
        return newEmail;
    },

    createTeacherRegistrationEmail: function(teacher){
        var newEmail = Object.create(Email);
        newEmail.init(teacher);
        return newEmail;
    }
};

module.exports = EmailFactory;