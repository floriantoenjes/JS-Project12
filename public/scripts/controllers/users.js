"use strict";

angular.module("app")

    .controller("UsersController", function ($scope, authenticationService) {

        authenticationService.getUsers(function (users) {
            $scope.users = users
        });

    });