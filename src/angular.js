// Sets up angular
angular.module("mainApp", [])
    .controller("mainController", ["$scope", function ($scope) {

        // Function from dashboard.js
        dashboardController($scope);
        serverProperties.angular($scope);

    }]);
