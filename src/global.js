/**
 * All the global variables and functions
 */

var showNotification = function (title, body) {
    var notification;
    var icon = null;

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