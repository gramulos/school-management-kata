'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var util = require('util');

var UserFormParamsValidator = require('../../src/users/user-form-params-validator');

var DEFAULT_IT_DESCRIPTION = 'should return [%s] for input [%s] when: %s';

describe('UserFormParamsValidator test', function () {

    describe('#validateName test', function () {

        describe('#validateName with correct firstName or lastName or patronymic', function () {

            it('should return true for valid firstName', function () {
                var validationResult = UserFormParamsValidator.validateName('rufet');
                assert.isTrue(validationResult);
            });

            it('should return true for valid lastname', function () {
                var validationResult = UserFormParamsValidator.validateName('isayev');
                assert.isTrue(validationResult);
            });

            it('should return true for valid patronymic', function () {
                var validationResult = UserFormParamsValidator.validateName('kamaleddin');
                assert.isTrue(validationResult);
            });

        });

        describe('#validateName with incorrect firstName or lastName or patronymic', function () {

            it('should return false for invalid firstName (when firstName contains digit)', function () {
                var validationResult = UserFormParamsValidator.validateName('rufet1');
                assert.isFalse(validationResult);
            });

            it('should return false for invalid lastname (when lastName contains symbols)', function () {
                var validationResult = UserFormParamsValidator.validateName('isay(*ev');
                assert.isFalse(validationResult);
            });

            it('should return false for invalid patronymic (when patronymic is not exist)', function () {
                var validationResult = UserFormParamsValidator.validateName('');
                assert.isFalse(validationResult);
            });

        });
    });

    describe('#validateIdNumber test', function () {

        describe('#validateIdNumber with correct idNumber', function () {

            it('should return true for valid idNumber', function () {
                var validationResult = UserFormParamsValidator.validateIdNumber('5jzbkrj');
                assert.isTrue(validationResult);
            });

        });

        describe('#validateIdNumber with incorrect idNumber', function () {

            it('should return false for invalid idNumber (when idNumber\'s length is more than 7)', function () {
                var validationResult = UserFormParamsValidator.validateIdNumber('5jzbkrju');
                assert.isFalse(validationResult);
            });

            it('should return false for invalid idNumber (when idNumber\'s length is less than 7)', function () {
                var validationResult = UserFormParamsValidator.validateIdNumber('5jzbju');
                assert.isFalse(validationResult);
            });

            it('should return false for invalid idNumber (when idNumber contains symbols)', function () {
                var validationResult = UserFormParamsValidator.validateIdNumber('5*$^&*5');
                assert.isFalse(validationResult);
            });

        });
    });

    describe('#validateEmail test', function () {
        describe('#validateEmail with correct email', function () {

            it('should return true for valid email', function () {
                var validationResult = UserFormParamsValidator.validateEmail('rufetisayev@yahoo.com');
                assert.isTrue(validationResult);
            });

        });

        describe('#validateEmail with incorrect email', function () {

            it('should return false for invalid email', function () {
                var validationResult = UserFormParamsValidator.validateEmail('rufet.com');
                assert.isFalse(validationResult);
            });

        });
    });

    describe('#validatePhoneNumber test', function () {
        describe('#validatePhoneNumber with correct phoneNumber', function () {

            it('should return true for valid phoneNumber', function () {
                var validationResult = UserFormParamsValidator.validatePhoneNumber('0518585529');
                assert.isTrue(validationResult);
            });

        });

        describe('#validatePhoneNumber with incorrect phoneNumber', function () {

            ux([
                { input: '05185855', expected: false, rule: '' },
                { input: '05185855295588', expected: false, rule: 'when phoneNumber is more than 10 digits' },
                { input: '051fdd85r6', expected: false, rule: 'when phoneNumber contains character or symbols' },

            ], undefined, function (input, expected) {
                var validationResult = UserFormParamsValidator.validatePhoneNumber(input);
                assert.deepEqual(validationResult, expected);
            });

            //it('should return false for invalid phoneNumber (when phoneNumber is more than 10 digits)', function () {
            //    var validationResult = UserFormParamsValidator.validatePhoneNumber('05185855295588');
            //    assert.isFalse(validationResult);
            //});
            //it('should return false for invalid phoneNumber (when phoneNumber contains character or symbols)', function () {
            //    var validationResult = UserFormParamsValidator.validatePhoneNumber('051fdd85r6');
            //    assert.isFalse(validationResult);
            //});



        });



    });


    // 'should return ' + expected + ' for input: ' + input + ' when: ' + rule
    // 'should return [%s] for input [%s] when: %s'
    function ux(arr, itDescriptionWithFormat, test) {

        var description = itDescriptionWithFormat || DEFAULT_IT_DESCRIPTION;

        arr.forEach(function (testData) {

            it (util.format(description, testData.expected, testData.input, testData.rule), function() {
               test(testData.input, testData.expected);
            });
        })
    }
});

