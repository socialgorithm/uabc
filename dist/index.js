"use strict";
exports.__esModule = true;
var input_1 = require("./lib/input");
var OnlineClient_1 = require("./client/OnlineClient");
var options = input_1["default"]();
console.info("+-----------------------------------------+");
console.info("|     Ultimate Algorithm Battle Client    |");
console.info("+-----------------------------------------+");
var client = new OnlineClient_1["default"](options);
