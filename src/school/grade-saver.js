'use strict';

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');

var GradeFactory = require('../school/grade-factory');


var GradeSaver = {

    init: function(args) {

    },

    save: function(grade, done) {
        var Model = GradeFactory.getModel();
        var gradeData = new Model({
            id: grade.id,
            number: grade.number,
            group: {},
            plan: {}
        });

        gradeData.save(function (err, result) {
            if (err) {
                return done(err);
            } else {

                return done(null, result);
            }
        });
    }
};


var GradeSaverFactory = {

    create: function (args) {
        var newGradeSaver = Object.create(GradeSaver);
        newGradeSaver.init(args);

        return newGradeSaver;
    }
};

module.exports = GradeSaverFactory;