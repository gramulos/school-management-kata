'use strict';

var REGEX_CHARACTER = /\d|\W/g;
var TeacherFormValidator = {
    init:function(){

    },
    validate:function(teacherForm){

        return this.validateSubject(teacherForm.subject) && this.validateIsClassTeacher(teacherForm.isClassTeacher) ? true : false;
    },

    validateSubject:function(subject){
        if(subject.match(REGEX_CHARACTER) || subject.length === 0){
            return false;
        }
        else{
            return true;
        }
    },
    validateIsClassTeacher:function(isClassTeacher){
        if(typeof(isClassTeacher) === 'boolean'){

            return true;
        }
        else{

            return false;
        }
    }
};

var TeacherFormValidatorFactory = {
    create:function(){
        var teacherFormValidator = Object.create(TeacherFormValidator);
        teacherFormValidator.init();
        return teacherFormValidator;
    }
};
module.exports = TeacherFormValidatorFactory;