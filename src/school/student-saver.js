'use strict';

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');

var StudentFactory = require('../school/student-factory');

var StudentSaver = {
    init: function (args) {

    },

    save: function (student, done) {

        var Model = StudentFactory.getModel();

        var studentData = new Model({
            id: student.id,
            userId: student.userId,
            grade: student.grade,
            classNumber: student.classNumber
        });

        studentData.save(function (err, result) {
            if (err) {
                return done(err);
            } else {
                return done(null, result);
            }
        });
    }
};

var StudentSaverFactory = {
    create: function (args) {
        var studentSaver = Object.create(StudentSaver);
        studentSaver.init(args);

        return studentSaver;
    }
};

module.exports = StudentSaverFactory;
