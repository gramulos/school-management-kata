'use strict';

var assert = require('assert');
var uuid = require('uuid');
var _ = require('lodash');



var User = {
    init: function (args) {
        //this.user = {};
        assert.ok(
            args.id
            && args.firstName && args.lastName && args.patronymic && args.idNumber
            && args.email && args.phone
            && args.imageUrl
            && args.createdDate
            && args.account,

            'invalid input'
        );

        this.id = args.id;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.patronymic = args.patronymic;
        this.idNumber = args.idNumber;
        this.email = args.email;
        this.phone = args.phone;
        this.imageUrl = args.imageUrl;
        this.createdDate = args.createdDate;
        this.account = args.account;
    }
};

var UserFactory = {

    createFromForm: function (args) {
        args.id = uuid.v1();
        args.createdDate = new Date();

        var user = Object.create(User);
        user.init(args);
        return user;
    },

    createMomo: function(args) {
        var user = Object.create(User);
        user.init(args);
        return user;
    }
};

module.exports = UserFactory;
