/*
 * Handles the shell and the Minecraft server
 */

var ServerObject = function () {

    var server = this;

    // ###### FUNCTIONS ######

    // ## State functions ##
    /**
     * Set the state of the server
     * @param stateType serverStateType
     */
    server.setState = function (stateType) {
        server.state = stateType;
        for (var i = 0; i < serverStateChangeCallbacks.length; i++) {
            serverStateChangeCallbacks[i](stateType);
        }
    };

    server.stateType = {
        STOPPED: 0,
        RUNNING: 1,
        STARTING: 2
    };

    /**
     * @param stateType serverStateType
     * @return {string} state text
     */
    server.getStateText = function (stateType) {
        var text = "";
        switch (stateType) {
            case server.stateType.STOPPED:
                text = "Stopped";
                break;
            case server.stateType.RUNNING:
                text = "Running";
                break;
            case server.stateType.STARTING:
                text = "Starting";
                break;
        }

        return text;
    };

    // ### Events ###

    server.onStateChange = function (callback) {
        serverStateChangeCallbacks.push(callback);
    };

    server.onPlayerJoin = function (callback) {
        serverPlayerJoinedCallbacks.push(callback);
    };

    server.onPlayerLeave = function (callback) {
        serverPlayerLeftCallback.push(callback);
    };

    // ## Server Management ##

    server.start = function () {

        startingServerDeferred = new $.Deferred();

        if (server.process == null) {

            // changes directory to the server directory
            shell.cd(localStorage.serverPath);

            console.log(shell.pwd());

            // runs the minecraft server and puts the process in the variable server
            server.process = shell.exec('java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui', {async: true});

            // sets the encoding for inputs
            server.process.stdin.setEncoding('utf8');

            server.setState(server.stateType.STARTING);

            server.process.stdout.on('data', onConsoleOutput);

            server.process.on('exit', function (code) {
                server.setState(server.stateType.STOPPED);
                server.process = null;
                server.playersOnline = [];
                if (stoppingServerDeferred)
                    stoppingServerDeferred.resolve();
            });

            console.log("Starting server");
        }

        return startingServerDeferred.promise();
    };

    server.stop = function () {

        stoppingServerDeferred = new $.Deferred();

        // if server already stopped call done function
        if (server.state == server.stateType.STOPPED) {
            stoppingServerDeferred.resolve('Server already stopped!');
        } else { // else stop server and add done function to the shutdown listeners
            server.sendCommand('stop');
        }

        return stoppingServerDeferred.promise();

    };

    server.kill = function () {
        server.process.kill();
        server.setState(server.stateType.STOPPED);
        server.process = null;
    };

    server.restart = function () {
        server.stop().done(function () {
            setTimeout(function () {
                server.start()
            }, 4000);
        });
    };

    // ###### SETUP ######

    // import shell.js, to make it easier to use the shell.
    var shell = require('shelljs');

    server.process = null;
    var startingServerDeferred;
    var stoppingServerDeferred;

    var serverStateChangeCallbacks = [];


    if (localStorage.serverDownloaded == 'true') {
        server.start();
    }

    server.playersOnline = [];
    var serverPlayerJoinedCallbacks = [];
    var serverPlayerLeftCallback = [];

    // called when something is printed to the shell of the Minecraft server.
    function onConsoleOutput(data) {
        // if server is fully started
        if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)) {
            server.setState(server.stateType.RUNNING);

            startingServerDeferred.resolve();
            showNotification('Server Started', 'The Minecraft server started successfully!')

            serverProperties.loadFile().done(function () {
                serverProperties.saveFile();

            });
        }

        // if server is closed
        if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sShutdown\sThread\/INFO\]:\sStopping\sserver/g)) {

            server.setState(server.stateType.STOPPED);

            server.process = null;

            if (stoppingServerDeferred)
                stoppingServerDeferred.resolve();
        }

        // if player joined
        if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sthread\/INFO\]:\s.*\slogged\sin\swith\sentity\sid\s\d+/g)) {

            var findRegex = /\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\[.+\]\slogged\sin\swith\sentity\sid\s\d*/g;
            var username = findRegex.exec(data)[1];

            for (var i = 0; i < serverPlayerJoinedCallbacks.length; i++) {
                serverPlayerJoinedCallbacks[i](username);
            }

            console.log("User joined: " + username);

        }

        // if player left
        if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\slost\sconnection/g)) {
            var findRegex = /\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\slost\sconnection/g;
            var username = findRegex.exec(data)[1];

            for (var i = 0; i < serverPlayerLeftCallback.length; i++) {
                serverPlayerLeftCallback[i](username);
            }

            console.log("User left: " + username);
        }

        // print the text to the terminal window, function found in terminal.js
        terminalPrint(data);
    }


    // send Minecraft command to the server
    server.sendCommand = function (command) {
        server.process.stdin.write(command + '\n');
        terminalPrint('> ' + command);
    }
};

var server = new ServerObject();
