/**
 * Handles downloading of server jar's
 */

var request = require("request"),
    minecraftServerUrl = "http://s3.amazonaws.com/Minecraft.Download/versions/",
    http = require('http'),
    fs = require('fs');

function getServerVersionList(callback) {
    request(minecraftServerUrl + "versions.json", callback);
}

function getServerVersionUrl(version) {
    return minecraftServerUrl + version + '/minecraft_server.' + version + '.jar';
}

function downloadServer(version, path) {
    deferred = $.Deferred();

    var file = fs.createWriteStream(path + '/minecraft_server.jar');

    http.get(getServerVersionUrl(version), function (response) {
        var length = response.headers['content-length'];
        console.log(length);
        deferred.notify({totalSize: length});

        response.on('data', function (chunk) {
            console.log('got %d bytes of data out of %d', chunk.length, length);
            deferred.notify({chunkSize: chunk.length});
        });
        response.pipe(file);
    }).on('error', function (e) {
        deferred.reject(e.message);
    }).on('close', function () {
        deferred.resolve();
    });

    return deferred.promise();
}

function downloadLatestServer(path) {
    var deferred = $.Deferred();

    getServerVersionList(function (err, response, body) {
        if (err) {
            deferred.reject(err);
            return;
        }

        if (response.statusCode == 200) {
            var data = JSON.parse(body);

            downloadServer(data.latest.release, path).progress(function (data) {

                deferred.notify(data);

            }).done(function () {

                deferred.resolve();

            }).fail(function (msg) {

                deferred.reject(msg);

            });

        }

    });

    return deferred.promise();
}