'use strict';

var UserFinder = {
    init: function (args) {

    },
    find: function (userName,done) {

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