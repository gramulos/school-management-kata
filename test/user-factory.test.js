'use strict';
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var sinon = require('sinon');
//var assert = chai.assert;
var Role = require('../src/infra/role');
var uuid = require('uuid');

var Fakes = require('./fakes');
var Fixtures = require('./fixtures');
var assert = require('assert');
var UserTestBuilder = Fixtures.user;
var AccountTestBuilder = Fixtures.account;
var UserFactory = require('../src/users/user-factory');


var UuidProviderFactory = require('../src/infra/uuid-provider');
var DateProviderFactory = require('../src/infra/date-provider');

describe('Create User test', function () {

    describe('creating user from account and user-form', function () {
        var createdUser;
        var userForm, account;
        var accountBuilder = AccountTestBuilder.anAccount();

        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProviderFake = Fakes.getDateProviderFake();

        before(function () {

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
        });

        it('new user should contain account, firstName, lastName, patronymic, imageUrl, email, phone', function () {
            var user = UserFactory.create({
                id: uuidProviderFake.getValue(),
                createdDate: dateProviderFake.getValue(),
                firstName: 'rufet',
                lastName: 'isayev',
                patronymic: 'kamaleddin',
                idNumber: '5ZJBKRJ',
                email: 'rufetisayev@yahoo.com',
                phone: '0518585529',
                imageUrl: 'rufet@images.com',
                account: account
            });

            assert.deepEqual(createdUser, user);
        });
    });
});
