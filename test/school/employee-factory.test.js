'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var EmployeeFactory = require('../../src/school/employee-factory');
var UserFactory = require('../../src/users/user-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');

describe('EmployeeFactory test', function () {

    var AccountTestBuilder = Fixtures.account;

    describe('#create employee - with valid input', function () {

        var userForm, createdEmployee, account, createdUser;

        var accountBuilder = AccountTestBuilder.anAccount();

        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProviderFake = Fakes.getDateProviderFake();

        before(function () {
            account = accountBuilder.build();
            userForm = {
                firstName: 'hezret',
                lastName: 'abdelrahimov',
                patronymic: 'badulla',
                idNumber: '5s4s7er',
                email: 'hezret@yahoo.com',
                phone: '0518585529',
                imageUrl: 'hezret@images.com'
            };
            createdUser = UserFactory.createFromForm({
                form: userForm,
                account: account,

                uuidProvider: uuidProviderFake,
                dateProvider: dateProviderFake
            });

            createdEmployee = EmployeeFactory.createFromForm({
                userId: createdUser.id,
                employee: {
                    salary: '547'
                },
                uuidProvider: uuidProviderFake
            });
        });

        it('should create employee with user and salary', function () {
            var employee = EmployeeFactory.create({
                id: uuidProviderFake.getValue(),
                userId: uuidProviderFake.getValue(),
                salary: '547'
            });

            assert.deepEqual(createdEmployee, employee);
        });
    });
});

