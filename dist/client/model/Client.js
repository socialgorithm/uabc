"use strict";
exports.__esModule = true;
var ConsoleLogger_1 = require("../../lib/ConsoleLogger");
var FileLogger_1 = require("../../lib/FileLogger");
var State_1 = require("../../model/State");
var Executable_1 = require("../../players/Executable");
var Client = (function () {
    function Client(options) {
        this.options = options;
        this.loggers = {};
        if (options.verbose) {
            this.loggers.console = new ConsoleLogger_1["default"]();
        }
        if (options.log) {
            var logName = void 0;
            if (options.log.length > 0) {
                logName = options.log;
            }
            this.loggers.file = new FileLogger_1["default"](logName);
        }
        this.playerA = new Executable_1["default"](options.file[0], options, this.onPlayerData);
        this.state = new State_1["default"]();
    }
    return Client;
}());
exports["default"] = Client;
