angular.module("mainApp", [])
    .controller("mainController", ["$scope", function ($scope) {
        $scope.serverState = server.getStateText(server.state);

        server.onStateChange(updateServerState);

        function updateServerState() {
            console.log("State Changed!!!");
            $scope.serverState = server.getStateText(server.state);
            $scope.$apply();
        }

    }]);
