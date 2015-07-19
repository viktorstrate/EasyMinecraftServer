/**
 * Handles downloading of server jar's
 */

var request = require("request"),
    minecraftServerUrl = "http://s3.amazonaws.com/Minecraft.Download/versions/",
    http = require('http'),
    fs = require('fs');

function getServerVersionList(callback) {
    request(minecraftServerUrl + "versions.json", callback);
}

function getServerVersionUrl(version) {
    return minecraftServerUrl + version + '/minecraft_server.' + version + '.jar';
}