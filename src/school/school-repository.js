'use strict';
var StudentFactory = require('../school/student-factory');

var SchoolRepository = {

    findStudentByUserId: function (userId, done) {
        var StudentModel = StudentFactory.getModel();
        StudentModel.findOne({userId:userId},function(err,foundStudent){
            if(err){
                return done(err);
            }
            return done(null,foundStudent);
        })
    }
};


module.exports = Object.freeze(SchoolRepository);