var shell = require('shelljs');

shell.cd('server');
var server = shell.exec('java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui', {async:true});

server.stdin.setEncoding('utf8');

server.stdout.on('data', function(data) {
  // If received 'Done' message
  if(data.match(/\[\d{2}:\d{2}:\d{2}]\s\[Server thread\/INFO]:\sDone\s\([0-9\.]+s\)!/g)){
    console.log("It's done");

    sendCommand('help');

    setTimeout(function(){
      sendCommand('op viktorstrate');
    }, 10000);
  }
});

function sendCommand(command){
  server.stdin.write(command+'\n');
}