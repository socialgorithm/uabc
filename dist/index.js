"use strict";
exports.__esModule = true;
var options_1 = require("./cli/options");
var OnlineClient_1 = require("./client/OnlineClient");
var PracticeClient_1 = require("./client/PracticeClient");
var options = options_1["default"]();
console.info("+-----------------------------------------+");
console.info("|     Ultimate Algorithm Battle Client    |");
console.info("+-----------------------------------------+");
if (options.practice) {
    var client = new PracticeClient_1["default"](options);
}
else {
    var client = new OnlineClient_1["default"](options);
}
//# sourceMappingURL=index.js.map