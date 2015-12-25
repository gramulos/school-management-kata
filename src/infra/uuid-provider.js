'use strict';

var uuid = require('uuid');

var UuidProvider = {
    init: function() {

    },

    v1: function () {
        return uuid.v1();
    }
};



var UuidProviderFactory = {
    create: function() {
        var provider = Object.create(UuidProvider);
        provider.init();

        return provider;
    }
};

module.exports = UuidProviderFactory;