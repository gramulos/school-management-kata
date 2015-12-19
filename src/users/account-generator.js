'use strict';

var AccountGenerator = {
    init: function (args) {

    },

    generate: function (form) {
    }

};

var AccountGeneratorFactory = {
    create: function (args) {
        var accountGenerator = Object.create(AccountGenerator);
        accountGenerator.init(args);
        return accountGenerator;
    }
};

module.exports = AccountGeneratorFactory;