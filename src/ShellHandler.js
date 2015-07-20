/*
 * Handles the shell and the minecraft server
 */

// import shelljs, to make it easier to use the shell.
var shell = require('shelljs');

var server = null;
var startingServerDeferred;
var stoppingServerDeferred;

var serverStateType = {
    STOPPED: 0,
    RUNNING: 1,
    STARTING: 2
};

/**
 * @param stateType serverStateType
 * @return {string} state text
 */
function getStateText(stateType) {
    var text = "";
    switch (stateType) {
        case serverStateType.STOPPED:
            text = "Stopped";
            break;
        case serverStateType.RUNNING:
            text = "Running";
            break;
        case serverStateType.STARTING:
            text = "Starting";
            break;
    }

    return text;
}

var serverStateChangeCallbacks = [];
setServerState(serverStateType.STARTING);

/**
 * Set the state of the server
 * @param stateType serverStateType
 */
function setServerState(stateType) {
    serverState = stateType;
    for (var i = 0; i < serverStateChangeCallbacks.length; i++) {
        serverStateChangeCallbacks[i](stateType);
    }
}

function onServerStateChange(callback) {
    serverStateChangeCallbacks.push(callback);
}

if (localStorage.serverDownloaded == 'true') {
    startServer();
}

var playersOnline = [];
var serverPlayerJoinedCallbacks = [];
var serverPlayerLeftCallback = [];

function onPlayerJoined(callback) {
    serverPlayerJoinedCallbacks.push(callback);
}

function onPlayerLeft(callback) {
    serverPlayerLeftCallback.push(callback);
}

// called when somthing is printed to the shell of the Minecraft server.
function onConsoleOutput(data) {
    // if server is fully started
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)) {
        setServerState(serverStateType.RUNNING);

        startingServerDeferred.resolve();
        showNotification('Server Started', 'The Minecraft server started successfully!')
    }

    // if server is closed
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sShutdown\sThread\/INFO\]:\sStopping\sserver/g)) {

        setServerState(serverStateType.STOPPED);

        server = null;

        stoppingServerDeferred.resolve();
    }

    // if player joined
    if (data.match(/\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s.*\slogged\sin\swith\sentity\sid\s\d+/g)) {

        var findRegex = /\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\[.+\]\slogged\sin\swith\sentity\sid\s\d*/g;
        var username = findRegex.exec(data)[1];

        for (var i = 0; i < serverPlayerJoinedCallbacks.length; i++) {
            serverPlayerJoinedCallbacks[i](username);
        }

        console.log("User joined: " + username);

    }

    // if player left
    if (data.match(/\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\slost\sconnection/g)) {
        var findRegex = /\[\d+:\d+:\d+\]\s\[Server\sthread\/INFO\]:\s([a-zA-Z0-9_]+)\slost\sconnection/g;
        var username = findRegex.exec(data)[1];

        for (var i = 0; i < serverPlayerLeftCallback.length; i++) {
            serverPlayerLeftCallback[i](username);
        }

        console.log("User left: " + username);
    }

    console.log(data);

    // print the text to the terminal window, function found in terminal.js
    terminalPrint(data);
}

function startServer() {

    startingServerDeferred = new $.Deferred();

    if (server == null) {

        // changes directory to the server directory
        shell.cd(localStorage.serverPath);

        console.log(shell.pwd());

        // runs the minecraft server and puts the process in the variable server
        server = shell.exec('java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui', {async: true});

        // sets the encoding for inputs
        server.stdin.setEncoding('utf8');

        setServerState(serverStateType.STARTING);

        server.stdout.on('data', onConsoleOutput);

        server.on('exit', function (code) {
            setServerState(serverStateType.STOPPED);
            server = null;
            playersOnline = [];
            stoppingServerDeferred.resolve();
        });

        console.log("Starting server");
    }

    return startingServerDeferred.promise();
}

function stopServer() {

    stoppingServerDeferred = new $.Deferred();

    // if server already stopped call done function
    if (serverState == serverStateType.STOPPED) {
        stoppingServerDeferred.reject('Server already stopped!');
    } else { // else stop server and add done function to the shutdown listeners
        sendCommand('stop');
    }

    return stoppingServerDeferred.promise();

}

function killServer() {
    server.kill();
    setServerState(serverStateType.STOPPED);
    server = null;
}

// send Minecraft command to the server
function sendCommand(command){
    server.stdin.write(command + '\n');
    terminalPrint('> ' + command);
}