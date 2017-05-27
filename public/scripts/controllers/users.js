"use strict";

angular.module("app")

    .controller("UsersController", function ($location, $scope, authenticationService) {

        // Initialize Data
        authenticationService.getAllUsers(function (users) {
            $scope.users = users
        });

    });