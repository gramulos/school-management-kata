var _ = require('lodash');

var INVALID_ID_NUMBER = '4s8a4f9d8e';
var Role = require('../src/infra/role');
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

    withInvalidIdNumber: function() {
        this.user.idNumber = INVALID_ID_NUMBER;
        return this;
    },

    withPhoneNumber: function(phoneNumber) {
        this.user.phoneNumber = phoneNumber;
        return this;
    },

    withPatronymic: function(patronymic) {
        this.user.patronymic = patronymic;
        return this;
    },

    withEmail: function(email) {
        this.user.email = email;
        return this;
    },

    build: function () {
        return _.assign({}, this.user);
    }
};

var StudentFormBuilder = {
    init: function () {
        var userForm = ValidUserFormBuilder.aUserForm().build();

        this.form = {
            userForm: this.userForm,
            grade: 10,
            classNumber: 100,
            studentId: '11102'
        }
    },

    withGrade: function (grade) {
        this.studentForm.grade = grade;
        return this;
    },


    build: function () {
        return _.assign({}, this.studentForm);
    }
};

var AccountFormBuilder = {
    init: function(){
        this.account = {
            username: 'feridheziyev12',
            role: Role.STUDENT,

        }
    },

    withUsername: function(username){
        this.account.username = username;
        return this;
    },
    withRole: function(role){
        this.account.role = role;
        return this;
    },
    withPassword: function(password){
        this.account.password = password;
        return this;
    },
    withHashedPassword: function(hashedPassword) {
        this.account.hashedPassword = hashedPassword;
        return this;
    },

    withUserId: function(userId) {
        this.account.userId = userId;
        return this;
    },

    build: function(){
        return _.assign({},this.account)
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
            var accountForm = Object.create(AccountFormBuilder);
            accountForm.init();
            return accountForm;
        }

    }
};

module.exports = Fixtures;