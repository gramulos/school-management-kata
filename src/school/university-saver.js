'use strict';
var UniversityFactory = require('./university-factory');

var UniversitySaver = {
    init: function () {

    },
    save: function (university, done) {
        var UniversityModel = UniversityFactory.getModel();
        var universityData = new UniversityModel({
            id: university.id,
            name: university.name,
            email: university.email,
            phone: university.phone,
            address: university.address,
            createdDate: university.createdDate
        });
        universityData.save(function (err, savedUniversity) {
            if (err) {
                return done(err);
            } else {
                return done(null, savedUniversity);
            }
        })
    }
};

var UniversitySaverFactory = {
    create: function () {
        var universitySaver = Object.create(UniversitySaver);
        universitySaver.init();
        return universitySaver;
    }
};

module.exports = UniversitySaverFactory;