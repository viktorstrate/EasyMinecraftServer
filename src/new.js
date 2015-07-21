/**
 * Logic for the new.html GUI
 */

$(document).ready(function () {
    var fs = require('fs');
    var gui = require('nw.gui');

    // When Browse button is clicked, show browse folder window.
    $("#browse-server-path-button").click(function () {

        var chooser = $("#browse-server-path");

        chooser.change(function (evt) {
            var path = $(this).val();
            if (path)
                $("#browse-server-path-input").val(path);
        });

        chooser.trigger('click');
    });

    // grab the progressBar that shows how long the download progress is.
    var progressBar = $("#download-progress");

    // When you click the Download button
    $("#btn-download").click(function () {

        // Path is the value of server path input field
        var path = $("#browse-server-path-input").val();

        var downloadSize;
        var downloaded = 0;

        // Check if the path exists on the hard drive
        fs.exists(path, function (exists) {
            // if exists, download latest server, to the path provided.
            if (exists) {
                // Every time you get data from the download pipe.
                download.downloadLatestServer(path).progress(function (data) {

                    // if got the totalSize of the file, save the size in a variable, only called once pr download,
                    // and in first packet
                    if (data.totalSize) {
                        downloadSize = parseInt(data.totalSize);
                    }

                    // if got chunk size add it to the downloaded variable
                    if (data.chunkSize) {
                        downloaded = downloaded + parseInt(data.chunkSize);
                    }

                    // calculate downloaded in percent
                    var downloadedPercent = downloaded / downloadSize * 100;

                    // add the downloaded percent to the progressbar
                    progressBar.css('display', 'block');
                    progressBar.css('width', downloadedPercent + '%');
                    progressBar.html(Math.floor(downloadedPercent) + '%');

                }).done(function (version) { // when done downloading

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = true;
                    localStorage.serverVersion = version;

                    console.log('Server Downloaded');
                    // show notification saying the server is downloaded
                    var notification = showNotification('Server Downloaded', 'Server successfully downloaded to: ' + path);
                    // close download window
                    gui.Window.get().close();

                }).fail(function (msg) { // when failed downloading

                    localStorage.serverPath = path;
                    localStorage.serverDownloaded = false;
                    alert("Error: " + msg);

                });
            }
        })
    });


});
