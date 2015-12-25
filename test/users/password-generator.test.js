'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var PasswordGeneratorFactory = require('../../src/users/password-generator');

describe('Username Generator test', function () {

    describe('#generate', function () {

        it('password should be the first letter of name, pin code and the first letter of surname', function () {
            var passwordGenerator = PasswordGeneratorFactory.create();

            var firstName = 'rufet';
            var lastName = 'isayev';
            var idNumber = '5JZBKRJ';

            var password = passwordGenerator.generate(firstName, lastName, idNumber);
            assert.equal(password, 'r5JZBKRJi');
        });
    });
});


