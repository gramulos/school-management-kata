'use strict';

var User = {
    init: function(args){

    }
};

var UserCreator = {
    create:function(args){
        var user = Object.create(User);
        user.init(args);
        return user;
    }
};

module.exports = UserCreator;
