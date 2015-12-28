'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var PasswordMatcherFactory = require('../../src/auth/password-matcher');

describe('PasswordMatcher test', function () {

    describe('#match password and hashPassword', function () {

        it('should match', function () {
            var passwordMatcher = PasswordMatcherFactory.create();
            var isMatch = passwordMatcher.match({hashedPassword: '157abfccf45aaa7fe19e241e32047e135e3d6c09f6928013266e52416ce522f8', password: '12323'});
            assert.isTrue(isMatch);
        });
    });

    describe('#match password and hashPassword', function () {

        it('should not match', function () {
            var passwordMatcher = PasswordMatcherFactory.create();
            var isMatch = passwordMatcher.match({hashedPassword: '15e3d6c09f6928013266e52416ce522f8', password: '12323'});
            assert.isFalse(isMatch);
        });
    });

    describe('#match password and hashPassword with empty arguments', function () {

        it('should throw exception', function () {
            var passwordMatcher = PasswordMatcherFactory.create();
            assert.throw(function () {
                passwordMatcher.match({password: '12323'});
            });
        });
    });
});

