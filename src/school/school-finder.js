'use strict';

var SchoolFactory = require('./school-factory');

var SchoolFinder = {
    init:function(){

    },
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

var SchoolFinderFactory = {
    create:function(){
        var schoolFinder = Object.create(SchoolFinder);
        schoolFinder.init();
        return schoolFinder;

    }
};

module.exports = SchoolFinderFactory;