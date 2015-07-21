/*
 * Class to handle the server.properties file
 */

var ServerPropertiesMaster = function () {
    var fs = require('fs');
    var serverProperties = this;

    serverProperties.values = [];

    // ###### Functions ######

    serverProperties.getFilePath = function () {
        if (process.platform == 'win32' || process.platform == 'win64') {
            return localStorage.serverPath + "\\server.properties";
        } else return localStorage.serverPath + "/server.properties";
    };

    serverProperties.loadFile = function () {
        var deferred = $.Deferred();
        fs.readFile(serverProperties.getFilePath(), {encoding: 'utf8'}, function (err, data) {
            if (err) {
                alert("Could not load server.properties: " + err);
                deferred.reject();
                return;
            }

            var lines = data.split('\n');

            for (var i = 0; i < lines.length; i++) {
                var regex = /^([a-z\-]+)=([a-zA-Z0-9 ]*)/g;
                var line = lines[i];

                var result = regex.exec(line);

                if (result != null) {
                    var key = result[1];
                    var value = result[2];

                    for (var x = 0; x < serverProperties.values.length; x++) {
                        if (serverProperties.values[x].key == key) {
                            serverProperties.values.splice(x, 1);
                        }
                    }

                    serverProperties.values.push({"key": key, "value": value});
                }
            }

            deferred.resolve();

        });

        return deferred.promise();
    };

    serverProperties.saveFile = function () {
        var deferred = new $.Deferred();
        var string = "";

        for (var i = 0; i < serverProperties.values.length; i++) {
            string += serverProperties.values[i].key + "=" + serverProperties.values[i].value + "\r\n";
        }

        console.log(string);

        fs.writeFile(serverProperties.getFilePath(), string, function (err) {
            if (err) {
                deferred.reject();
                console.log("Could not save file");
                alert("Could not save file");
            }
            deferred.resolve()
        });

        return deferred.promise();
    };

    serverProperties.loadFile();
};

var serverProperties = new ServerPropertiesMaster();
