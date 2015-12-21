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
    ROLE_NOT_EXIST: ApplicationErrorFactory.create(112, 'Role does not exist')





};

module.exports = ErrorCodes;