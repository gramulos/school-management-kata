'use strict';

var UniversityFactory = require('../school/university-factory');

var UniversityRepository = {
    findUniversityByName: function(universityName,done){
        var UniversityModel = UniversityFactory.getModel();
        UniversityModel.findOne({name:universityName}, function(err,university){
            if(err){
                return done(err);
            }
            return done(null,university);
        })
    }
};

module.exports = Object.freeze(UniversityRepository);