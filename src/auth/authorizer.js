'use strict';

var Authorizer = {
    init: function (args) {

    },

    authorize: function (role, account) {
        if(role === account.role){
            return true;
        } else {
            return false;
        }
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