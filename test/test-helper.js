
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

after(function (done) {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.disconnect();
    return done();
});

