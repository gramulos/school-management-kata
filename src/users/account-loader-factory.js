'use strict';

var AccountLoader = {

    init: function(args) {

    },
    findByUsername: function(username, done) {
        //done(null, false);
    }
};


var AccountLoaderFactory = {

    create: function (args) {
        var newAccountLoader = Object.create(AccountLoader);
        newAccountLoader.init(args);

        return newAccountLoader;
    }
};

module.exports = AccountLoaderFactory;