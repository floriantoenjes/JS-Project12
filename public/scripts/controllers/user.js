"use strict";

angular.module("app")

.controller("UserController", function ($location, $scope, authenticationService) {
    $scope.login = function (user) {
        authenticationService.login(user, function () {
            $location.path("/");
        });
    };

    $scope.register = function (user) {
        if (user.password !== user.confirmPassword) {
            return;
        }
        let userObject = {
            email: user.email,
            password: user.password
        }
        authenticationService.register(userObject, function () {
            $location.path("/");
        });
    }

});