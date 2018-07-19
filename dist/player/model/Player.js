"use strict";
exports.__esModule = true;
var ConsoleLogger_1 = require("../../lib/ConsoleLogger");
var FileLogger_1 = require("../../lib/FileLogger");
var Player = (function () {
    function Player(options, _sendData) {
        this._sendData = _sendData;
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
    }
    Player.prototype.sendData = function (data) {
        this.log('server', data);
        this._sendData(data);
    };
    Player.prototype.log = function (writer, data) {
        if (this.loggers.console) {
            this.loggers.console.log(writer, data);
        }
        if (this.loggers.file) {
            this.loggers.file.log(writer, data);
        }
    };
    return Player;
}());
exports["default"] = Player;
