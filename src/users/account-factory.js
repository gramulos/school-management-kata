'use strict';

var Account = {

    init: function(args) {

    }
};


var AccountFactory = {

    create: function (args) {
        var newAccount = Object.create(Account);
        newAccount.init(args);

        return newAccount;
    }
};

module.exports = AccountFactory;