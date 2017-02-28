/**
 * Ultimate Algorithm Battle Client
 * It will execute a given binary and communicate with it over stdin/stdout,
 * sending the commands to the game server over a socket.
 *
 * Server available at https://github.com/aurbano/ultimate-ttt-server
 */

// Parse cli input
const options = require('./lib/input')();
const exec = require('./lib/exec');
const io = require('socket.io-client');

console.info("+----------------------------------+");
console.info("|     Ultimate Algorithm Battle    |");
console.info("+----------------------------------+");

console.log();
console.log('Waiting for server...');
console.log();

// Spawn the player
try {
  const player = exec(options.file);

  const socket = io.connect('http://localhost:3141', {
    query: {
      token: options.token
    }
  });

  player.on('close', (code) => {
    console.log(`client> child process exited with code ${code}`);
    socket.disconnect();
  });

  socket.on('error', function (data) {
    console.error('Error in socket', data);
  });

  socket.on('connect', function(){
    console.log('Connected!');
  });

  socket.on('game', function (data) {
    player.stdin.write(data.action + "\n");
  });

  player.stdout.on('data', function(data) {
    socket.emit('game', data);
  });

  socket.on('disconnect', function() {
    console.log('Connection lost!');
  });
} catch (e) {
  console.error('Error running player', e);
}