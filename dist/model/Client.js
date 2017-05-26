"use strict";
exports.__esModule = true;
var ConsoleLogger_1 = require("../lib/ConsoleLogger");
var FileLogger_1 = require("../lib/FileLogger");
var exec_1 = require("../lib/exec");
var Client = (function () {
    function Client(options) {
        var _this = this;
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
        this.playerProcess = exec_1["default"](options.file);
        this.playerProcess.on('close', function (code) {
            console.log("client> child process exited with code " + code);
            _this.onDisconnect();
        });
        this.playerProcess.stdout.on('data', function (data) {
            _this.log('player', data);
            _this.onPlayerData(data);
        });
    }
    Client.prototype.sendData = function (data) {
        this.log('server', data);
        this.playerProcess.stdin.write(data + "\n");
    };
    Client.prototype.log = function (writer, data) {
        if (this.loggers.console) {
            this.loggers.console.log(writer, data);
        }
        if (this.loggers.file) {
            this.loggers.file.log(writer, data);
        }
    };
    return Client;
}());
exports["default"] = Client;
