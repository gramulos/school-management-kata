'use strict';
var DateFormat = require('date-format');

var DateProvider = {
    init: function() {

    },

    now: function () {
        return new Date();
    }
};



var DateProviderFactory = {
    create: function() {
        var provider = Object.create(DateProvider);
        provider.init();

        return provider;
    }
};

module.exports = DateProviderFactory;
