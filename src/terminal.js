/*
 * Functions for the terminal view
 */

/**
 * Print text to the terminal window
 * @param str the text to print
 */
function terminalPrint(str) {
    var text = htmlDecode(str);
    text = text.split("\n");
    text.forEach(function (element, index, array) {
        $("#console-window-text").append("<p>" + element + "</p>");
    });

    // Smoothly scrolls down the terminal
    var scr = $('#terminal-window')[0].scrollHeight;
    $('#terminal-window').animate({scrollTop: scr}, 200);
}

// Sends command to server when enter is pressed
$(document).ready(function () {
    $("#terminal-input").keypress(function (e) {
        if (e.which == 13) { // Enter key
            sendCommand($('#terminal-input').val());
            $('#terminal-input').val('')
        }
    });
});

/**
 * removes html tags from text
 * @param value text with html tags
 * @returns string converted text
 */
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}