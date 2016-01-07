'use strict';

var EmployeeFactory = require('../school/employee-factory');

var EmployeeFinder = {
    init: function (args) {

    },

    findById: function (employeeId, done) {

        var Model = EmployeeFactory.getModel();
        Model.findOne({id: employeeId}, function (err, foundEmployee) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, foundEmployee);
            }
        });
    }
};

var EmployeeFinderFactory = {
    create: function (args) {
        var employeeFactory = Object.create(EmployeeFinder);
        employeeFactory.init(args);

        return employeeFactory;
    }
};

module.exports = EmployeeFinderFactory;