'use strict';
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
//var assert = chai.assert;
var Role = require('../src/infra/role');
var uuid = require('uuid');

var Fixtures = require('./fixtures');
var assert = require('assert');
var UserTestBuilder = Fixtures.user;
var AccountTestBuilder = Fixtures.account;
var UserFactory = require('../src/users/user-factory');

describe('Create User test', function () {

    describe('creating user', function () {
        var createdUser;
        var userForm, account;
        var userFormBuilder = UserTestBuilder.aUserForm();
        var accountBuilder = AccountTestBuilder.anAccount();

        before(function () {
            userForm = userFormBuilder.build();
            account = accountBuilder.build();

            var userRegistrationForm = userForm;
            userRegistrationForm.account = account;

            createdUser = UserFactory.createFromForm(userRegistrationForm);
        });

        it('should return the created user equal to the given user', function () {
            var user = userForm;
            user.account = account;
            assert.deepEqual(createdUser, user);
        });
    });
});
