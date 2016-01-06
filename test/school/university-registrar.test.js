'use strict';

var chai = require('chai');
var assert = chai.assert;
require('../../spec/test-helper')
var sinon = require('sinon');

var Fixtures = require('../fixtures');
var UniversityRegistrarFactory = require('../../src/school/university-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var UniversityFormValidatorFactory = require('../../src/school/university-form-validator');
var UniversityFactory = require('../../src/school/university-factory');
var UniversitySaverFactory = require('../../src/school/university-saver');
var DateProviderFactory = require('../..//src/infra/date-provider');


describe('UniversityRegistrar test', function(){
    var universityRegistrar;
    var tokenBuilder = Fixtures.token;
    var universityRegistrationFormBuilder = Fixtures.university;
    var tokenValidatorSpy;
    var authorizerSpy;
    var universityFormValidatorSpy;
    var universitySaverSpy;
    var universityCreatorSpy;
    var dateProviderStub;
    var dateProviderFactorySpy;

    describe('#register new university', function(){

        before(function(beforeDone){
            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var universityFormValidator = UniversityFormValidatorFactory.create();
            universityFormValidatorSpy = sinon.spy(universityFormValidator, 'validate');

            universityCreatorSpy = sinon.spy(UniversityFactory,'createFromForm');

            var universitySaver = UniversitySaverFactory.create();
            universitySaverSpy = sinon.stub(universitySaver, 'save', function (user, done) {
                done();
            });
            universityRegistrar = UniversityRegistrarFactory.create({
                tokenValidator:tokenValidator,
                authorizer:authorizer,
                universityFormValidator:universityFormValidator,
                universitySaver: universitySaver
            });
            var universityRegistrationForm = universityRegistrationFormBuilder.aUniversityForm().buildForm();
            var testToken = tokenBuilder.ROOT_ADMIN_TOKEN;
            universityRegistrar.register(testToken,universityRegistrationForm, function(err,university){
                assert.isNull(err)
                beforeDone();
            })
        });

        it('user should have valid acces token', function(){
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as RootAdmin', function(){
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('universityForm should be validated', function () {
            assert.isTrue(universityFormValidatorSpy.calledOnce);
        });

        it('University should be created', function(){
            assert.isTrue(universityCreatorSpy.calledOnce);
        });

        it('university should be saved', function () {
            assert.isTrue(universitySaverSpy.calledOnce);
        });

        it('should be called in correct order', function(){
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                universityFormValidatorSpy,
                universityCreatorSpy,
                universitySaverSpy
            )
        })
        after(function(){
            universityCreatorSpy.restore();
        });


    })



});