'use strcict';

var chai = require('chai');
var assert = chai.assert;

var Fixtures = require('../test/fixtures');
var ClassroomRegistrarFactory = require('../src/school/classroom-registrar');
var ClassroomFinderFactory = require('../src/school/classroom-finder');
var ErrorCodes = require('../src/infra/error-codes');
var mongoose = require('mongoose');

function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function () {
        });
    }
    return done();
}

describe('ClassroomRegistrar spec test', function () {

    var tokenBuilder = Fixtures.token;
    var classroomBuilder = Fixtures.classroom;

    describe('#register new classroom', function () {
        var classroomRegistrar;
        var classroomForm;

        before(function (beforeDone) {
            classroomRegistrar = ClassroomRegistrarFactory.create();

            var testToken = tokenBuilder.ADMIN_TOKEN;
            classroomForm = classroomBuilder.aClassroomForm().buildForm();
            classroomRegistrar.register(testToken, classroomForm, function (err, classroom) {
                assert.isNull(err);
                beforeDone();
            })
        });

        it('should create new schoolroom in db', function (testDone) {
            var classroomFinder = ClassroomFinderFactory.create();
            classroomFinder.findClassroomByNumber(classroomForm.number, function (err, classroom) {
                assert.isNotNull(classroom);
                testDone();
            })
        });
        after(function (afterDone) {
            clearDB(afterDone);
        })
    });

    describe('#register new classroom with invalid token', function () {
        var classroomRegistrar;
        var classroomForm;

        before(function (beforeDone) {
            classroomRegistrar = ClassroomRegistrarFactory.create();

            var testToken = tokenBuilder.invalidToken('fake');

            classroomForm = classroomBuilder.aClassroomForm().buildForm();
            classroomRegistrar.register(testToken, classroomForm, function (err, classroom) {
                assert.equal(err,ErrorCodes.INVALID_TOKEN);
                beforeDone();
            })
        });

        it('should not save schoolroom in db', function (testDone) {
            var classroomFinder = ClassroomFinderFactory.create();
            classroomFinder.findClassroomByNumber(classroomForm.number, function (err, classroom) {
                assert.isNull(classroom);
                testDone();
            })
        });
        after(function (afterDone) {
            clearDB(afterDone);
        })
    });
});