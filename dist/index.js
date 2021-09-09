"use strict";
exports.__esModule = true;
var options_1 = require("./cli/options");
var OnlineClient_1 = require("./client/OnlineClient");
var options = (0, options_1["default"])();
console.info("+-----------------------------------------+");
console.info("|     Ultimate Algorithm Battle Client    |");
console.info("+-----------------------------------------+");
var client = new OnlineClient_1["default"](options);
//# sourceMappingURL=index.js.map