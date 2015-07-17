/**
 * Handles all the logic in the dashboard view
 */

$(document).ready(function () {

    $('#btn-start').click(function () {
        startServer();
    });

    $('#btn-stop').click(function () {
        stopServer();
    });

    $('#btn-restart').click(function () {
        stopServer(function () {
            setTimeout(function () {
                startServer()
            }, 4000);
        });
    });

    $('#btn-forcestop').click(function () {
        killServer();
    });
});
