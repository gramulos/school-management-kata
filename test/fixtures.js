var _ = require('lodash');

var INVALID_ID_NUMBER = '4s8a4f9d8e';
var Role = require('../src/infra/role');
var AccountFactory = require('../src/users/account-factory');
var UserFactory = require('../src/users/user-factory');
var sha256 = require('sha256');
var StudentFactory = require('../src/school/student-factory');

var AccountBuilderTest = {
    init: function () {
        this.builder = {};
        this.builder.username = 'username1';
        this.builder.password = 'a4s9qc63s';
        this.builder.hashedPassword = sha256(this.builder.password);
        this.builder.role = Role.STUDENT;
        this.builder.userId = '111'; // TODO make it more realistic
    },

    withUsername: function (username) {
        this.builder.username = username;
        return this;
    },

    withRole: function (role) {
        this.builder.role = role;
        return this;
    },

    withPassword: function (password) {
        this.builder.password = password;
        this.builder.hashedPassword = sha256(this.builder.password);
        return this;
    },

    build: function () {
        return AccountFactory.createFromForm(this.builder);
    },

    buildForm: function () {
        var form = {
            form: {
                username: this.builder.username,
                password: this.builder.password
            },

            role: this.builder.role
        };

        return form;
    }

};


var UserBuilder = {
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
        this.user.phone = phoneNumber;
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

    build: function (account) {
        if (!account) {
            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();

            account = accountBuilder.build();
        }

        return UserFactory.createFromForm({ form: this.user, account: account })
    },

    buildForm: function () {
        return this.user;
    }
};

var StudentBuilderTest = {
    init: function () {
        this.builder = {};

        this.builder.grade = 10;
        this.builder.classNumber = 100;
        this.builder.studentId = '11102';
    },

    withGrade: function (grade) {
        this.builder.grade = grade;
        return this;
    },

    withClassNumber: function (classNumber) {
        this.builder.classNumber = classNumber;
        return this;
    },

    build: function (user) {
        if(!user) {
            var userBuilder = Object.create(UserBuilder);
            userBuilder.init();

            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();

            var account = accountBuilder.build();

            user = userBuilder.build(account);
        }
        return StudentFactory.createFromForm({student: this.builder, userId: user.id});
    },

    buildForm: function () {
        var userBuilder = Object.create(UserBuilder);
        userBuilder.init();

        var student = {
            grade: this.builder.grade,
            classNumber: this.builder.classNumber
        };
        return student;
    }
};


var Fixtures = {
    user: {
        aUserForm: function () {
            var validUserForm = Object.create(UserBuilder);
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


    },

    student: {
        aStudentForm: function () {
            var validStudentForm = Object.create(StudentBuilderTest);
            validStudentForm.init();
            return validStudentForm;
        }
    }
};

module.exports = Fixtures;