'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var StudentCreatorFactory = require('../../src/school/student-factory');
var UserFactory = require('../../src/users/user-factory');
var Fixtures = require('../fixtures');
var Fakes = require('../fakes');

describe('StudentCreator test', function () {

    var AccountTestBuilder = Fixtures.account;

    describe('student created from user and student form', function () {

        var userForm, createdStudent, account, student;
        var createdUser;
        var accountBuilder = AccountTestBuilder.anAccount();

        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProviderFake = Fakes.getDateProviderFake();

        before(function() {

            account = accountBuilder.build();
            userForm = {
                firstName: 'rufet',
                lastName: 'isayev',
                patronymic: 'kamaleddin',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com'
            };
            createdUser = UserFactory.createFromForm({
                form: userForm,
                account: account,

                uuidProvider: uuidProviderFake,
                dateProvider: dateProviderFake
            });

            createdStudent = StudentCreatorFactory.createFromForm({
                userId: createdUser.id,
                student: {
                    grade: '10',
                    classNumber: '547'
                },
                uuidProvider: uuidProviderFake
            });
        });

        it('student should contain user, grade, classNumber', function () {
            var student = StudentCreatorFactory.create({
                id: uuidProviderFake.getValue(),
                userId: uuidProviderFake.getValue(),
                grade: '10',
                classNumber: '547'
            });

            assert.deepEqual(createdStudent, student);
        });
    });
});

