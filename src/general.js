/*
 * General GUI code
 */

// Import gui library for NW.js
var gui = require('nw.gui');

// close down the Minecraft server when you close the window.
gui.Window.get().on('close', function () {

    // force closes the window after 2 sec if server isn't closed yet
    setTimeout(closeWindow, 2000);

    // Call the stopServer function from ShellHandler.js
    stopServer(closeWindow);


    function closeWindow() {
        gui.Window.get().close(true);
    }
});

startupListeners.push(function () {
    showNotification(null, 'Server Started', 'The Minecraft server started successfully!')
});

var showNotification = function (icon, title, body) {
    var notification;

    if (icon && icon.match(/^\./)) {
        icon = icon.replace('.', 'file://' + process.cwd());
        notification = new Notification(title, {icon: icon, body: body});
    }

    notification = new Notification(title, {body: body});

    notification.onclick = function () {
        NW.Window.get().focus();
    };

    return notification;
};

function makeInitWindow() {
    var initWindow = gui.Window.open('init.html');
    initWindow.title = 'Easy Minecraft Server - Initial Setup';
    initWindow.setShowInTaskbar = false;

    gui.Window.get().on('closed', function () {
        initWindow.close();
    });

    return initWindow;
}

serverDownloaded(function (err, downloaded) {
    if (!downloaded) {
        var initWindow = makeInitWindow();
    }
});

