'use strict';
var Role = require('../../src/infra/role');

var Authorizer = {
    init: function (args) {

    },

    authorize: function (account) {
        console.log('authorize',account)
        if(account.role === Role.ADMIN){
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