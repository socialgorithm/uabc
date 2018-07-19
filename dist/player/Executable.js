"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var os = require("os");
var Player_1 = require("./model/Player");
var exec_1 = require("../lib/exec");
var ExecutablePlayer = (function (_super) {
    __extends(ExecutablePlayer, _super);
    function ExecutablePlayer(file, options, sendMove) {
        var _this = _super.call(this, options, sendMove) || this;
        if (!file || file.length < 1) {
            console.error('uabc error: executable not specified');
            process.exit(-1);
        }
        _this.playerProcess = exec_1["default"](file);
        _this.playerProcess.on('close', function (code) {
            console.log("client> child process exited with code " + code);
        });
        _this.playerProcess.stdout.on('data', function (data) {
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
                    _this.sendPlayerMove(line);
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
        _this.playerProcess.stderr.on('data', function (message) {
            console.log('---------- PLAYER OUTPUT ---------');
            console.log(message);
            console.log('----------------------------------');
        });
        return _this;
    }
    ExecutablePlayer.prototype.addOpponentMove = function (move) {
        this.playerProcess.stdin.write(move + os.EOL);
    };
    return ExecutablePlayer;
}(Player_1["default"]));
exports["default"] = ExecutablePlayer;
