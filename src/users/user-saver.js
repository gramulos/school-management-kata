'use strict';
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var UserFactory = require('../users/user-factory');
var assert = require('assert');

var UserSaver = {
    init: function (args) {


    },

    save: function (user, done) {

        var Model = UserFactory.getModel();

        var userData = new Model({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            idNumber:user.idNumber,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
            account: user.account,
            createdDate: user.createdDate
        });


        userData.save(function (err, result) {
            if (err) {
                return done(err);
            } else {
                return done(null, result);
            }
        });


    }
};

var UserSaverFactory = {
    create: function (args) {
        var userSaver = Object.create(UserSaver);
        userSaver.init(args);
        return userSaver;
    }
};

module.exports = UserSaverFactory;
