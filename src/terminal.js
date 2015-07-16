/*
 * Functions for the terminal view
 */

/**
 * Print text to the terminal window
 * @param str the text to print
 */
function terminal_print(str) {
    var text = htmlDecode(str);
    text = text.split("\n");
    text.forEach(function (element, index, array) {
        $("#console-window-text").append("<p>" + element + "</p>");
    });
}

/**
 * removes html tags from text
 * @param value text with html tags
 * @returns string converted text
 */
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}