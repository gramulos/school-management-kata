var _ = require('lodash');

var INVALID_ID_NUMBER = '4s8a4f9d8e';
var Role = require('../src/infra/role');
var AccountFactory = require('../src/users/account-factory');
var UserFactory = require('../src/users/user-factory');
var sha256 = require('sha256');
var StudentFactory = require('../src/school/student-factory');
var Fakes = require('../test/fakes');
var DateProvider = require('../src/infra/date-provider');
var UuidProvider = require('../src/infra/uuid-provider');
var EmployeeFactory = require('../src/school/employee-factory');
var GradeFactory = require('../src/school/grade-factory');
var SchoolFactory = require('../src/school/school-factory');
var ClassroomFactory = require('../src/school/classroom-factory');

var AccountBuilderTest = {
    init: function () {
        this.builder = {};
        this.builder.password = 'r5ZJBKRJi';
        this.builder.hashedPassword = sha256(this.builder.password);
        this.builder.role = Role.STUDENT;
        this.builder.username = 'rufetisayev5Z';
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

    withoutId: function () {
        delete this.user.id;
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


        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProvider = DateProvider.create();
        if (!account) {
            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();

            account = accountBuilder.build();
        }
        return UserFactory.create({
            id: uuidProviderFake.getValue(),
            createdDate: dateProvider.now(),
            firstName: 'rufet',
            lastName: 'isayev',
            patronymic: 'kamaleddin',
            idNumber: '5ZJBKRJ',
            email: 'rufetisayev@yahoo.com',
            phone: '0518585529',
            imageUrl: 'rufet@images.com',
            account: account

        });

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

        var uuidProvider = UuidProvider.create();


        if (!user) {
            var userBuilder = Object.create(UserBuilder);
            userBuilder.init();

            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();

            var account = accountBuilder.build();

            user = userBuilder.build(account);
        }

        return StudentFactory.create({
            id: uuidProvider.v1(),
            userId: user.id,
            grade: this.builder.grade,
            classNumber: this.builder.classNumber
        });
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

var EmployeeBuilderTest = {
    init: function(role) {
        this.builder = {};

        this.role = role;
        this.builder.salary = 547;
    },

    withSalary: function(salary) {
        this.builder.salary = salary;
        return this;
    },

    build: function(user) {
        if(!user) {
            var userBuilder = Object.create(UserBuilder);
            userBuilder.init();

            var accountBuilder = Object.create(AccountBuilderTest);
            accountBuilder.init();

            var account = accountBuilder.build();

            user = userBuilder.build(account);
        }
        return EmployeeFactory.createFromForm({employee: this.builder, userId: user.id});
    },

    buildForm: function(role) {
        var userBuilder = Object.create(UserBuilder);
        userBuilder.init();

        var employee = {
            role: role,
            salary: 547
        };

        return employee;
    }
};

var GradeBuilder = {
    init: function() {
        this.builder = {};

        this.builder.number = '1';
        this.builder.groups = {};
        this.builder.plan = {}
    },

    build: function(){

        return GradeFactory.createFromForm({gradeForm: this.builder});
    },

    buildForm: function() {
        return {
            number: this.builder.number
        }
    },

    withNumber: function(number) {
        this.builder.number = number;
        return this;
    }
};

var SchoolBuilder = {
    init:function(){
        this.builder = {};

        this.builder.name = 'BDU';
        this.builder.email = 'bdu@bdu.az';
        this.builder.phone = '0518585529';
        this.builder.address = 'Baki';
    },

    withName:function(name){
      this.builder.name = name;
      return this;
    },

    withEmail: function (email) {
        this.builder.email = email;
        return this;
    },

    buildForm:function(){
        return this.builder;
    },
    build:function(){
        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProvider = DateProvider.create();

        var school = SchoolFactory.create({
            id:uuidProviderFake.getValue(),
            name:this.builder.name,
            email:this.builder.email,
            phone:this.builder.phone,
            address:this.builder.address,
            createdDate:dateProvider.now()
        });
        return school;
    }
};

var ClassroomBuilder = {
    init:function(){
        this.builder = {};

        this.builder.number = '708';
        this.builder.description = 'Physic room';
    },
    withNumber:function(number){
        this.builder.number = number;
        return this;
    },

    buildForm:function(){
        return this.builder;
    },
    build:function(){
        var uuidProviderFake = Fakes.getUuidProviderFake();
        var dateProvider = DateProvider.create();


        var classroom = ClassroomFactory.create({
            id:uuidProviderFake.getValue(),
            createdDate:dateProvider.now(),
            number:this.builder.number,
            description:this.builder.description
        });
        return classroom;
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
        aStudent: function () {
            var validStudentForm = Object.create(StudentBuilderTest);
            validStudentForm.init();
            return validStudentForm;
        }
    },

    token: {
        ROOT_ADMIN_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyM2U2ZGViMC1hZGVmLTExZTUtYTUwNS01YjAzMTU1NmE0NTAiLCJyb2xlIjo0LCJpYXQiOjE0NTE5OTI2MTZ9.7z6TV4nlX4nO2IXbeaKeZtMO5Q_XgrZ5jVcsVv-njFU',
        STUDENT_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyM2U2ZGViMC1hZGVmLTExZTUtYTUwNS01YjAzMTU1NmE0NTAiLCJyb2xlIjoyLCJpYXQiOjE0NTEzODQ5OTN9.gTD79c4lgE5W752qjCkWkfwuduCtlfgXNRHZnpV8Mz0',
        ADMIN_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYWI3MmVhMC1hYWVhLTExZTUtYjk1OS04OTQ4YTlkZTdlODQiLCJyb2xlIjoxLCJpYXQiOjE0NTEwMzYxMTB9.oM4JOZI_FNJGsIaKjCoAGBlxScKivFXUEW0L2qvXMLc',
        invalidToken: function (invalidToken) {
            return invalidToken;
        }
    },

    employee: {
        anEmployee: function(role) {
            var employeeForm = Object.create(EmployeeBuilderTest);
            employeeForm.init(role);
            return employeeForm;
        }
    },

    grade: {
        aGradeForm: function () {
            var gradeForm = Object.create(GradeBuilder);
            gradeForm.init();
            return gradeForm;
        }
    },

    school:{
        aSchoolForm:function(){
            var schoolForm = Object.create(SchoolBuilder);
            schoolForm.init();
            return schoolForm;
        }
    },

    classroom:{
        aClassroomForm:function(){
            var classRoomForm = Object.create(ClassroomBuilder);
            classRoomForm.init();
            return classRoomForm;

        }
    }
};

module.exports = Fixtures;