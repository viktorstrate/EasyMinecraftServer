/**
 * Handles all the logic in the dashboard view
 */

$(document).ready(function () {

    $('#btn-start').click(function () {
        server.start();
    });

    $('#btn-stop').click(function () {
        server.stop();
    });

    $('#btn-restart').click(function () {

        server.stop().done(function () {
            setTimeout(function () {
                server.start()
            }, 4000);
        });

    });

    $('#btn-forcestop').click(function () {
        server.kill();
    });

    /*onServerStateChange(updateServerState);

    updateServerState(serverState);

    function updateServerState(state) {
        var text;
        switch (state) {
            case serverStateType.RUNNING:
                text = "Running";
                break;
            case serverStateType.STARTING:
                text = "Starting";
                break;
            case serverStateType.STOPPED:
                text = "Stopped";
                break;
            default:
                text = "Not set";
                break;
        }
        $("#server-state").html(text);
     }*/

    $("#server-version").html(localStorage.serverVersion);

    var uptimeId = $("#server-uptime");
    var uptime = 0;
    var intervalId;

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

        uptimeId.html(string);
    }

    var playerContainer = $("#player-container");

    function addPlayerToGUI(username) {
        playerContainer.prepend('<div class="player"><img src="https://minotar.net/avatar/' + username + '" class="player-img"></img><div class="player-hover">' + username + '</div></div>')
    }

    function removePlayerFromGUI(username) {
        playerContainer.find('.player-hover').each(function (i, element) {
            if (element.html == username)
                element.parentElement.remove();
        });
    }

    server.onPlayerJoin(function (username) {
        addPlayerToGUI(username);
    });

    server.onPlayerLeave(function (username) {
        removePlayerFromGUI(username);
    })

});
