'use strict';

var UserRegistrar = {
    init: function(){

    },

    register: function(userRegistrationForm, done){
        done();
    }


};

var UserRegistrarFactory = {
    create: function(){
        var userRegistrar = Object.create(UserRegistrar);
        userRegistrar.init();
        return userRegistrar;
    }
};

module.exports = UserRegistrarFactory;