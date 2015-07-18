/**
 * Logic for the new.html GUI
 */

$(document).ready(function () {
    $("#browse-server-path-button").click(function () {
        console.log("Clicked");

        var chooser = $("#browse-server-path");

        chooser.change(function (evt) {
            var path = $(this).val();
            $("#browse-server-path-input").val(path);
        });

        chooser.trigger('click');
    });
});

