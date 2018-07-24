"use strict";
exports.__esModule = true;
var input_1 = require("./lib/input");
var PracticeClient_1 = require("./client/PracticeClient");
var OnlineClient_1 = require("./client/OnlineClient");
var options = input_1["default"]();
console.info("+----------------------------------+");
console.info("|     Ultimate Algorithm Battle    |");
console.info("+----------------------------------+");
var client;
if (options.practice) {
    client = new PracticeClient_1["default"](options);
}
else {
    client = new OnlineClient_1["default"](options);
}
