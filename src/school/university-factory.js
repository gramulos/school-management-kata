'use strict';

var assert = require('assert');
var uuid = require('uuid');
var _ = require('lodash');
var mongoose = require('mongoose');
var UuidProviderFactory = require('../infra/uuid-provider');
var DateProviderFactory = require('../infra/date-provider');

var University = {
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

var universitySchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    createdDate: {type: Date, required: true}
});

var UniversityModel = mongoose.model('UniversityModel',universitySchema);

var UniversityFactory = {
    createFromForm: function (args) {
        assert.ok(args.form, 'form is required');
        var uuidProvider = args.uuidProvider || UuidProviderFactory.create();
        var dateProvider = args.dateProvider || DateProviderFactory.create();
        var universityData = _.assign({
            id: uuidProvider.v1(),
            createdDate: dateProvider.now()
        }, args.form);

        var university = Object.create(University);
        university.init(universityData);
        return university;
    },
    create: function(args){
        var university = Object.create(University);
        university.init(args);
        return university;
    },
    getModel:function(){
        return UniversityModel;
    }
};

module.exports = UniversityFactory;