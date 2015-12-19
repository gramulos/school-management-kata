'use strict';

var UsernameGenerator = {

    init: function(args) {

    },
    
    generate: function (firstName, lastName, idNumber) {
        return firstName + lastName + idNumber.charAt(0) + idNumber.charAt(1);
    }
};


var UsernameGeneratorFactory = {

    create: function (args) {
        var newUsernameGenerator = Object.create(UsernameGenerator);
        newUsernameGenerator.init(args);

        return newUsernameGenerator;
    }
};

module.exports = UsernameGeneratorFactory;