'use strict';

var chai = require('chai');
var assert = chai.assert;
require('../../spec/test-helper');
var sinon = require('sinon');

var Fixtures = require('../fixtures');
var ClassRoomRegistrarFactory = require('../../src/school/classroom-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var ClassroomFormValidatorFactory = require('../../src/school/classroom-form-validator');
var ClassroomFactory = require('../../src/school/classroom-factory');
var ClassroomSaverFactory = require('../../src/school/classroom-saver');

describe('Classroom registrar test', function(){
    var classroomRegistrar;
    var tokenBuilder = Fixtures.token;
    var classroomFormBuilder = Fixtures.classroom;
    var tokenValidatorSpy;
    var authorizerSpy;
    var classroomFormValidatorSpy;
    var classroomCreatorSpy;
    var classroomSaverSpy;

    describe('#register new classroom',function(){
        before(function (beforeDone) {
            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var classroomFormValidator = ClassroomFormValidatorFactory.create();
            classroomFormValidatorSpy = sinon.spy(classroomFormValidator,'validate');

            classroomCreatorSpy = sinon.spy(ClassroomFactory,'createFromForm');

            var classroomSaver = ClassroomSaverFactory.create();
            classroomSaverSpy = sinon.stub(classroomSaver, 'save', function(classroom,done){
                done(null,true);
            });
            classroomRegistrar = ClassRoomRegistrarFactory.create({
                tokenValidator:tokenValidator,
                authorizer:authorizer,
                classroomFormValidator:classroomFormValidator,
                classroomSaver:classroomSaver
            });
            var classRoomRegistrationForm = classroomFormBuilder.aClassroomForm().buildForm();
            var testToken = tokenBuilder.ADMIN_TOKEN;
            classroomRegistrar.register(testToken,classRoomRegistrationForm, function(err,classRoom){
                assert.isNull(err);
                beforeDone();
            })
        });

        it('user should have valid access token',function(){
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as Admin', function(){
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('classroomForm should be validated', function () {
            assert.isTrue(classroomFormValidatorSpy.calledOnce);
        });

        it('classroom should be created', function(){
            assert.isTrue(classroomCreatorSpy.calledOnce);
        });

        it('classroom should be saved', function () {
            assert.isTrue(classroomSaverSpy.calledOnce);
        });

        it('should be called in correct order',function(){
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                classroomFormValidatorSpy,
                classroomCreatorSpy,
                classroomSaverSpy
            )
        });

        after(function(){
            classroomCreatorSpy.restore();
        })
    })


});