"use strict";

angular.module("app")

    .controller("LogoutController", function ($location, $scope, authenticationService) {

        // Functions
        $scope.logout = function () {
            authenticationService.logout();
            $location.path("/login");
        };
    });