/**
 * Ultimate Algorithm Battle Client
 *
 * It will execute a given binary and communicate with it over stdin/stdout,
 * then send the commands to the server or to a local instance of a player
 * depending on the game mode.
 *
 * Server available at https://github.com/aurbano/ultimate-ttt-server
 */

// Parse cli input
import parseOptions from './lib/input';
import OnlineClient from "./OnlineClient";

// Read command line options
const options = parseOptions();

console.info("+----------------------------------+");
console.info("|     Ultimate Algorithm Battle    |");
console.info("+----------------------------------+");

if (!options.practice) {
  new OnlineClient(options);
}