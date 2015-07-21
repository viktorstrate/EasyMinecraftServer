/**
 * Handles window logic, only loaded in main window and only once.
 */

// Initializes localStorage databases, if first time opening the app
if (!localStorage.serverDownloaded) localStorage.serverDownloaded = false;
if (!localStorage.serverPath) localStorage.serverPath = null;
if (!localStorage.serverVersion) localStorage.serverVersion = null;

console.log("ServerDownloaded: " + localStorage.serverDownloaded + ", ServerPath: " + localStorage.serverPath);

// Import gui library for NW.js
var gui = require('nw.gui');

// close down the Minecraft server when you close the window.
gui.Window.get().on('close', function () {

    // if you close the window and the server is stopped, close the window
    if (server.state == server.stateType.STOPPED) {
        closeWindow();
        return;
    }

    // force closes the window after 2 sec if server isn't closed yet
    setTimeout(closeWindow, 2000);

    // Call the stopServer function from ShellHandler.js
    server.stop().done(function () {
        closeWindow();
    });


    function closeWindow() {
        // force close the window
        gui.Window.get().close(true);
    }
});

// Make the window where you download the server.
function makeWindowNew() {
    // open window with new.html as the content
    var initWindow = gui.Window.open('new.html');

    initWindow.setShowInTaskbar = false;

    // When you close the main window, close this window
    gui.Window.get().on('closed', function () {
        initWindow.close();
    });

    return initWindow;
}

var initWindow;

// Show the window where you download the server, if the server isn't downloaded
if (localStorage.serverDownloaded == 'false')
    initWindow = makeWindowNew();

// Called when you press File > New Server. Resets the program, and show "download window"
function newServer() {
    if (confirm('Are you sure? You want to make a new server')) {
        // Stop server, when done ser serverDownloaded to false, and show "download window"
        server.stop().done(function () {
            localStorage.serverDownloaded = false;
            makeWindowNew()
        });
    }
}