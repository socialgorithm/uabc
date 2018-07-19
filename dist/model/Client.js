"use strict";
exports.__esModule = true;
var ConsoleLogger_1 = require("../lib/ConsoleLogger");
var Client = (function () {
    function Client(playerA, playerB, options) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.options = options;
        if (options.verbose) {
            this.logger = new ConsoleLogger_1["default"]();
        }
    }
    return Client;
}());
exports["default"] = Client;
