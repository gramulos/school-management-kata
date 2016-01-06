'use strict';

var ClassroomFactory = require('./classroom-factory');

var ClassroomRepository = {
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

module.exports = ClassroomRepository;