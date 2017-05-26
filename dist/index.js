"use strict";
exports.__esModule = true;
var input_1 = require("./lib/input");
var OnlineClient_1 = require("./OnlineClient");
var PracticeClient_1 = require("./PracticeClient");
var options = input_1["default"]();
console.info("+----------------------------------+");
console.info("|     Ultimate Algorithm Battle    |");
console.info("+----------------------------------+");
if (!options.practice) {
    new OnlineClient_1["default"](options);
}
else {
    new PracticeClient_1["default"](options);
}
