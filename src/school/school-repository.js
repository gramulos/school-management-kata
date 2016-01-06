'use strict';

var SchoolFactory = require('./school-factory');

var SchoolRepository = {
    findSchoolByName: function(schoolName, done){
        var SchoolModel = SchoolFactory.getModel();
        SchoolModel.findOne({name:schoolName}, function(err, school){
            if(err){
                return done(err);
            }
            return done(null,school);
        })
    }
};

module.exports = Object.freeze(SchoolRepository);