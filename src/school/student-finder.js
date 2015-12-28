'use strict';

var StudentFactory = require('../school/student-factory');

var StudentFinder = {
    init: function (args) {

    },

    findById: function (studentId, done) {

        var Model = StudentFactory.getModel();
        Model.findOne({id: studentId}, function (err, foundStudent) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, foundStudent);
            }
        });
    }
};

var StudentFinderFactory = {
    create: function (args) {
        var studentFactory = Object.create(StudentFinder);
        studentFactory.init(args);

        return studentFactory;
    }
};

module.exports = StudentFinderFactory;