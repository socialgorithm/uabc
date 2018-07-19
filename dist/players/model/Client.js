"use strict";
exports.__esModule = true;
var os = require("os");
var ConsoleLogger_1 = require("../../lib/ConsoleLogger");
var FileLogger_1 = require("../../lib/FileLogger");
var exec_1 = require("../../lib/exec");
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
        this.playerProcess = exec_1["default"](options.file[0]);
        this.playerProcess.on('close', function (code) {
            console.log("client> child process exited with code " + code);
            _this.onDisconnect();
        });
        this.playerProcess.stdout.on('data', function (data) {
            var lines = data.split(os.EOL);
            var regex = /^\d,\d;\d,\d$/;
            var output = [];
            lines.forEach(function (eachLine) {
                var line = eachLine.trim();
                if (line.length < 1) {
                    return;
                }
                if (regex.test(line.replace(/\s/g, ''))) {
                    _this.log('player', line);
                    _this.onPlayerData(line);
                }
                else {
                    output.push(line);
                }
            });
            if (output.length > 0) {
                console.log('---------- PLAYER OUTPUT ---------');
                console.log(output.join('\n'));
                console.log('----------------------------------');
            }
        });
        this.playerProcess.stderr.on('data', function (message) {
            console.log('---------- PLAYER OUTPUT ---------');
            console.log(message);
            console.log('----------------------------------');
        });
    }
    Client.prototype.sendData = function (data) {
        this.log('server', data);
        this.playerProcess.stdin.write(data + os.EOL);
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
