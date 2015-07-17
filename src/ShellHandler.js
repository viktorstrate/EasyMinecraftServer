/*
 * Handles the shell and the minecraft server
 */

// import shelljs, to make it easier to use the shell.
var shell = require('shelljs');

// changes directory to the server directory
shell.cd('server');

// runs the minecraft server and puts the process in the variable server
var server = shell.exec('java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui', {async:true});

// sets the encoding for inputs
server.stdin.setEncoding('utf8');

// an array for all the functions to call when the server stops
var shutdownListeners = [];

// called when somthing is printed to the shell of the Minecraft server.
server.stdout.on('data', function(data) {
    // if server is started up
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)) {

    }

    // if server is closed
    if (data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server\sShutdown\sThread\/INFO\]:\sStopping\sserver/g)) {
        // loops through shutdownListeners and calls the functions inside
        for (var i = 0; i < shutdownListeners.length; i++) {
            shutdownListeners[i]();
        }
    }

    console.log(data);

    // print the text to the terminal window, function found in terminal.js
    terminal_print(data);

});

function stopServer(done) {
    sendCommand('stop');
    // add the done function to the shutdownListeners, to be ran when the server is fully closed.
    shutdownListeners.push(done);
}

// send Minecraft command to the server
function sendCommand(command){
  server.stdin.write(command+'\n');
}