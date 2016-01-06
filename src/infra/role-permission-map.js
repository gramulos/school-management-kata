'use strict';

var Roles = require('./role');
var Actions = require('./actions');
var ErrorCodes = require('./error-codes');

var RolePermissionMap = {
    init: function() {

    },
    getRolePermission: function(role) {
        switch (role) {
            case Roles.ROOT_ADMIN:
                return [Actions.CREATE_SCHOOL, Actions.CREATE_ADMIN];

            case Roles.ADMIN:
                return [Actions.CREATE_STUDENT, Actions.CREATE_DIRECTOR, Actions.CREATE_ADMIN, Actions.CREATE_GRADE, Actions.CREATE_CLASSROOM];

            case Roles.DIRECTOR:
                return [Actions.CREATE_STUDENT];

            default:
                return [ErrorCodes.HAS_NO_PERMISSION];
        }
    }
};

var RolePermissionMapFactory = {
    create: function() {
        var rolePermissionMap = Object.create(RolePermissionMap);
        rolePermissionMap.init();

        return rolePermissionMap;
    }
};

module.exports = RolePermissionMapFactory;
