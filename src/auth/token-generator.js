'use strict';

var jwt = require('jsonwebtoken');

var assert = require('assert');


var Config = require('../infra/config');


var TokenGenerator = {
    init: function (args) {

    },
    generate: function (userId, role) {

        assert.ok(userId, 'user id is not provided');
        assert.ok(role, 'role is not provided');

        var user = {
            userId: userId,
            role: role
        };

        var token = jwt.sign(user, Config.secretKey, {
            //expiresIn: 1440
        });
        return token;
    },
    verifyToken: function (token) {

    }
};

var TokenGeneratorFactory = {
    create: function (args) {
        var tokenGenerator = Object.create(TokenGenerator);
        tokenGenerator.init(args);
        return tokenGenerator;
    }
};

module.exports = TokenGeneratorFactory;
