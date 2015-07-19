/*
 * General GUI code
 */

if (!localStorage.serverDownloaded) localStorage.serverDownloaded = false;
if (!localStorage.serverPath) localStorage.serverPath = null;

console.log("ServerDownloaded: " + localStorage.serverDownloaded + ", ServerPath: " + localStorage.serverPath);

// Import gui library for NW.js
var gui = require('nw.gui');

// close down the Minecraft server when you close the window.
gui.Window.get().on('close', function () {

    localStorage.serverDownloaded = false;

    if (serverState == serverStateType.STOPPED) {
        closeWindow();
        return;
    }

    // force closes the window after 2 sec if server isn't closed yet
    setTimeout(closeWindow, 2000);

    // Call the stopServer function from ShellHandler.js
    stopServer(closeWindow);


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

