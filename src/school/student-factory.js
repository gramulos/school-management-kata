'use strict';

var assert = require('assert');
var _ = require('lodash');
var mongoose = require('mongoose');

var UuidProviderFactory = require('../infra/uuid-provider');

var Student = {
    init: function (args) {
        assert.ok(args.id, 'invalid id');
        assert.ok(args.grade, 'invalid grade');
        assert.ok(args.classNumber, 'invalid classNumber');
        assert.ok(args.userId, 'invalid userId');

        this.id = args.id;
        this.userId = args.userId;
        this.grade = args.grade;
        this.classNumber = args.classNumber;

        return this;
    }
};

var StudentSchema = new mongoose.Schema({
    id: {type: String, required: true},
    userId: {type: String, required: true},
    grade: {type: String, required: true},
    classNumber: {type: String, required: true}
});

var StudentModel = mongoose.model('StudentModel', StudentSchema);

var StudentFactory = {

    createFromForm: function (args) {
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();

        var studentData = _.assign({
            id: uuidProvider.v1(),
            userId: args.userId,
            grade: args.student.grade,
            classNumber: args.student.classNumber
        });

        var student = Object.create(Student);
        student.init(studentData);

        return student;
    },

    create: function (args) {
        var student = Object.create(Student);
        student.init(args);

        return student;
    },

    getModel: function () {
        return StudentModel;
    }
};

module.exports = StudentFactory;