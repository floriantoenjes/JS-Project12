"use strict";

angular.module("app")

.controller("UserController", function ($location, $scope, authenticationService) {
    $scope.login = function (user) {
        authenticationService.login(user, function (error) {
            if (error) {
                error.message = "Email or password do not match.";
                $scope.error = error;
            }
            $location.path("/");
        });
    };

    $scope.register = function (user) {
        if (!user) {
            const error = new Error();
            error.message = "Enter an email address.";
            return $scope.error = error;

        }

        if (!user.password) {
            const error = new Error();
            error.message = "Enter a password.";
            return $scope.error = error;
        }

        if (user.password !== user.confirmPassword) {
            const error = new Error();
            error.message = "Passwords do not match.";
            return $scope.error = error;
        }
        let userObject = {
            email: user.email,
            password: user.password
        };
        authenticationService.register(userObject, function (error) {
            if (error) {
                console.log("Error", error);
                if (error.data.errors.email) {
                    error.message = "Please enter a valid email address";
                } else if (error.data.errors.password) {
                    error.message = "Password has to be between 4 and 25 characters."
                }
                return $scope.error = error;
            }
            $location.path("/");
        });
    }

});