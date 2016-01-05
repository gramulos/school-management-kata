'use strict';
var jwt = require('jsonwebtoken');
var Config = require('../infra/config');
var ErrorCodes = require('../infra/error-codes');

var TokenValidator = {
    init: function(args) {
    },

    validate: function (token, done) {
        if(token){
            jwt.verify(token, Config.secretKey, function(err,decoded){
                if(err){
                    return done(ErrorCodes.INVALID_TOKEN);
                }
                else{
                    //decoded.role = 1;
                    return done(null,decoded);
                }
            })
        }


    }
};

var TokenValidatorFactory = {
    create: function(args) {
        var validator = Object.create(TokenValidator);
        validator.init(args);
        return validator;
    }
};

module.exports = TokenValidatorFactory;