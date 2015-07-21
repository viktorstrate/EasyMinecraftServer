/*
 * Handles downloading of server jar's
 */

var DownloadObject = function () {

    // To access this in other functions inside this function
    var download = this;

    var request = require("request"),
        minecraftServerUrl = "http://s3.amazonaws.com/Minecraft.Download/versions/",
        http = require('http'),
        fs = require('fs');

    /**
     * Gets all the versions of minecraft servers, as json
     * @param callback all the versions as json.
     */
    download.getServerVersions = function (callback) {
        request(minecraftServerUrl + "versions.json", callback);
    };

    /**
     *
     * @param version the desired Minecraft version as a string eg. 1.2.3
     * @returns {string}
     */
    download.getServerVersionUrl = function (version) {
        return minecraftServerUrl + version + '/minecraft_server.' + version + '.jar';
    };

    /**
     * Downloads a Minecraft server jar to a folder
     * @param version version the desired Minecraft version as a string eg. 1.2.3
     * @param path the path to download to.
     * @returns {*}
     */
    download.downloadServer = function (version, path) {
        deferred = $.Deferred();

        var file = fs.createWriteStream(path + '/minecraft_server.jar');

        http.get(download.getServerVersionUrl(version), function (response) {
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
    };

    var downloadVersion;
    /**
     * downloads the latest Minecraft server jar
     * @param path the path to download to.
     * @returns {deferred.promise}
     */
    download.downloadLatestServer = function (path) {
        var deferred = $.Deferred();

        download.getServerVersions(function (err, response, body) {
            if (err) {
                deferred.reject(err);
                return;
            }

            if (response.statusCode == 200) {
                var data = JSON.parse(body);
                downloadVersion = data.latest.release;
                download.downloadServer(data.latest.release, path).progress(function (data) {

                    deferred.notify(data);

                }).done(function () {

                    deferred.resolve(downloadVersion);

                }).fail(function (msg) {

                    deferred.reject(msg);

                });

            }

        });

        return deferred.promise();
    };

};

var download = new DownloadObject();