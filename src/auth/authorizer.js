'use strict';

var Authorizer = {
    init: function(args) {

    },

    authorize: function (role, account, done) {

        done(null, true);
    }
};

var AuthorizerFactory = {
    create: function() {
        var authorizer = Object.create(Authorizer);
        authorizer.init();
        return authorizer;
    }
};

module.exports = AuthorizerFactory;