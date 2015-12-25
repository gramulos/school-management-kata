'use strict';
var sha256 = require('sha256');

var HashProvider = {
    hash: function (args) {
        return sha256(args);
    }
};


module.exports = HashProvider;