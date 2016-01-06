'use strict';
var Role = require('../../src/infra/role');

var RolePermissionMap = require('../infra/role-permission-map');
var Roles = require('../infra/role');
var Actions = require('../infra/actions');

var Authorizer = {
    init: function (args) {
        this.rolePermissionMap = RolePermissionMap.create();
    },

    authorize: function (action, account) {
        var permissions = this.rolePermissionMap.getRolePermission(account.role);
        var result = permissions.indexOf(action);

        return result !== -1;
    },
    convertRoleToAction: function(role) {
        switch (role) {
            case Roles.ADMIN:
                return Actions.CREATE_ADMIN;

            case Roles.DIRECTOR:
                return Actions.CREATE_DIRECTOR;

            case Roles.STUDENT:
                return Actions.CREATE_STUDENT;

        }
    }
};

var AuthorizerFactory = {
    create: function (args) {
        var authorizer = Object.create(Authorizer);
        authorizer.init(args);
        return authorizer;
    }
};

module.exports = AuthorizerFactory;