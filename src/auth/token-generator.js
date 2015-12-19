'use strict';

var TokenGenerator = {
    init: function (args) {

    },
    generate: function (userId,role,done) {

    },
    verifyToken:function(token){

    }
};

var TokenGeneratorFactory = {
    create:function(args){
        var tokenGenerator = Object.create(TokenGenerator);
        tokenGenerator.init(args);
        return tokenGenerator;
    }
};

module.exports = TokenGeneratorFactory;
