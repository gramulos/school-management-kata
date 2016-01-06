'use strict';

var chai = require('chai');
var assert= chai.assert;

require('../test-helper');

var UserFactory = require('../../src/users/user-factory');
var UserSaverFactory = require('../../src/users/user-saver');
var Fixtures = require('../../test/fixtures');
var UserModel = UserFactory.getModel();
var ErrorCodes = require('../../src/infra/error-codes');

var AccountLoaderFactory = require('../../src/users/account-loader-factory');

describe('testing the account finder',function(){
    var userBuilder = Fixtures.user;
    var accountBuilder = Fixtures.account;
    describe('#findByUsername',function(){
        var account;
        var accountLoader;
        var user;

        before(function(beforeDone){
            account = accountBuilder.anAccount().build();
            accountLoader = AccountLoaderFactory.create();

            user = userBuilder.aUserForm().build();
            var userSaver = UserSaverFactory.create();
            userSaver.save(user, function (err, savedUser){
                beforeDone();
            });
        });

        after(function (afterDone) {
            UserModel.remove({}, function (err) {
                afterDone();
            });
        });

        it('should find account from db', function(testDone){
            accountLoader.findByUsername(account.username, function(err, user){
                assert.isDefined(user.account);
                testDone();
            })
        })

    });

    describe('#findByUsername with username that not exist',function(){

        var account;
        var accountLoader;
        var user;

        before(function(){
            account = accountBuilder.anAccount().build();
            accountLoader = AccountLoaderFactory.create();

        });

        it('should return null as a result', function(testDone){
            accountLoader.findByUsername(account.username, function(err,account){
                assert.equal(err, ErrorCodes.USERNAME_NOT_EXIST);

                testDone();
            })
        });
    });
});