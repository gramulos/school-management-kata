'use strict';

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');

var EmployeeFactory = require('../school/employee-factory');


var EmployeeSaver = {

    init: function (args) {

    },

    save: function (employee, done) {
        var employeeModel = EmployeeFactory.getModel();

        var employeeData = new employeeModel({
            id: employee.id,
            userId: employee.userId,
            salary: employee.salary
        });

        employeeData.save(function (err, result) {
            if (err) {
                return done(err);
            } else {
                return done(null, result);
            }
        });
    }
};


var EmployeeSaverFactory = {

    create: function (args) {
        var newEmployeeSaver = Object.create(EmployeeSaver);
        newEmployeeSaver.init(args);

        return newEmployeeSaver;
    }
};

module.exports = EmployeeSaverFactory;