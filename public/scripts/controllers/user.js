"use strict";

angular.module("app")

.controller("UserController", function ($scope, authenticationService) {
    $scope.login = authenticationService.login;
});