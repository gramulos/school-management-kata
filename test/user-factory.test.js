'use strict';
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var Role = require('../src/infra/role');
var uuid = require('uuid');

var Fixtures = require('./fixtures');

var UserFactory = require('../src/users/user-factory');

describe('Create User test', function () {

    describe('creating user', function () {
        var createdUser;
        var userForm;
        var userFormBuilder = Fixtures.account.anAccount();

        var id = uuid.v1();

        before(function () {
            userForm = userFormBuilder.build();

            //userForm = {
            //id: uuid.v1(),
            //firstName: 'rufet',
            //lastName: 'isayev',
            //patronymic: 'kamaleddin',
            //idNumber: '5ZJBKRJ',
            //email: 'rufetisayev@yahoo.com',
            //phone: '0518585529',
            //imageUrl: 'rufet@images.com',
            //    //account: {
            //        userId: this.id,
            //        username: 'rufetisayev5Z',
            //        password: 'r5ZJBKRJi',
            //        role: Role.STUDENT
            //
            //};
            createdUser = UserFactory.create(userForm)
        });

        it('should return the created user equal to the given user', function () {
            assert.shallowDeepEqual(createdUser,userForm);
        });
    });
});
