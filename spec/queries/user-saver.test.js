'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
//var mongoose = require('mongoose');



var UserFactory = require('../../src/users/user-factory');
var UserSaverFactory = require('../../src/users/user-saver');
var Fixtures = require('../../test/fixtures');

var UserModel = UserFactory.getModel();

describe.only('UserSaver test', function () {
    //var database = mongoose.connection;
    var userBuilder = Fixtures.user;

    //before(function (beforeDone) {
    //    this.timeout(5000);
    //
    //    database.on('error', console.error);
    //    database.once('open', function () {
    //        console.log('mongodb connection open!');
    //        beforeDone();
    //    });
    //    mongoose.connect('mongodb://gramulos:test123456@ds043714.mongolab.com:43714/schoolmanagement');
    //});

    describe('#save user into db', function () {
        var user;

        before(function (beforeDone) {
            user = userBuilder.aUserForm().build();

            var userSaver = UserSaverFactory.create();
            userSaver.save(user, function (err, savedUser) {
                assert.isNotNull(savedUser);
                beforeDone()
            });

        });

        after(function (afterDone) {
            UserModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('should find the saved user from db', function (testDone) {

            UserModel.findOne({id: user.id}, function (err, foundUser) {
                assert.isNotNull(foundUser);
                testDone();
            });
        });



    });


    //after(function () {
    //    mongoose.models = {};
    //    mongoose.modelSchemas = {};
    //    mongoose.connection.close(function () {
    //        console.log('Connection closed')
    //    });
    //});
});

