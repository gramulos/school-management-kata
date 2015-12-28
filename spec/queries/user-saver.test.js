'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

require('../test-helper');

var UserFinderFactory = require('../../src/users/user-finder');
var UserSaverFactory = require('../../src/users/user-saver');
var UserFactory = require('../../src/users/user-factory');
var Fixtures = require('../../test/fixtures');

var UserModel = UserFactory.getModel();

describe('UserSaver test', function () {

    var userBuilder = Fixtures.user;

    describe('#save user into db ', function () {
        var user;

        before(function (beforeDone) {
            user = userBuilder.aUserForm().build();

            var userSaver = UserSaverFactory.create();
            userSaver.save(user, function (err, savedUser) {
                assert.isNotNull(savedUser);

                beforeDone();
            });

        });

        after(function (afterDone) {
            UserModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('user should be saved to db', function (testDone) {
            var userFinder = UserFinderFactory.create();
            userFinder.findById(user.id, function (err, foundUser) {
                assert.isDefined(foundUser);
                assert.equal(foundUser.id, user.id, 'user id\'s doesn\'t match');
                assert.equal(foundUser.name, user.name, 'user names\'s doesn\'t match');
                testDone();
            });
        });

    });

    describe('#save invalid user', function () {
        var user;

        before(function (beforeDone) {
            user = userBuilder.aUserForm().build();
            user.phone = '';

            var userSaver = UserSaverFactory.create();
            userSaver.save(user, function (err, savedUser) {
                assert.isUndefined(savedUser);

                beforeDone();
            });
        });

        after(function (afterDone) {
            UserModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('user should not be saved', function (testDone) {
            var userFinder = UserFinderFactory.create();
            userFinder.findById(user.id, function (err, foundUser) {

                assert.isNull(foundUser);
                testDone();
            });
        });
    });

});

