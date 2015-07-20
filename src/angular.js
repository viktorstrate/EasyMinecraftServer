angular.module("mainApp", [])
    .controller("mainController", ["$scope", function ($scope) {

        // Server state
        $scope.serverState = server.getStateText(server.state);

        server.onStateChange(updateServerState);

        function updateServerState() {
            console.log("State Changed!!!");
            $scope.serverState = server.getStateText(server.state);
            $scope.$apply();
        }

        // Server version
        $scope.serverVersion = localStorage.serverVersion;

        // Server uptime
        var uptime = 0;
        var intervalId;
        $scope.serverUptime = "0d 0h 0m 0s";

        server.onStateChange(function (state) {
            if (state == server.stateType.RUNNING) {

                intervalId = setInterval(function () {
                    uptime += 1;
                    updateUptime();
                }, 1000);

            } else {
                uptime = 0;
                updateUptime();
                clearInterval(intervalId);
            }
        });

        function updateUptime() {
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

        //function addPlayerToGUI(username) {
        //    playerContainer.prepend('<div class="player"><img src="https://minotar.net/avatar/' + username + '" class="player-img"></img><div class="player-hover">' + username + '</div></div>')
        //}
        //
        //function removePlayerFromGUI(username) {
        //    playerContainer.find('.player-hover').each(function (i, element) {
        //        if (element.html == username)
        //            element.parentElement.remove();
        //    });
        //}

        server.onPlayerJoin(function (username) {
            $scope.onlinePlayers.push(username);
        });

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
            server.stop().done(function () {
                setTimeout(function () {
                    server.start()
                }, 4000);
            });
        }

    }]);
