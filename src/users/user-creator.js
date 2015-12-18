'use strict';

var User = {
    init: function(){

    }
};

var UserCreator = {
    create:function(){
        var user = Object.create(User);
        user.init();
        return user;
    }
};

module.exports = UserCreator;
