'use strict';

var Authorizer = {
    init: function (args) {

    },

    authorize: function (role, account, done) {

        done(null, true);
    }
};

var AuthorizerFactory = {
    create: function (args) {
        var authorizer = Object.create(Authorizer);
        authorizer.init(args);
        return authorizer;
    }
};

module.exports = AuthorizerFactory;