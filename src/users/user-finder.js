'use strict';

var UserFinder = {
    init: function () {

    },
    find: function (userName,done) {
    }
};

var UserFinderFactory = {
    create: function () {
        var userFinder = Object.create(UserFinder);
        userFinder.init();
        return userFinder;
    }
};

module.exports = UserFinderFactory;