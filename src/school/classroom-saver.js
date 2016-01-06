'use strict';
var ClassroomFactory = require('./classroom-factory');

var ClassroomSaver = {
    init:function(){

    },

    save:function(classroom,done){
        var ClassroomModel = ClassroomFactory.getModel();
        var classroomData = new ClassroomModel({
            id:classroom.id,
            number:classroom.number,
            description:classroom.description
        });
        classroomData.save(function(err,savedClassroom){
            if(err){
                done(err);
            }
            else{
                done(null,savedClassroom);
            }
        })
    }
};

var ClassroomSaverFactory = {
    create:function(){
        var classroomSaver = Object.create(ClassroomSaver);
        classroomSaver.init();
        return classroomSaver;
    }
};

module.exports = ClassroomSaverFactory;