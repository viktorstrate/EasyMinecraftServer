angular.module("mainApp", [])
    .controller("mainController", ["$scope", function ($scope) {
        $scope.serverState = getStateText(serverState);

        onServerStateChange(updateServerState);

        function updateServerState() {
            console.log("State Changed!!!");
            $scope.serverState = getStateText(serverState);
            $scope.$apply();
        }

    }]);
