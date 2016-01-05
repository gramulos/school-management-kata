'use strict';
var HashProvider = require('../infra/hash-provider');
var ErrorCodes = require('../infra/error-codes');
var assert = require('assert');

var Account = {

    init: function(args) {
        assert.ok(args.username, ErrorCodes.USERNAME_NOT_EXIST);
        assert.ok(args.hashedPassword, ErrorCodes.PASSWORD_NOT_EXIST);
        assert.ok(args.role, ErrorCodes.ROLE_NOT_EXIST);

        this.username = args.username;
        this.role = args.role;
        this.hashedPassword = args.hashedPassword;
    }
};


var AccountFactory = {

    createFromForm: function (args) {
        args = args.form || args;
        assert.ok(args.password, ErrorCodes.PASSWORD_NOT_EXIST);
        args.hashedPassword = HashProvider.hash(args.password);
        var newAccount = Object.create(Account);
        newAccount.init(args);
        return newAccount;
    },

    create: function(args) {
        var newAccount = Object.create(Account);
        newAccount.init(args);
        return newAccount;
    }

};

module.exports = AccountFactory;