'use strict';

var StudentCreator = {
    init: function(args) {

    },

    create: function (token, done) {
        var testStudent = {
            user: {

                account: {

                }
            }
        };

        done(null, testStudent);
    }
};

var StudentCreatorFactory = {
    create: function(args) {
        var studentCreator = Object.create(StudentCreator);
        studentCreator.init(args);
        return studentCreator;
    }
};

module.exports = StudentCreatorFactory;