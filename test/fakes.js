'use strict';

var sinon = require('sinon');

var UuidProviderFactory = require('../src/infra/uuid-provider');
var DateProviderFactory = require('../src/infra/date-provider');

var TestConstants = {
    DATE: new Date(2013, 12, 23),
    UUID: '9986afa0-aa4e-11e5-862c-c95bbb54ea5b'
};


var Fakes = {

    getUuidProviderFake: function () {
        var uuidProviderFake = UuidProviderFactory.create();
        sinon.stub(uuidProviderFake, 'v1', function () {
            return TestConstants.UUID;
        });

        uuidProviderFake.getValue = function() {
            return TestConstants.UUID;
        };

        return uuidProviderFake;
    },


    getDateProviderFake: function () {
        var dateProviderFake = DateProviderFactory.create();
        sinon.stub(dateProviderFake, 'now', function () {
            return TestConstants.DATE;
        });

        dateProviderFake.getValue = function() {
            return TestConstants.DATE;
        };

        return dateProviderFake;
    },


};



module.exports = Fakes;
