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
var exec_1 = require("../lib/exec");
var Player_1 = require("./Player");
var ExecutablePlayer = (function (_super) {
    __extends(ExecutablePlayer, _super);
    function ExecutablePlayer(file, sendData) {
        var _this = _super.call(this, sendData) || this;
        if (!file || file.length < 1) {
            console.error("uabc error: executable not specified");
            process.exit(-1);
        }
        _this.playerProcess = exec_1["default"](file);
        _this.playerProcess.on("close", function (code) {
            console.log("client> child process exited with code " + code);
        });
        _this.playerProcess.stdout.on("data", function (data) {
            var lines = data.split(os.EOL);
            var regex = /^(send:).*/;
            var output = [];
            var gameData = [];
            lines.forEach(function (eachLine) {
                var line = eachLine.trim();
                if (line.length < 1) {
                    return;
                }
                if (regex.test(line.replace(/\s/g, ""))) {
                    gameData.push(line.replace("send:", ""));
                }
                else {
                    output.push(line);
                }
            });
            gameData.forEach(function (line) {
                _this.onPlayerData(line);
            });
            if (output.length > 0) {
                console.log(output.join("\n"));
            }
        });
        _this.playerProcess.stderr.on("data", function (message) {
            console.log("----------- PLAYER ERROR ---------");
            console.log(message);
            console.log("----------------------------------");
        });
        return _this;
    }
    ExecutablePlayer.prototype.onReceiveData = function (data) {
        this.playerProcess.stdin.write(data + os.EOL);
    };
    return ExecutablePlayer;
}(Player_1["default"]));
exports["default"] = ExecutablePlayer;
//# sourceMappingURL=Executable.js.map