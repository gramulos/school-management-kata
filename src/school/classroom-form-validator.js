'use strict';

var REGEX_DIGIT = /\d/g;
var REGEX_SYMBOL = /\W+/g;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_NOT_DIGIT = /\D/g;
var ErrorCodes = require('../infra/error-codes');
var ClassroomFinderFactory = require('../school/classroom-finder');
var async = require('async');

var ClassroomFormValidator = {
    init: function (args) {
        args = args || {};
        this.classroomFinder = args.classroomFinder || ClassroomFinderFactory.create();
    },
    validate: function (classRoomForm, done) {
        var self = this;
        async.parallel([

            function validateNumber(next) {
                var isValidNumber = self.validateNumber(classRoomForm.number);
                if (!isValidNumber) {
                    return next(null, ErrorCodes.CLASSROOM_NUMBER_IS_NOT_DEFINED);
                }
                self.validateClassroomExistanceInDb(classRoomForm.number, function (err, isClassroomExists) {
                    if (isClassroomExists) {
                        return next(null, ErrorCodes.CLASSROOM_IS_ALREADY_EXISTING)
                    }
                    else {
                        return next();
                    }
                });
            },

            function validateDescription(next) {

                var isValidDescription = self.validateDescription(classRoomForm.description);
                if (isValidDescription) {
                    return next();
                }
                else {
                    return next(null, ErrorCodes.DESCRIPTION_LENGTH_IS_INCORRECT);
                }
            }
        ], function (err, result) {

            var validationErrors = result.filter(function (item) {
                return item !== undefined;
            });

            if (err) {
                return done(err);
            } else if (validationErrors.length > 0) {
                return done(null, {success: false, validationResults: validationErrors});
            } else {
                return done(null, {success: true});
            }
        });
    },
    validateNumber: function (roomNumber) {
        if (!roomNumber.match(REGEX_DIGIT)) {
            return false;
        }
        return true;
    },
    validateDescription: function (description) {
        if (description.length === 0 || description.length > 40) {
            return false;
        }
        return true;
    },
    validateClassroomExistanceInDb: function (number, done) {
        this.classroomFinder.findClassroomByNumber(number, function (err, isExist) {
            if (err) {
                done(err);
            } else {
                if (isExist !== null) {
                    return done(null, true);
                } else {
                    return done(null, false);
                }
            }
        })
    }
};

var ClassroomFormValidatorFactory = {
    create: function (args) {
        var classroomFormValidator = Object.create(ClassroomFormValidator);
        classroomFormValidator.init(args);
        return classroomFormValidator;
    }
};

module.exports = ClassroomFormValidatorFactory;