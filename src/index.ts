/**
 * Ultimate Algorithm Battle Client
 * It will execute a given binary and communicate with it over stdin/stdout,
 * sending the commands to the game server over a socket.
 *
 * Server available at https://github.com/aurbano/ultimate-ttt-server
 */

// Parse cli input
import parseOptions from './lib/input';
import exec from './lib/exec';
import * as io from 'socket.io-client';
import FileLogger from './lib/FileLogger';
import ConsoleLogger from './lib/ConsoleLogger';
import RandomPlayer from './sample/random';

main();

function main() {
  // Read command line options
  const options = parseOptions();

  console.info("+----------------------------------+");
  console.info("|     Ultimate Algorithm Battle    |");
  console.info("+----------------------------------+");

  // Init loggers
  let fileLogger: FileLogger;
  if (options.log) {
    if (options.log.length > 0) {
      fileLogger = new FileLogger(options.log);
    } else {
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /, '_');
      fileLogger = new FileLogger('uabc-' + date + '.log');
    }
  }

  let practiceGame: RandomPlayer = null;
  // If we're on practice mode, load a local game
  if (options.practice) {
    practiceGame = new RandomPlayer(1);
  }

  console.log();
  console.log('Waiting for server...');
  console.log();

  function log(writer: string, data: string) {
    if (options.verbose) {
      ConsoleLogger.log(writer, data);
    }
    if (options.log) {
      fileLogger.log(writer, data);
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

    player.on('close', (code: string) => {
      console.log(`client> child process exited with code ${code}`);
      socket.disconnect();
    });

    socket.on('error', (data: any) => {
      console.error('Error in socket', data);
    });

    socket.on('connect', () => {
      console.log('Connected!');
    });

    socket.on('game', (data: any) => {
      log('server', data.action);
      if (data.action && data.action.length > 0) {
        const parts = data.action.split(' ');
        if (parts[0] === 'end') {
          console.log('Games ended! You ' + parts[1]);
        } else {
          player.stdin.write(data.action + "\n");
          if (parts[0] === 'init') {
            practiceGame.init();
          }
        }
      }
    });

    player.stdout.on('data', (data: any) => {
      log('player', data);
      if (!options.practice) {
        socket.emit('game', data);
      } else {
        // practice mode, add move to local game

      }
    });

    socket.on('disconnect', function() {
      console.log('Connection lost!');
    });
  } catch (e) {
    console.error('Error running player', e);
  }
}