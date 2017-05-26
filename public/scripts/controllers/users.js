"use strict";

angular.module("app")

    .controller("UsersController", function ($location, $scope, authenticationService) {

        authenticationService.getUsers(function (users) {
            $scope.users = users
        });

    });