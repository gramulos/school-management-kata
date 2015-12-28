'use strict';
var sha256 = require('sha256');

var HashProvider = {
    hash: function (text) {
        return sha256(text);
    }
};


module.exports = HashProvider;