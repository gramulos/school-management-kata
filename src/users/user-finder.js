'use strict';

var UserFactory = require('../users/user-factory');

var UserFinder = {
    init: function (args) {

    },
    find: function (username, done) {
        var Model = UserFactory.getModel();
        Model.findOne({'account.username': username}, function (err, foundUser) {
            if (err) {
                return done(err);
            }
            return done(null, foundUser);
        })
    },
    findById: function (userId, done) {
        var Model = UserFactory.getModel();
        Model.findOne({id: userId}, function (err, foundUser) {
            if (err) {
                return done(err);
            }
            return done(null, foundUser);
        })

    },
    findByIdNumber: function (idNumber, done) {

        var UserModel = UserFactory.getModel();
        UserModel.findOne({idNumber: idNumber}, function (err, foundUser) {
            if (err) {
                return done(err);
            }
            if (foundUser) {
                return done(null, UserFactory.create(foundUser));
            }
            else {
                return done(null, null);
            }
        })
    }
};

var UserFinderFactory = {
    create: function (args) {
        var userFinder = Object.create(UserFinder);
        userFinder.init(args);
        return userFinder;
    }
};

module.exports = UserFinderFactory;