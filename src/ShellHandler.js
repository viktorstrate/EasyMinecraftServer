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
    STARTING: 2,
    DOWNLOADING: 3
};
var serverState = serverStateType.STOPPED;

if (localStorage.serverDownloaded == 'true') {
    startServer();
}

// called when somthing is printed to the shell of the Minecraft server.
function onConsoleOutput(data) {
    // if server is fully started
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)) {
        serverState = serverStateType.RUNNING;

        startingServerDeferred.resolve();
        showNotification(null, 'Server Started', 'The Minecraft server started successfully!')
    }

    // if server is closed
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sShutdown\sThread\/INFO\]:\sStopping\sserver/g)) {

        serverState = serverStateType.STOPPED;

        server = null;

        stoppingServerDeferred.resolve();
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

        serverState = serverStateType.STARTING;

        server.stdout.on('data', onConsoleOutput);

        server.on('exit', function (code) {
            serverState = serverStateType.STOPPED;
            server = null;
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
    serverState = serverStateType.STOPPED;
    server = null;
}

// send Minecraft command to the server
function sendCommand(command){
    server.stdin.write(command + '\n');
    terminalPrint('> ' + command);
}