"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var exec_1 = require("../lib/exec");
var Player_1 = require("./Player");
var ExecutablePlayer = (function (_super) {
    __extends(ExecutablePlayer, _super);
    function ExecutablePlayer(file, onDataFromThisPlayer) {
        var _this = _super.call(this, onDataFromThisPlayer) || this;
        if (!file || file.length < 1) {
            console.error("uabc error: executable not specified");
            process.exit(-1);
        }
        _this.playerProcess = (0, exec_1["default"])(file);
        _this.playerProcess.on("close", function (code) {
            console.log("client> child process exited with code " + code);
        });
        _this.playerProcess.stdout.on("data", function (data) {
            var lines = data.split('\n');
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
                _this.onDataFromThisPlayer(line);
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
    ExecutablePlayer.prototype.onDataFromOtherPlayers = function (data) {
        this.playerProcess.stdin.write(data + '\n');
    };
    return ExecutablePlayer;
}(Player_1["default"]));
exports["default"] = ExecutablePlayer;
//# sourceMappingURL=Executable.js.map