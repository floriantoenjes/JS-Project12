"use strict";

angular.module("app").config(config).run(run);

function config($routeProvider) {

    $routeProvider
        .when("/", {
            controller: "SearchController",
            controllerAs: "vm",
            templateUrl: "templates/search.html"
        })
        .when("/login", {
            controller: "LoginController",
            controllerAs: "vm",
            templateUrl: "templates/login.html"
        })
        .when("/register", {
            controller: "RegisterController",
            controllerAs: "vm",
            templateUrl: "templates/register.html"
        })
        .when("/favorites", {
            controller: "MyFavoritesController",
            controllerAs: "vm",
            templateUrl: "templates/favorites.html"
        })
        .when("/users", {
            controller: "UsersController",
            controllerAs: "vm",
            templateUrl: "templates/users.html"
        })
        .when("/users/:id", {
            controller: "OtherFavoritesController",
            controllerAs: "vm",
            templateUrl: "templates/favorites.html"
        })
        .otherwise({
            redirectTo: "/"
        });
}

function run($rootScope, $location, authenticationService) {
    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {

        if (($location.path() === "/login" || $location.path() === "/register") && authenticationService.isLoggedIn()) {
            $location.path("/");
        } else if (!($location.path() === "/login" || $location.path() === "/register") && !authenticationService.isLoggedIn()) {
            $location.path("/login");
        }

    });
}