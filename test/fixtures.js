var _ = require('lodash');

var INVALID_ID_NUMBER = '4s8a4f9d8e';
var Role = require('../src/infra/role');
var AccountFactory = require('../src/users/account-factory');
var sha256 = require('sha256');


var ValidUserFormBuilder = {
    init: function () {
        this.user = {
            firstName: 'rufet',
            lastName: 'isayev',
            patronymic: 'kamaleddin',
            idNumber: '5ZJBKRJ',
            email: 'rufetisayev@yahoo.com',
            phone: '0518585529',
            imageUrl: 'rufet@images.com'
        }
    },

    withIdNumber: function (idNumber) {
        this.user.idNumber = idNumber;
        return this;
    },

    withInvalidIdNumber: function () {
        this.user.idNumber = INVALID_ID_NUMBER;
        return this;
    },

    withPhoneNumber: function (phoneNumber) {
        this.user.phoneNumber = phoneNumber;
        return this;
    },

    withPatronymic: function (patronymic) {
        this.user.patronymic = patronymic;
        return this;
    },

    withEmail: function (email) {
        this.user.email = email;
        return this;
    },

    build: function () {
        return _.assign({}, this.user);
    }
};

var StudentBuilderTest = {
    init: function () {

        this.builder = {
            grade: 10,
            classNumber: 100,
            studentId: '11102'
        };
    },

    withGrade: function (grade) {
        this.builder.grade = grade;
        return this;
    },


    build: function () {

    },

    buildForm: function () {
        var userBuilder = Object.create(ValidUserFormBuilder);
        userBuilder.init();

        var userForm = userBuilder.buildForm();
        return _.assign({}, userForm, {
            studentForm: {
                grade: this.builder.grade,
            }
        })
    }
};

var AccountBuilderTest = {
    init: function () {
        this.builder = {};
        this.builder = {
            form: {
                username: 'username1',
                password: 'a4s9qc63s'
            }
        };
        this.builder.hashedPassword = sha256(this.builder.form.password);
        this.builder.role = Role.STUDENT;
        this.builder.userId = '111'; // TODO make it more realistic
    },

    withUsername: function (username) {
        this.builder.form.username = username;
        return this;
    },
    withRole: function (role) {
        this.builder.role = role;
        return this;
    },

    withPassword: function (password) {
        this.builder.form.password = password;
        this.builder.hashedPassword = sha256(this.builder.form.password);
        return this;
    },

    build: function () {
        return AccountFactory.createFromForm(this.builder);
    },

    buildForm: function () {
        var form = {
            form: this.builder.form,

            role: this.builder.role
        };

        return form;
    }

};

var Fixtures = {
    user: {
        aUserForm: function () {
            var validUserForm = Object.create(ValidUserFormBuilder);
            validUserForm.init();
            return validUserForm;
        }
    },

    account: {

        anAccount: function () {
            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();
            return accountBuilder;
        }


    }

};

module.exports = Fixtures;