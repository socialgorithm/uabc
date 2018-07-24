"use strict";
exports.__esModule = true;
var ConsoleLogger_1 = require("../../logger/ConsoleLogger");
var FileLogger_1 = require("../../logger/FileLogger");
var State_1 = require("./State");
var Executable_1 = require("../../player/Executable");
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
        this.playerA = new Executable_1["default"](options.file[0], this.onPlayerAData.bind(this));
        this.state = new State_1["default"]();
    }
    Client.prototype.log = function (writer, message) {
        if (this.loggers.console) {
            this.loggers.console.log(writer, message);
        }
        if (this.loggers.file) {
            this.loggers.file.log(writer, message);
        }
    };
    return Client;
}());
exports["default"] = Client;
