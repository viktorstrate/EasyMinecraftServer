/**
 * Handles downloading of server jar's
 */

var request = require("request"),
    minecraftServerUrl = "https://s3.amazonaws.com/Minecraft.Download/versions/";

function getServerVersionList(callback) {
    request(minecraftServerUrl + "versions.json", callback);
}

function getServerVersionUrl(version) {
    return minecraftServerUrl + version + '/minecraft_server.' + version + '.jar';
}