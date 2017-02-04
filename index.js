/**
 * Ultimate Algorithm Battle Client
 * It will execute a given binary and communicate with it over stdin/stdout,
 * sending the commands to the game server over a socket.
 *
 * Server available at https://github.com/aurbano/ultimate-ttt-server
 */

// Parse cli input
const options = require('./lib/input')();

console.info("+----------------------------------+");
console.info("|     Ultimate Algorithm Battle    |");
console.info("+----------------------------------+");

console.log('Starting with options: ', options);