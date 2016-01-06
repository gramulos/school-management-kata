'use strict';

var uuidProvider = require('../infra/uuid-provider');
var dateProvider = require('../infra/date-provider');
var _ = require('lodash');
var mongoose = require('mongoose');
var Classroom = {
    init: function (args) {
        args = args || {};

        this.id = args.id;
        this.number = args.number;
        this.description = args.description;
        this.createdDate = args.createdDate;
    }
};

var classroomSchema = new mongoose.Schema({
    id:{type:String, required:true},
    number:{type:String, required:true},
    description:{type:String, required:false}

});

var classroomModel = mongoose.model('classroomModel',classroomSchema);

var ClassroomFactory = {
    create: function (args) {
        var classRoom = Object.create(Classroom);
        classRoom.init(args);
        return classRoom;
    },
    createFromForm: function (args) {
        args = args || {};
        var uuid = args.uuidProvider || uuidProvider.create();
        var date = args.dateProvider || dateProvider.create();

        var classroomData = _.assign({
            id: uuid.v1(),
            createdDate: date.now()
        }, args.form);

        var classRoom = Object.create(Classroom);
        classRoom.init(classroomData);
        return classRoom;
    },

    getModel: function(){
        return classroomModel;
    }
};

module.exports = ClassroomFactory;