'use strict';

var Roles = require('./role');
var Actions = require('./actions');
var ErrorCodes = require('./error-codes');

var RolePermissionMap = {
    init: function() {

    },
    getRolePermission: function(role) {
        switch (role) {
            case Roles.ADMIN:
                return [Actions.CREATE_STUDENT, Actions.CREATE_DIRECTOR, Actions.CREATE_ADMIN];
            case Roles.DIRECTOR:
                return [Actions.CREATE_STUDENT];
            default:
                return ErrorCodes.HAS_NO_PERMISSION;
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
