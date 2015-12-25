'use strict';

var assert = require('assert');
var uuid = require('uuid');
var _ = require('lodash');

var UuidProviderFactory = require('../infra/uuid-provider');
var DateProviderFactory = require('../infra/date-provider');

var User = {
    init: function (args) {
        //this.user = {};
        assert.ok(args.id , 'invalid id');
        assert.ok(args.firstName, 'invalid firstname');
        assert.ok(args.lastName, 'invalid lastname');
        assert.ok(args.patronymic, 'invalid patronymic');
        assert.ok(args.idNumber, 'invalid idNumber');
        assert.ok(args.email, 'invalid email');
        assert.ok(args.phone,'invalid phone');
        assert.ok(args.imageUrl, 'invalid imageUrl');
        assert.ok(args.createdDate, 'invalid createdDate');
        assert.ok(args.account, 'invalid account');


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
        assert.ok(args.form, 'form is required');
        assert.ok(args.account, 'account is required');
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();
        var dateProvider = args.dateProvider || DateProviderFactory.create();

        var userData = _.assign({

            id: uuidProvider.v1(),
            account: args.account,
            createdDate: dateProvider.now()

        }, args.form);

        var user = Object.create(User);
        user.init(userData);

        return user;
    },

    create: function(args) {
        var user = Object.create(User);
        user.init(args);
        return user;
    }
};

module.exports = UserFactory;
