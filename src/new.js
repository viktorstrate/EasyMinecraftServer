/**
 * Logic for the new.html GUI
 */

$(document).ready(function () {
    var fs = require('fs');
    var gui = require('nw.gui');

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

    var progressBar = $("#download-progress");

    $("#btn-download").click(function () {
        var path = $("#browse-server-path-input").val();

        var downloadSize;
        var downloaded = 0;

        fs.exists(path, function (exists) {
            if (exists) {
                download.downloadLatestServer(path).progress(function (data) {

                    if (data.totalSize) {
                        downloadSize = parseInt(data.totalSize);
                    }

                    if (data.chunkSize) {
                        downloaded = downloaded + parseInt(data.chunkSize);
                    }

                    var downloadedPercent = downloaded / downloadSize * 100

                    progressBar.css('display', 'block');
                    progressBar.css('width', downloadedPercent + '%');
                    progressBar.html(Math.floor(downloadedPercent) + '%');

                }).done(function (version) {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = true;
                    localStorage.serverVersion = version;

                    console.log('Server Downloaded');
                    var notification = showNotification('Server Downloaded', 'Server successfully downloaded to: ' + path);
                    gui.Window.get().close();

                }).fail(function (msg) {

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = false;
                    alert("Error: " + msg);

                });
            }
        })
    });


});
