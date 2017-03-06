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
const fileLoggerModule = require('./lib/log-file');
const consoleLogger = require('./lib/log-console');

main();

function main() {
  console.info("+----------------------------------+");
  console.info("|     Ultimate Algorithm Battle    |");
  console.info("+----------------------------------+");

  // Init logger
  let fileLogger;
  if (options.log) {
    if (options.log.length > 0) {
      fileLogger = fileLoggerModule(options.log);
    } else {
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /, '_');
      fileLogger = fileLoggerModule('uabc-' + date + '.log');
    }
  }

  console.log();
  console.log('Waiting for server...');
  console.log();

  function log(writer, data) {
    if (options.verbose) {
      consoleLogger(writer, data);
    }
    if (options.log) {
      fileLogger(writer, data);
    }
  }

  // Spawn the player
  try {
    const player = exec(options.file);
    let host = options.host || 'localhost:3141';
    if (host.substr(0,4) !== 'http') {
      host = 'http://' + host;
    }

    const socket = io.connect(host, {
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
      log('server', data.action);
      if (data.action && data.action.length > 0) {
        const parts = data.action.split(' ');
        if (parts[0] === 'end') {
          console.log('Games ended! You ' + parts[1]);
        } else {
          player.stdin.write(data.action + "\n");
        }
      }
    });

    player.stdout.on('data', function(data) {
      log('player', data);
      socket.emit('game', data);
    });

    socket.on('disconnect', function() {
      console.log('Connection lost!');
    });
  } catch (e) {
    console.error('Error running player', e);
  }
}