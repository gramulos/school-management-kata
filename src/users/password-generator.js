'use strict';

var PasswordGenerator = {

    init: function(args) {

    },

    generate: function (firstName, lastName, idNumber) {
        return firstName.charAt(0) + idNumber + lastName.charAt(0);
    }
};


var PasswordGeneratorFactory = {

    create: function (args) {
        var newPasswordGenerator = Object.create(PasswordGenerator);
        newPasswordGenerator.init(args);

        return newPasswordGenerator;
    }
};

module.exports = PasswordGeneratorFactory;