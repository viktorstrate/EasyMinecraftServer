/**
 * Logic for the new.html GUI
 */

var fs = require('fs');

$(document).ready(function () {
    $("#browse-server-path-button").click(function () {
        console.log("Clicked");

        var chooser = $("#browse-server-path");

        chooser.change(function (evt) {
            var path = $(this).val();
            if (path)
                $("#browse-server-path-input").val(path);
        });

        chooser.trigger('click');
    });

    $("#btn-download").click(function () {
        var path = $("#browse-server-path-input").val();

        var downloadSize;
        var downloaded;

        fs.exists(path, function (exists) {
            if (exists) {
                downloadServer('1.8.7', path).done(function () {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = true;
                    console.log('Server Downloaded');

                }).fail(function (msg) {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = false;
                    alert("Error: " + msg);

                }).progress(function (data) {
                    if (data.totalSize) {
                        downloadSize = data.totalSize;
                    }

                    if (data.progress) {
                        downloaded += data.progress;
                    }

                    console.log()
                });
            }
        })
    });


});

