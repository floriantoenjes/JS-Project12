'use strict';

describe('LoginController', function () {
    let $controller, $scope;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, _$controller_) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    it("should login", inject(function (authenticationService) {
        let controller = $controller('LoginController', {
            $scope: $scope
        });

        spyOn(authenticationService, "login");

        $scope.login({});

        expect(authenticationService.login).toHaveBeenCalled();
    }));
});