'use strict';
var ClassroomFactory = require('../school/classroom-factory');

var ClassroomFinder = {
    init:function(){

    },
    findClassroomByNumber:function(number,done){
        var classroomModel = ClassroomFactory.getModel();
        classroomModel.findOne({number:number},function(err,classroom){
            if(err){
                return done(err);
            }
            else{
                return done(null,classroom);
            }
        })
    }
};

var ClassroomFinderFactory = {
    create:function(){
        var classroomFinder = Object.create(ClassroomFinder);
        classroomFinder.init();
        return classroomFinder;
    }
};
module.exports = ClassroomFinderFactory;