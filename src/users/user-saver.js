'use strict';

var UserSaver = {
    init:function(args){

    },

    save: function(user,done){
        done(null, user);
    }
};

var UserSaverFactory = {
    create: function(args){
        var userSaver = Object.create(UserSaver);
        userSaver.init(args);
        return userSaver;
    }
};

module.exports = UserSaverFactory;
