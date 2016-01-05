'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var AuthorizerFactory = require('../../src/auth/authorizer');
var Roles = require('../../src/infra/role');
var TokenValidatorFactory = require('../../src/auth/token-validator');


describe('Authorizer test', function () {

    var authorizer = AuthorizerFactory.create();

    describe('#authorize when role of user is STUDENT (while registering student)', function () {
        var isAuthorized;

        var account = {
            role: Roles.STUDENT
        };

        before(function () {
            var action = authorizer.convertRoleToAction(account.role);
            isAuthorized = authorizer.authorize(action, account);
        });

        it('should return false', function () {
            assert.isFalse(isAuthorized);
        });
    });

    describe('#authorize when role of user is ADMIN (while registering student)', function () {
        var isAuthorized;

        var account = {
            role: Roles.ADMIN
        };

        before(function () {
            var action = authorizer.convertRoleToAction(account.role);
            isAuthorized = authorizer.authorize(action, account);
        });

        it('should return true', function () {
            assert.isTrue(isAuthorized);
        });
    });
});

