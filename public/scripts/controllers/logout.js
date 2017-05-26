"use strict";

angular.module("app")

    .controller("LogoutController", function ($location, $scope, authenticationService) {

        // Functions
        $scope.login = function (user) {
            authenticationService.login(user, function (error) {
                if (error) {
                    error.message = "Email or password do not match.";
                    $scope.error = error;
                }
                $location.path("/");
            });
        };
    });