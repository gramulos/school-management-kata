
var mongoose = require('mongoose');

//var database = mongoose.connection;
//
//
//module.exports = function() {
//
//    before(function (beforeDone) {
//        //if (mongoose.connection.db) return beforeDone();
//
//        console.log('##### CONNECT TO DB BEFORE ALL TESTS #####');
//        this.timeout(5000);
//
//        database.on('error', console.error);
//        database.once('open', function () {
//            console.log('mongodb connection open!');
//            beforeDone();
//        });
//        mongoose.connect('mongodb://gramulos:test123456@ds043714.mongolab.com:43714/schoolmanagement');
//    });
//
//    after(function (afterDone) {
//        console.log('##### CLEAN DB AFTER ALL TESTS #####');
//        mongoose.models = {};
//        mongoose.modelSchemas = {};
//        mongoose.connection.close(afterDone);
//    });
//
//};

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';


before(function (done) {

    console.log('##### CONNECT TO DB BEFORE ALL TESTS #####');

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }


    if (mongoose.connection.readyState === 0) {
        //mongoose.connect('mongodb://gramulos:test123456@ds043714.mongolab.com:43714/schoolmanagement', function (err) {
        mongoose.connect('mongodb://localhost:27017/schoolmanagement', function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


after(function (done) {
    console.log('##### CLEAN DB AFTER ALL TESTS #####');

    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.disconnect();
    return done();
});

