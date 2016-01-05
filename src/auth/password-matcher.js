'use strict';
var HashProvider = require('../infra/hash-provider');
var assert = require('assert');

var PasswordMatcher = {
    init: function (args) {

    },
    match: function (args) {
        assert.ok(args.hashedPassword, 'hashedPassword require');
        assert.ok(args.password, 'password require');

        var hashedPassword = HashProvider.hash(args.password);

        if (args.hashedPassword === hashedPassword) {
            return true;
        }
        else {
            return false;
        }
    }
};

var PasswordMatcherFactory = {
    create: function (args) {
        var passwordMatcher = Object.create(PasswordMatcher);
        passwordMatcher.init(args);
        return passwordMatcher;
    }
};

module.exports = PasswordMatcherFactory;
