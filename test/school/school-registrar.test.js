'use strict';

var chai = require('chai');
var assert = chai.assert;
require('../../spec/test-helper')
var sinon = require('sinon');

var Fixtures = require('../fixtures');
var SchoolRegistrarFactory = require('../../src/school/school-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var SchoolFormValidatorFactory = require('../../src/school/school-form-validator');
var SchoolFactory = require('../../src/school/school-factory');
var SchoolSaverFactory = require('../../src/school/school-saver');

describe('SchoolRegistrar test', function(){
    var schoolRegistrar;
    var tokenBuilder = Fixtures.token;
    var schoolRegistrationFormBuilder = Fixtures.school;
    var tokenValidatorSpy;
    var authorizerSpy;
    var schoolFormValidatorSpy;
    var schoolSaverSpy;
    var schoolCreatorSpy;

    describe('#register new school', function(){

        before(function(beforeDone){
            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var schoolFormValidator = SchoolFormValidatorFactory.create();
            schoolFormValidatorSpy = sinon.spy(schoolFormValidator, 'validate');

            schoolCreatorSpy = sinon.spy(SchoolFactory,'createFromForm');

            var schoolSaver = SchoolSaverFactory.create();
            schoolSaverSpy = sinon.stub(schoolSaver, 'save', function (user, done) {
                done();
            });
            schoolRegistrar = SchoolRegistrarFactory.create({
                tokenValidator:tokenValidator,
                authorizer:authorizer,
                schoolFormValidator:schoolFormValidator,
                schoolSaver: schoolSaver
            });
            var schoolRegistrationForm = schoolRegistrationFormBuilder.aSchoolForm().buildForm();
            var testToken = tokenBuilder.ROOT_ADMIN_TOKEN;
            schoolRegistrar.register(testToken,schoolRegistrationForm, function(err, school){
                assert.isNull(err)
                beforeDone();
            })
        });

        it('user should have valid access token', function(){
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as RootAdmin', function(){
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('schoolForm should be validated', function () {
            assert.isTrue(schoolFormValidatorSpy.calledOnce);
        });

        it('School should be created', function(){
            assert.isTrue(schoolCreatorSpy.calledOnce);
        });

        it('school should be saved', function () {
            assert.isTrue(schoolSaverSpy.calledOnce);
        });

        it('should be called in correct order', function(){
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                schoolFormValidatorSpy,
                schoolCreatorSpy,
                schoolSaverSpy
            )
        });
        after(function(){
            schoolCreatorSpy.restore();
        });


    })



});