"use strict";

angular.module("app")

    .controller("RegisterController", function ($location, $scope, authenticationService) {

        // Functions
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

                    if (error.data.errors.email) {
                        if (error.data.errors.email.kind === "unique") {
                            error.message = "This email has already been taken."
                        } else {
                            error.message = "Please enter a valid email address.";
                        }

                    } else if (error.data.errors.password) {
                        error.message = "Password has to be between 8 and 25 characters."
                    }

                    return $scope.error = error;
                }
                $location.path("/");
            });
        }

    });