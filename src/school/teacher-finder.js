'use strict';

var TeacherFactory = require('./teacher-factory');

var TeacherFinder = {
    init:function(){

    },
    findTeacherByEmployeeId: function(employeeID,done){
        var Model = TeacherFactory.getModel();
        Model.findOne({employeeId: employeeID}, function(err, foundTeacher){
            if(err){
                return done(err);
            }
            return done(null,foundTeacher);
        });
    },

     findTeacherById: function(teacherID,done){
        var Model = TeacherFactory.getModel();
        Model.findOne({id: teacherID}, function(err, foundTeacher){
            if(err){
                return done(err);
            }
            return done(null,foundTeacher);
        });
    }
};

var TeacherFinderFactory = {
  create:function(){
      var teacherFinder = Object.create(TeacherFinder);
      teacherFinder.init();
      return teacherFinder;
  }

};

module.exports = TeacherFinderFactory;