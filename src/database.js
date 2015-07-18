/**
 * Sets up the database
 */

var db = openDatabase('data', '1.0', 'Easy Minecraft Server Database', 2 * 1024 * 1024);

db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id int UNIQUE, serverLocation varchar(127), serverDownloaded int(1))');
    tx.executeSql('SELECT * FROM settings', [], function (tx, results) {
        if (results.rows.length == 0) {
            console.log('Added default row to db');
            tx.executeSql('INSERT INTO settings (serverLocation, serverDownloaded) VALUES (\'\', 0)');
        }
    });
});

/**
 * Returns if the server is downloaded or not
 * @param callback function(err, data)
 */
function serverDownloaded(callback) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT serverDownloaded FROM settings', [], function (tx, results) {

            var text = results.rows.item(0).serverDownloaded;

            console.log('Server Downloaded: ' + text);

            if (text == 0)
                callback(null, false);
            else
                callback(null, true);

        })
    });
}

serverDownloaded(function (err, data) {
    console.log("Server Downloaded: " + data);
});
