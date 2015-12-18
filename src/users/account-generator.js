'use strict';

var AccountGenerator = {
    init: function () {

    },

    generate: function () {

    }

};

var AccountGeneratorFactory = {
    create: function () {
        var accountGenerator = Object.create(AccountGenerator);
        accountGenerator.init();
        return accountGenerator;
    }
};

module.exports = AccountGeneratorFactory;