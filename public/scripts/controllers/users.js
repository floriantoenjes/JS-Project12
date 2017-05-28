"use strict";

angular.module("app")

    .controller("UsersController", function ($location, $scope, userService) {

        // Initialize Data
        userService.getAllUsers(function (users) {
            $scope.users = users
        });
    });