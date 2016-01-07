'use strict';

var GradeFactory = require('../school/grade-factory');

var GradeFinder = {

    init: function(args) {

    },
    findByNumber: function(number, done){
        var Model = GradeFactory.getModel();
        Model.findOne({number: number}, function (err, foundGrade) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, foundGrade);
            }
        });
    }
};


var GradeFinderFactory = {

    create: function (args) {
        var newGradeFinder = Object.create(GradeFinder);
        newGradeFinder.init(args);

        return newGradeFinder;
    }
};

module.exports = GradeFinderFactory;