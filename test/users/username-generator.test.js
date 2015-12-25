'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var UsernameGeneratorFactory = require('../../src/users/username-generator');

describe('Username Generator test', function () {

    describe('#generate', function () {


        it('username should be the name, surname and the first 2 chars of pin code', function () {
            var usernameGenerator = UsernameGeneratorFactory.create();

            var firstName = 'rufet';
            var lastName = 'isayev';
            var idNumber = '5JZBKRJ';

            var username = usernameGenerator.generate(firstName, lastName, idNumber);
            assert.equal(username, 'rufetisayev5J');
        });
    });
});


