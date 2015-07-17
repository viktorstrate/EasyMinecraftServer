/*
 * General GUI code
 */

// Import gui library for NW.js
var gui = require('nw.gui');

// close down the Minecraft server when you close the window.
gui.Window.get().on('close', function () {

    // force closes the window after 2 sec if server isn't closed yet
    setTimeout(closeWindow, 2000);
    setTimeout(killServer(), 10000);

    // Call the stopServer function from ShellHandler.js
    stopServer(closeWindow);


    function closeWindow() {
        gui.Window.get().close(true);
    }
});