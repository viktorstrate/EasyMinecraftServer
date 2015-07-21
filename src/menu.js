/*
 * Adds a menu on the top of the window
 * More information: https://github.com/nwjs/nw.js/wiki/Window-menu
 */


var MenuUpdate = function () {

    var gui = require('nw.gui');


    var windowMenu = new gui.Menu({type: 'menubar'});

    var fileMenu = new gui.Menu();
    fileMenu.append(new gui.MenuItem({label: 'New Server'}));

    fileMenu.items[0].click = function () {
        newServer();
    };

    windowMenu.append(new gui.MenuItem({
        label: 'File',
        submenu: fileMenu
    }));

    var serverMenu = new gui.Menu();
    serverMenu.append(new gui.MenuItem({label: 'Start'}));
    serverMenu.append(new gui.MenuItem({label: 'Stop'}));
    serverMenu.append(new gui.MenuItem({label: 'Restart'}));
    serverMenu.append(new gui.MenuItem({label: 'Force Stop'}));

    serverMenu.items[0].click = function () {
        server.start();
    };

    serverMenu.items[1].click = function () {
        server.stop();
    };

    serverMenu.items[2].click = function () {
        server.restart();
    };

    serverMenu.items[3].click = function () {
        server.forceStopServer()
    };

    windowMenu.append(new gui.MenuItem({
        label: 'Server',
        submenu: serverMenu
    }));

    gui.Window.get().menu = windowMenu;

};

var menu = new MenuUpdate();