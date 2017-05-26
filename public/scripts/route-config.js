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
            controller: "UserController",
            controllerAs: "vm",
            templateUrl: "templates/login.html"
        })
        .when("/register", {
            controller: "UserController",
            controllerAs: "vm",
            templateUrl: "templates/register.html"
        })
        .when("/favorites", {
            controller: "SearchController",
            controllerAs: "vm",
            templateUrl: "favorites.html"
        })
        .otherwise({
            redirectTo: "/"
        });
}

function run($rootScope, $location, authenticationService) {
    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
        if ($location.path() === "/" && !authenticationService.isLoggedIn()) {
            $location.path("/login");
        } else if ($location.path !== "/" && authenticationService.isLoggedIn()) {
            $location.path("/");
        }
    })
}