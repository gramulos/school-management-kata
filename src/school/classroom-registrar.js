'use strict';

var TokenValidatorFactory = require('../auth/token-validator');
var AuthorizerFactory = require('../auth/authorizer');
var ClassroomFormValidatorFactory = require('../school/classroom-form-validator');
var ClassroomSaverFactory = require('../school/classroom-saver');
var ClassRoomFactory = require('../school/classroom-factory');
var ErrorCodes = require('../infra/error-codes');
var Actions = require('../infra/actions');

var async = require('async');

var ClassroomRegistrar = {
    init: function (args) {
        args = args || {};
        this.tokenValidator = args.tokenValidator || TokenValidatorFactory.create();
        this.authorizer = args.authorizer || AuthorizerFactory.create();
        this.classroomFormValidator = args.classroomFormValidator || ClassroomFormValidatorFactory.create();
        this.classroomSaver = args.classroomSaver || ClassroomSaverFactory.create();
    },
    register: function (token, classRoomForm, done) {
        var self = this;
        async.waterfall([
            function validateToken(next) {
                self.tokenValidator.validate(token, next);
            },
            function authorize(account, next) {
                if (!account) {
                    return next(ErrorCodes.INVALID_TOKEN);
                }
                var isAuthorized = self.authorizer.authorize(Actions.CREATE_CLASSROOM, account);
                return next(null, isAuthorized);
            },
            function validateClassroomForm(isAuthorized, next) {
                if (!isAuthorized) {
                    return next(ErrorCodes.HAS_NO_PERMISSION);
                }
                self.classroomFormValidator.validate(classRoomForm,next);
            },
            function createClassroom(isValidForm, next) {
                if (!isValidForm) {
                    return next(ErrorCodes.INVALID_FORM);
                }
                var classRoom = ClassRoomFactory.createFromForm({form: classRoomForm});
                return next(null, classRoom);
            },
            function saveClassroom(classRoom, next) {
                if (!classRoom) {
                    return next(ErrorCodes.CLASSROOM_IS_NOT_DEFINED);
                }
                self.classroomSaver.save(classRoom, next);
            }
        ], function (err, classRoom) {
            if (err) {
                return done(err);
            } else {
                return done(null, classRoom);
            }
        })
    }
};

var ClassroomRegistrarFactory = {
    create: function (args) {
        var classroomRegistrar = Object.create(ClassroomRegistrar);
        classroomRegistrar.init(args);
        return classroomRegistrar;
    }
};

module.exports = ClassroomRegistrarFactory;