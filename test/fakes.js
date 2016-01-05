'use strict';

var sinon = require('sinon');

var UuidProviderFactory = require('../src/infra/uuid-provider');
var DateProviderFactory = require('../src/infra/date-provider');

var TestConstants = {
    DATE: new Date(2013, 12, 23),
    UUID: '23e6deb0-adef-11e5-a505-5b031556a450'
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
