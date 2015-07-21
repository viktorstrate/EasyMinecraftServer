/*
 * Handles all the logic in the dashboard view
 */

/**
 * Used in angular.js
 * @param $scope the scope from angular.js
 */
function dashboardController($scope) {
    // Server state
    $scope.serverState = server.getStateText(server.state);

    // When the state of the server changes, fx. to running or stopped
    server.onStateChange(updateServerState);

    // update the server state on the dashboard in the GUI
    function updateServerState() {
        console.log("State Changed!!!");
        $scope.serverState = server.getStateText(server.state);
        $scope.$apply();
    }

    // Adds the server version to the dashboard in the GUI
    $scope.serverVersion = localStorage.serverVersion;

    // Server uptime
    var uptime = 0;
    var intervalId;
    $scope.serverUptime = "0d 0h 0m 0s";

    // Handles the uptime on GUI
    server.onStateChange(function (state) {
        // if server is running, add one to uptime every second
        if (state == server.stateType.RUNNING) {

            intervalId = setInterval(function () {
                uptime += 1;
                updateUptime();
            }, 1000);

        } else {
            // if the server isn't running, set uptime to 0 and stop the timer
            uptime = 0;
            updateUptime();
            clearInterval(intervalId);
        }
    });

    // updates the uptime on the GUI
    function updateUptime() {
        // Calculates the total seconds online to something readable
        var hour, min, sec;

        day = Math.floor(uptime / (60 * 60 * 24));
        hour = Math.floor(uptime / (60 * 60) - day * 24);
        min = Math.floor(uptime / 60) - hour * 60;
        sec = uptime - hour * 60 * 60 - min * 60;

        var string = day + "d " + hour + "h " + min + "m " + sec + "s";

        $scope.serverUptime = string;
        $scope.$apply();
    }

    // Online Players
    $scope.onlinePlayers = [];

    // When players joins, add them to the onlinePlayers array
    server.onPlayerJoin(function (username) {
        $scope.onlinePlayers.push(username);
    });

    // When players leaves, remove them from the onlinePlayers array
    server.onPlayerLeave(function (username) {
        for (var i = 0; i < $scope.onlinePlayers.length; i++) {
            if ($scope.onlinePlayers[i] == username)
                $scope.onlinePlayers.splice(i, 1);
        }
    });

    // Dashboard buttons
    $scope.stopServer = function () {
        server.stop();
    };

    $scope.startServer = function () {
        server.start();
    };

    $scope.forceStopServer = function () {
        server.forceStopServer();
    };

    $scope.restartServer = function () {
        server.restart();
    }
}
