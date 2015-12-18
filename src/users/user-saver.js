'use strict';

var UserSaver = {
    init:function(){

    },

    save: function(){

    }
};

var UserSaverFactory = {
    create: function(){
        var userSaver = Object.create(UserSaver);
        userSaver.init();
        return userSaver;
    }
};

module.exports = UserSaverFactory;
