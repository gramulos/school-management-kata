'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var sinon = require('sinon');

var GradeRegistrarFactory = require('../../src/school/grade-registrar');
var TokenValidatorFactory = require('../../src/auth/token-validator');
var AuthorizerFactory = require('../../src/auth/authorizer');
var GradeFactory = require('../../src/school/grade-factory');
var GradeRegistrationFormValidatorFactory = require('../../src/school/grade-registration-form-validator');
var GradeSaverFactory = require('../../src/school/grade-saver');

var Fixtures = require('../fixtures');


describe('GradeRegistrar test', function () {

    var GradeFormBuilder = Fixtures.grade;


    describe('#register new grade - 1st grade', function () {

        var gradeRegistrar;
        var gradeRegistrationForm;

        var tokenValidatorSpy;
        var authorizerSpy;
        var gradeRegistrationFormValidatorSpy;
        var gradeCreatorSpy;
        var gradeSaverSpy;

        before(function (beforeDone) {

            gradeRegistrationForm = GradeFormBuilder.aGradeForm().buildForm();

            var tokenValidator = TokenValidatorFactory.create();
            tokenValidatorSpy = sinon.spy(tokenValidator, 'validate');

            var authorizer = AuthorizerFactory.create();
            authorizerSpy = sinon.spy(authorizer, 'authorize');

            var gradeRegistrationFormValidator = GradeRegistrationFormValidatorFactory.create();
            gradeRegistrationFormValidatorSpy = sinon.spy(gradeRegistrationFormValidator, 'validate');

            gradeCreatorSpy = sinon.spy(GradeFactory, 'createFromForm');

            var gradeSaver = GradeSaverFactory.create();
            gradeSaverSpy = sinon.stub(gradeSaver, 'save', function (grade, done) {
                done(null, grade);
            });

            gradeRegistrar = GradeRegistrarFactory.create({
                tokenValidator: tokenValidator,
                authorizer: authorizer,
                gradeRegistrationFormValidator: gradeRegistrationFormValidator,
                gradeSaver: gradeSaver
            });

            var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc';

            var registrationForm = {
                gradeForm: gradeRegistrationForm
            };
            gradeRegistrar.register(testToken, registrationForm, function(err, result){
                beforeDone();
            })
        });

        it('user should have valid access token', function () {
            assert.isTrue(tokenValidatorSpy.calledOnce);
        });

        it('user has to be authorized as ADMIN', function () {
            assert.isTrue(authorizerSpy.calledOnce);
        });

        it('grade registration form should be validated', function () {
            assert.isTrue(gradeRegistrationFormValidatorSpy.calledOnce);
        });

        it('should create a grade', function () {
            assert.isTrue(gradeCreatorSpy.calledOnce);
        });

        it('should save a grade', function () {
            assert.isTrue(gradeSaverSpy.calledOnce);
        });

        it('functions should be called in a correct order', function () {
            sinon.assert.callOrder(
                tokenValidatorSpy,
                authorizerSpy,
                gradeRegistrationFormValidatorSpy,
                gradeCreatorSpy,
                gradeSaverSpy
            );
        });

        after(function(){
            gradeCreatorSpy.restore();
        })
    });
});

