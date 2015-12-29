'use strict';

var assert = require('assert');
var _ = require('lodash');
var mongoose = require('mongoose');

var UuidProviderFactory = require('../infra/uuid-provider');

var Employee = {
    init: function(args) {
        assert.ok(args.id, 'invalid id');
        assert.ok(args.salary, 'invalid salary');
        assert.ok(args.userId, 'invalid user id');

        this.id = args.id;
        this.userId = args.userId;
        this.salary = args.salary;

        return this;
    }
};

var EmployeeSchema = new mongoose.Schema({
    id: {type: String, required: true},
    userId: {type: String, required: true},
    salary: {type: String, required: true}
});

var EmployeeModel = mongoose.model('EmployeeModel', EmployeeSchema);

var EmployeeFactory = {

    create: function (args) {
        var newEmployee = Object.create(Employee);
        newEmployee.init(args);

        return newEmployee;
    },

    createFromForm: function(args) {
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();

        var employeeData = _.assign({
            id: uuidProvider.v1(),
            userId: args.userId,
            salary: args.employee.salary
        });

        var newEmployee = Object.create(Employee);
        newEmployee.init(employeeData);

        return newEmployee;
    },

    getModel: function () {
        return EmployeeModel;
    }
};

module.exports = EmployeeFactory;