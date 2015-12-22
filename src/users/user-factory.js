'use strict';

var User = {
    init: function (args) {
        //this.user = {};
        this.id = args.id;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.patronymic = args.patronymic;
        this.idNumber = args.idNumber;
        this.email = args.email;
        this.phone = args.phone;
        this.imageUrl = args.imageUrl;
        this.createdDate = new Date();
        this.username = args.username;
        this.password= args.password;
        this.role= args.role;

    }
};

var UserFactory = {
    create: function (args) {
        var user = Object.create(User);
        user.init(args);
        return user;
    }
};

module.exports = UserFactory;
