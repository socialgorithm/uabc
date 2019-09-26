/**
 * Ultimate Algorithm Battle Client
 *
 * It will execute a given binary and communicate with it over stdin/stdout,
 * then send the commands to a tournament/game server.
 *
 * Documentation https://socialgorithm.org/docs
 * Server https://github.com/socialgorithm/tournament-server
 */

import parseOptions from "./cli/options";
import OnlineClient from "./client/OnlineClient";
import PracticeClient from "./client/PracticeClient";

const options = parseOptions();

console.info("+-----------------------------------------+");
console.info("|     Ultimate Algorithm Battle Client    |");
console.info("+-----------------------------------------+");

if (options.practice) {
    const client = new PracticeClient(options);
} else {
    const client = new OnlineClient(options);
}
