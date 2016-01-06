'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');

var EmployeeSaverFactory = require('../../src/school/employee-saver');
var EmployeeFinderFactory = require('../../src/school/employee-finder');
var EmployeeFactory = require('../../src/school/employee-factory');
var Fixtures = require('../../test/fixtures');
var Roles = require('../../src/infra/role');

var EmployeeModel = EmployeeFactory.getModel();

describe('EmployeeSaver test', function () {

    var employeeBuilder = Fixtures.employee;

    describe('#save with VALID parameters', function () {

        var employee;

        before(function (beforeDone) {
            employee = employeeBuilder.anEmployee(Roles.DIRECTOR).build();

            var employeeSaver = EmployeeSaverFactory.create();
            employeeSaver.save(employee, function (err, savedEmployee) {
                assert.isNotNull(savedEmployee);
                beforeDone();
            });
        });

        after(function (afterDone) {
            EmployeeModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('should save employee to db', function (testDone) {
            var employeeFinder = EmployeeFinderFactory.create();
            employeeFinder.findById(employee.id, function (err, foundEmployee) {

                assert.isDefined(foundEmployee);
                assert.equal(foundEmployee.role, employee.role, 'employee role does not match');
                assert.equal(foundEmployee.salary, employee.salary, 'employee salary does not match');

                testDone();
            });
        });
    });

    describe('#save with INVALID parameters', function () {
        var employee;

        before(function (beforeDone) {
            employee = employeeBuilder.anEmployee(Roles.DIRECTOR).build();
            employee.salary = '';

            var employeeSaver = EmployeeSaverFactory.create();
            employeeSaver.save(employee, function (err, savedEmployee) {
                assert.isUndefined(savedEmployee);

                beforeDone();
            });
        });

        after(function (afterDone) {
            EmployeeModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('should save employee to db', function (testDone) {
            var employeeFinder = EmployeeFinderFactory.create();
            employeeFinder.findById(employee.id, function (err, foundEmployee) {
                assert.isNull(foundEmployee);
                testDone();
            });
        });
    });
});

