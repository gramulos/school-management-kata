'use strict';
var HashProvider = require('../infra/hash-provider');
var ErrorCodes = require('../infra/error-codes');
var assert = require('assert');

var Account = {

    init: function(args) {
        assert.ok(args.username, ErrorCodes.USERNAME_NOT_EXIST);
        assert.ok(args.password, ErrorCodes.PASSWORD_NOT_EXIST);
        assert.ok(args.role, ErrorCodes.ROLE_NOT_EXIST);
        this.username = args.username;
        this.role = args.role;
        this.hashedPassword = HashProvider.hash(args.password);

    }
};


var AccountFactory = {

    create: function (args) {
        var newAccount = Object.create(Account);
        newAccount.init(args);


        return newAccount;
    }
};

module.exports = AccountFactory;