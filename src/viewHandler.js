/**
 * Handles the GUI views; Dashboard, Terminal and Settings.
 * And the buttons in the left menu bar
 */

$(document).ready(function () {
    $("#toolbar-dashboard").click(function () {
        $("#toolbar-dashboard").addClass('active');
        $("#dashboard").addClass('active');

        $("#toolbar-terminal").removeClass('active');
        $("#terminal").removeClass('active');

        $("#toolbar-settings").removeClass('active');
        $("#settings").removeClass('active');
    });

    $("#toolbar-terminal").click(function () {
        $("#toolbar-dashboard").removeClass('active');
        $("#dashboard").removeClass('active');

        $("#toolbar-terminal").addClass('active');
        $("#terminal").addClass('active');

        $("#toolbar-settings").removeClass('active');
        $("#settings").removeClass('active');
    });

    $("#toolbar-settings").click(function () {
        $("#toolbar-dashboard").removeClass('active');
        $("#dashboard").removeClass('active');

        $("#toolbar-terminal").removeClass('active');
        $("#terminal").removeClass('active');

        $("#toolbar-settings").addClass('active');
        $("#settings").addClass('active');
    });
});