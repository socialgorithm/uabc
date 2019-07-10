/**
 * Ultimate Algorithm Battle Client
 *
 * It will execute a given binary and communicate with it over stdin/stdout,
 * then send the commands to a tournament/game server.
 *
 * Server available at https://github.com/socialgorithm/tournament-server
 */

import parseOptions from "./cli/options";
import OnlineClient from "./client/OnlineClient";

const options = parseOptions();

console.info("+-----------------------------------------+");
console.info("|     Ultimate Algorithm Battle Client    |");
console.info("+-----------------------------------------+");

const client = new OnlineClient(options);
