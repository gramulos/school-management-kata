'use strict';

var TokenGenerator = {
    init: function () {

    },
    generate: function (userId,role,done) {

    },
    verifyToken:function(token){

    }
};

var TokenGeneratorFactory = {
    create:function(){
        var tokenGenerator = Object.create(TokenGenerator);
        tokenGenerator.init();
        return tokenGenerator;
    }
};

module.exports = TokenGeneratorFactory;
