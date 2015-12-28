'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var Fixtures = require('../fixtures');
var UserFinderFactory = require('../../src/users/user-finder');
var TokenGeneratorFactory = require('../../src/auth/token-generator');
var UserFactory = require('../../src/users/user-factory');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var Role = require('../../src/infra/role');

describe('TokenGenerator test', function () {

    describe('#generate token given userId and role as input', function () {
        var tokenGenerator;
        var userFinder;
        var userForm;
        var account;
        var user;

        var tokenValidator;


        var UserBuilder = Fixtures.user;
        var AccountBuilder = Fixtures.account;
        before(function () {
            tokenGenerator = TokenGeneratorFactory.create();
            userFinder = UserFinderFactory.create();

            account = AccountBuilder.anAccount().build();
            user = UserBuilder.aUserForm().build(account);
            user.account.role = Role.ADMIN;
            userFinder.find = function(err,user){
                return user;
            }
        });

        it('decoded token should be equal to the given userId and role', function () {

            var actualToken = tokenGenerator.generate(user.id, user.account.role);
            tokenValidator = TokenValidatorFactory.create();
            tokenValidator.validate(actualToken, function (err, decodedUser) {
                assert.equal(decodedUser.id, user.id );
                assert.equal(decodedUser.role, user.account.role);
            });

        });
    });


});

