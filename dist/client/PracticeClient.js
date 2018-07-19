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
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var Client_1 = require("./model/Client");
var Executable_1 = require("../players/Executable");
var Random_1 = require("../players/Random");
var PracticeClient = (function (_super) {
    __extends(PracticeClient, _super);
    function PracticeClient(options) {
        var _this = _super.call(this, options) || this;
        _this.size = 3;
        if (_this.options.file.length > 1) {
            _this.playerB = new Executable_1["default"](options.file[1], options, _this.onPlayerData);
        }
        else {
            _this.playerB = new Random_1["default"](options, _this.onPlayerData);
        }
        _this.firstPlayer = Math.round(Math.random());
        console.log("Starting practice mode (" + _this.options.games + " games)");
        console.log("Player A: " + _this.options.file[0]);
        console.log("Player B: " + _this.options.file[1]);
        _this.startGame();
        return _this;
    }
    PracticeClient.prototype.startGame = function () {
        this.firstPlayer = 1 - this.firstPlayer;
        this.gameStart = process.hrtime();
        this.state.games++;
        if (this.firstPlayer === constants_1.ME) {
        }
        else {
            this.playerBMove();
        }
    };
    PracticeClient.prototype.onPlayerData = function (data) {
        var parts = data.split(';');
        var boardStr = parts[0].split(',');
        if (parts.length > 1) {
            var moveStr = parts[1].split(',');
            var board = [
                parseInt(boardStr[0], 10),
                parseInt(boardStr[1], 10)
            ];
            var move = [
                parseInt(moveStr[0], 10),
                parseInt(moveStr[1], 10)
            ];
            if (!this.checkEnding()) {
                this.playerBMove();
            }
        }
        else {
            console.error('Unknown command', data);
        }
    };
    PracticeClient.prototype.playerBMove = function () {
        this.checkEnding();
    };
    PracticeClient.prototype.checkEnding = function () {
        return false;
    };
    PracticeClient.prototype.onDisconnect = function () {
        console.error('Error: Player process exited');
    };
    return PracticeClient;
}(Client_1["default"]));
exports["default"] = PracticeClient;
