'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var UuidProviderFactory = require('../infra/uuid-provider');
var _ = require('lodash');

var Grade = {
    init: function(args) {
        assert.ok(args.id, 'invalid id');
        assert.ok(args.number, 'invalid number');

        this.id = args.id;
        this.number = args.number;

        return this;
    }
};

var GradeSchema = new mongoose.Schema({
    id: {type: String, required: true},
    number: {type: String, required: true},
    plan: {type: Object, required: false},
    groups: {type: Object, required: false}
});

var GradeModel = mongoose.model('GradeModel', GradeSchema);


var GradeFactory = {

    create: function (args) {
        var newGrade = Object.create(Grade);
        newGrade.init(args);

        return newGrade;
    },

    createFromForm: function (args){
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();

        var gradeData = _.assign({
            id: uuidProvider.v1(),
            number: args.gradeForm.number
        });

        var newGrade = Object.create(Grade);
        newGrade.init(gradeData);
        return newGrade;
    },

    getModel: function () {
        return GradeModel;
    }
};

module.exports = GradeFactory;