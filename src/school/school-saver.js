'use strict';
var SchoolFactory = require('./school-factory');

var SchoolSaver = {
    init: function () {

    },
    save: function (school, done) {
        var SchoolModel = SchoolFactory.getModel();
        var schoolData = new SchoolModel({
            id: school.id,
            name: school.name,
            email: school.email,
            phone: school.phone,
            address: school.address,
            createdDate: school.createdDate
        });
        schoolData.save(function (err, savedSchool) {
            if (err) {
                return done(err);
            } else {
                return done(null, savedSchool);
            }
        })
    }
};

var SchoolSaverFactory = {
    create: function () {
        var schoolSaver = Object.create(SchoolSaver);
        schoolSaver.init();
        return schoolSaver;
    }
};

module.exports = SchoolSaverFactory;