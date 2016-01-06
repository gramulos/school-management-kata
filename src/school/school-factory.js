'use strict';

var assert = require('assert');
var uuid = require('uuid');
var _ = require('lodash');
var mongoose = require('mongoose');
var UuidProviderFactory = require('../infra/uuid-provider');
var DateProviderFactory = require('../infra/date-provider');

var School = {
    init: function (args) {
        assert.ok(args.id, 'Invalid id');
        assert.ok(args.name, 'Invalid name');
        assert.ok(args.email, 'Invalid email');
        assert.ok(args.phone, 'Invalid phone');
        assert.ok(args.address, 'Invalid address');

        this.id = args.id;
        this.name = args.name;
        this.email = args.email;
        this.phone = args.phone;
        this.address = args.address;
        this.createdDate = args.createdDate;
    }
};

var schoolSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    createdDate: {type: Date, required: true}
});

var SchoolModel = mongoose.model('SchoolModel',schoolSchema);

var SchoolFactory = {
    createFromForm: function (args) {
        assert.ok(args.form, 'form is required');
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();
        var dateProvider = args.dateProvider || DateProviderFactory.create();
        var schoolData = _.assign({
            id: uuidProvider.v1(),
            createdDate: dateProvider.now()
        }, args.form);

        var school = Object.create(School);
        school.init(schoolData);
        return school;
    },
    create: function(args){
        var school = Object.create(School);
        school.init(args);
        return school;
    },
    getModel:function(){
        return SchoolModel;
    }
};

module.exports = SchoolFactory;