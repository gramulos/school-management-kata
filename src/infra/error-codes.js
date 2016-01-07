var ApplicationError = {
    init: function(code, message) {
        this.code = code;
        this.message = message;
    }
};

var ApplicationErrorFactory = {
    create: function(code, message) {
        var errorTypes = Object.create(ApplicationError);
        errorTypes.init(code, message);
        return errorTypes;
    }
};

var ErrorCodes = {
    EMAIL_NOT_SEND: ApplicationErrorFactory.create(105, 'Email send failed'),
    HAS_NO_PERMISSION: ApplicationErrorFactory.create(106, 'User has no permission'),
    INVALID_FORM: ApplicationErrorFactory.create(107, 'Form is not valid'),
    LOGIN_FAILED: ApplicationErrorFactory.create(108, 'Username or password is incorrect'),
    INVALID_USER_FORM: ApplicationErrorFactory.create(109, 'User form is invalid'),
    USERNAME_NOT_EXIST: ApplicationErrorFactory.create(110, 'UserName does not exist'),
    PASSWORD_NOT_EXIST: ApplicationErrorFactory.create(111, 'Password does not exist'),
    ROLE_NOT_EXIST: ApplicationErrorFactory.create(112, 'Role does not exist'),
    USER_NOT_SAVED: ApplicationErrorFactory.create(113, 'User not saved'),
    STUDENT_IS_NOT_DEFINED: ApplicationErrorFactory.create(114, 'Student is null or empty'),
    INVALID_TOKEN:ApplicationErrorFactory.create(115,'Token is invalid'),
    INVALID_PASSWORD: ApplicationErrorFactory.create(116, 'Password is not valid'),
    EMPLOYEE_IS_NOT_DEFINED: ApplicationErrorFactory.create(117, 'Employee is null or empty'),
    SCHOOL_IS_NOT_DEFINED: ApplicationErrorFactory.create(118,'School is null or empty'),
    CLASSROOM_IS_NOT_DEFINED: ApplicationErrorFactory.create(119,'Classroom is null or empty'),
    SCHOOL_IS_ALREADY_EXISTING: ApplicationErrorFactory.create(120,'School exists in the db'),
    NAME_IS_NOT_VALID: ApplicationErrorFactory.create(121,'Name is not valid'),
    EMAIL_IS_NOT_VALID: ApplicationErrorFactory.create(122,'Email is not valid'),
    PHONE_NUMBER_IS_NOT_VALID: ApplicationErrorFactory.create(123,'Phone number is not valid'),
    LAST_NAME_IS_NOT_VALID:  ApplicationErrorFactory.create(124,'Last name is not valid'),
    PATRONYMIC_IS_NOT_VALID:  ApplicationErrorFactory.create(125,'Patronymic is not valid'),
    ID_NUMBER_IS_NOT_VALID: ApplicationErrorFactory.create(126,'Id number is not valid'),
    CLASSROOM_NUMBER_IS_NOT_DEFINED:ApplicationErrorFactory.create(127,'Classroom is not valid'),
    CLASSROOM_IS_ALREADY_EXISTING:ApplicationErrorFactory.create(128,'Classroom exists in the db'),
    GRADE_IS_NOT_DEFINED: ApplicationErrorFactory.create(129, 'Grade is null or empty'),
    GRADE_IS_ALREADY_EXISTS: ApplicationErrorFactory.create(130, ' Grade is already exists')
};

module.exports = ErrorCodes;