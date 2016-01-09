'use strict';
var TeacherFactory = require('../school/teacher-factory');
var TeacherSaver = {
    init: function () {

    },
    save: function (teacher,done) {
        var TeacherModel = TeacherFactory.getModel();

        var teacherData = new TeacherModel({
            id: teacher.id,
            subject: teacher.subject,
            isClassHead: teacher.isClassTeacher,
            employeeId: teacher.employeeId
        });

        teacherData.save(function (err, result) {
            if (err) {
                return done(err);
            } else {
                return done(null, result);
            }
        });
    }
};

var TeacherSaverFactory = {
    create: function () {
        var teacherSaver = Object.create(TeacherSaver);
        teacherSaver.init();
        return teacherSaver;
    }
};

module.exports = TeacherSaverFactory;