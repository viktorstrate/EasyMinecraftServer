/*
 * Handles the shell and the minecraft server
 */

// import shelljs, to make it easier to use the shell.
var shell = require('shelljs');

// changes directory to the server directory
shell.cd('server');

var server = null;

// an array for all the functions to call when the server stops
var shutdownListeners = [];
var startupListeners = [];

var serverStateType = {
    STOPPED: 0,
    RUNNING: 1,
    STARTING: 2,
    DOWNLOADING: 3
};
var serverState = serverStateType.STOPPED;

serverDownloaded(function (err, downloaded) {
    if (downloaded)
        startServer();
});

// called when somthing is printed to the shell of the Minecraft server.
function onConsoleOutput(data) {
    // if server is fully started
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)) {
        serverState = serverStateType.RUNNING;
        // loops through startupListeners and calls the functions inside
        for (var i = 0; i < startupListeners.length; i++) {
            startupListeners[i]();
        }
    }

    // if server is closed
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sShutdown\sThread\/INFO\]:\sStopping\sserver/g)) {

        serverState = serverStateType.STOPPED;
        // loops through shutdownListeners and calls the functions inside
        for (var i = 0; i < shutdownListeners.length; i++) {
            console.log("HER");
            shutdownListeners[i]();
        }
        shutdownListeners = [];
        server = null;
    }

    console.log(data);

    // print the text to the terminal window, function found in terminal.js
    terminalPrint(data);
}

function startServer(callback) {
    if (server == null) {

        // runs the minecraft server and puts the process in the variable server
        server = shell.exec('java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui', {async: true});

        // sets the encoding for inputs
        server.stdin.setEncoding('utf8');

        serverState = serverStateType.STARTING;

        server.stdout.on('data', onConsoleOutput);

        console.log("Starting server");
    }
}

function stopServer(callback) {

    // if server already stopped call done function
    if (serverState == serverStateType.STOPPED) {
        callback();
    } else { // else stop server and add done function to the shutdown listeners
        sendCommand('stop');

        if (callback) {
            // add the done function to the shutdownListeners, to be ran when the server is fully closed.
            shutdownListeners.push(callback);
        }
    }

}

function killServer() {
    server.kill();
    serverState = serverStateType.STOPPED;
    server = null;
}

// send Minecraft command to the server
function sendCommand(command){
    server.stdin.write(command + '\n');
    terminalPrint('> ' + command);
}