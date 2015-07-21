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

    var fileLoadListeners = [];
    serverProperties.onFileLoaded = function (callback) {
        fileLoadListeners.push(callback);
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

            for (var y = 0; y < fileLoadListeners.length; y++) {
                fileLoadListeners[y]();
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

    serverProperties.angular = function ($scope) {
        if (!$scope) {
            console.log("$scope not defined!");
            return;
        }

        serverProperties.onFileLoaded(function () {
            for (var i = 0; i < serverProperties.values.length; i++) {
                var key = serverProperties.values[i].key;
                var value = serverProperties.values[i].value;

                switch (key) {
                    case "server-port":
                        $scope.serverPort = value;
                        break;
                    case "difficulty":
                        $scope.difficulty = value;
                        break;
                    case "max-players":
                        $scope.maxPlayers = value;
                        break;
                    case "motd":
                        $scope.motd = value;
                        break;
                    case "gamemode":
                        $scope.gamemode = value;
                        break;
                    case "pvp":
                        $scope.pvp = value;
                        break;
                    case "force-gamemode":
                        $scope.forceGamemode = value;
                        break;
                    case "announce-player-achievements":
                        $scope.showAchievements = value;
                        break;
                    case "spawn-animals":
                        $scope.spawnAnimals = value;
                        break;
                    case "spawn-monsters":
                        $scope.spawnMonsters = value;
                        break;
                    case "spawn-npcs":
                        $scope.spawnNpcs = value;
                        break;
                    case "level-name":
                        $scope.levelName = value;
                        break;
                    case "level-seed":
                        $scope.levelSeed = value;
                        break;
                    case "level-type":
                        $scope.levelType = value;
                        break;
                    case "allow-nether":
                        $scope.allowNether = value;
                        break;
                    case "enable-command-block":
                        $scope.enableCommandBlock = value;
                        break;
                    case "hardcore":
                        $scope.hardcore = value;
                        break;
                    case "view-distance":
                        $scope.viewDistance = value;
                        break;
                    case "player-idle-timeout":
                        $scope.playerIdleTimeout = value;
                        break;
                    case "op-permission":
                        $scope.opPermission = value;
                        break;
                    case "max-build-height":
                        $scope.maxBuildHeight = value;
                        break;
                    case "max-world-size":
                        $scope.maxWorldSize = value;
                        break;
                    case "max-tick-time":
                        $scope.maxTickTime = value;
                        break;
                    case "generate-structures":
                        $scope.generateStructures = value;
                        break;
                    case "server-ip":
                        $scope.serverIp = value;
                        break;
                    case "allow-flight":
                        $scope.allowFlight = value;
                        break;
                    case "spawn-protection":
                        $scope.spawnProtection = value;
                        break;
                    case "resource-pack":
                        $scope.resourcePack = value;
                        break;
                    case "resource-pack-hash":
                        $scope.resourcePackHach = value;
                        break;
                    case "generator-settings":
                        $scope.generatorSettings = value;
                        break;
                    case "enable-query":
                        $scope.enableQuery = value;
                        break;
                    case "query-port":
                        $scope.queryPort = value;
                        break;
                    case "online-mode":
                        $scope.onlineMode = value;
                        break;
                    case "enable-rcon":
                        $scope.enableRcon = value;
                        break;
                    case "enable-snooper":
                        $scope.enableSnooper = value;
                        break;
                    case "network-compression-threshold":
                        $scope.networkCompression = value;
                        break;
                    default:
                        break;
                }

                $scope.$apply();

            }
        });

    };
};

var serverProperties = new ServerPropertiesMaster();
