/**
 * Handles window logic, only loaded in main window and only once.
 */

if (!localStorage.serverDownloaded) localStorage.serverDownloaded = false;
if (!localStorage.serverPath) localStorage.serverPath = null;
if (!localStorage.serverVersion) localStorage.serverVersion = null;

console.log("ServerDownloaded: " + localStorage.serverDownloaded + ", ServerPath: " + localStorage.serverPath);

// Import gui library for NW.js
var gui = require('nw.gui');

// close down the Minecraft server when you close the window.
gui.Window.get().on('close', function () {

    if (serverState == serverStateType.STOPPED) {
        closeWindow();
        return;
    }

    // force closes the window after 2 sec if server isn't closed yet
    setTimeout(closeWindow, 2000);

    // Call the stopServer function from ShellHandler.js
    stopServer().done(function () {
        closeWindow();
    });


    function closeWindow() {
        gui.Window.get().close(true);
    }
});

function makeWindowNew() {
    var initWindow = gui.Window.open('new.html');

    initWindow.setShowInTaskbar = false;

    gui.Window.get().on('closed', function () {
        initWindow.close();
    });

    return initWindow;
}

var initWindow;

if (localStorage.serverDownloaded == 'false')
    initWindow = makeWindowNew();
