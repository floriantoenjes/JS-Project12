"use strict";

angular.module("app").config(config);

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
    });

}