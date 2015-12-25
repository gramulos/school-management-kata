'use strict';

var StudentCreator = {
    init: function(args) {
        this.grade = args.grade;
        this.classNumber = args.classNumber;
        this.user = args.user;

        return this;
    }
};

var StudentCreatorFactory = {
    create: function(args) {
        var studentCreator = Object.create(StudentCreator);
        studentCreator.init(args);
        return studentCreator;
    }
};

module.exports = StudentCreatorFactory;