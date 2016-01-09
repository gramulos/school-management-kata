'use strict';
var UuidProviderFactory = require('../infra/uuid-provider');
var _ = require('lodash');
var assert = require('assert');
var mongoose = require('mongoose');
var Teacher = {
    init:function(args){
        assert.ok(args.id, 'invalid id');
        assert.ok(args.subject, 'invalid subject');
        assert.ok(args.isClassTeacher, 'invalid classHead');
        //assert.ok(args.employeeId, 'invalid employeeId');

        this.id = args.id;
        this.subject = args.subject;
        this.isClassTeacher = args.isClassTeacher;
        this.employeeId = args.employeeId;

        return this;
    }
};

var TeacherSchema = new mongoose.Schema({
   id:{type:String,required:true},
   subject:{type:String, require:true},
   isClassHead:{type:Boolean, required:true},
   employeeId:{type:String, required:true}
});
var TeacherModel = mongoose.model('TeacherModel',TeacherSchema);

var TeacherFactory = {
    create:function(args){
        var teacher = Object.create(Teacher);
        teacher.init(args);
        return teacher;
    },
    createFromForm:function(teacherForm){
        var uuidProvider = teacherForm.uuidProvider || UuidProviderFactory.create();

        var teacherData = _.assign({
            id: uuidProvider.v1(),
            employeeId: teacherForm.employeeId,
            subject: teacherForm.teacher.subject,
            isClassTeacher: teacherForm.teacher.isClassTeacher
        });

        var teacher = Object.create(Teacher);
        teacher.init(teacherData);
        return teacher;

    },
    getModel:function(){
        return TeacherModel;
    }
};

module.exports = TeacherFactory;
