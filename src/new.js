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

    var progressBar = $("download-progress");

    $("#btn-download").click(function () {
        var path = $("#browse-server-path-input").val();

        var downloadSize;
        var downloaded = 0;

        fs.exists(path, function (exists) {
            if (exists) {
                downloadServer('1.8.7', path).progress(function (data) {

                    if (data.totalSize) {
                        downloadSize = parseInt(data.totalSize);
                    }

                    if (data.chunkSize) {
                        downloaded = downloaded + parseInt(data.chunkSize);
                    }

                    console.log(downloaded / downloadSize * 100);
                }).done(function () {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = true;
                    console.log('Server Downloaded');

                }).fail(function (msg) {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = false;
                    alert("Error: " + msg);

                });
            }
        })
    });


});

