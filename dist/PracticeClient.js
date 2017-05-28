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
var funcs = require("./lib/funcs");
var Client_1 = require("./model/Client");
var State_1 = require("./lib/State");
var random_1 = require("./sample/random");
var PracticeClient = (function (_super) {
    __extends(PracticeClient, _super);
    function PracticeClient(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.size = 3;
        _this.firstPlayer = Math.round(Math.random());
        _this.state = new State_1["default"]();
        console.log("Starting practice mode (" + _this.options.games + " games)");
        _this.startGame();
        return _this;
    }
    PracticeClient.prototype.startGame = function () {
        this.firstPlayer = 1 - this.firstPlayer;
        this.playerB = new random_1["default"](constants_1.OPPONENT, this.size);
        this.sendData('init');
        this.gameStart = process.hrtime();
        this.state.games++;
        if (this.firstPlayer === constants_1.ME) {
            this.sendData('move');
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
            this.playerB.addOpponentMove(board, move);
            if (!this.checkEnding()) {
                this.playerBMove();
            }
        }
        else {
            console.error('Unknown command', data);
        }
    };
    PracticeClient.prototype.playerBMove = function () {
        var moveCoords = this.playerB.getMove();
        this.playerB.addMove(moveCoords.board, moveCoords.move);
        this.sendData('opponent ' + moveCoords.board.join(',') + ';' + moveCoords.move.join(','));
        this.checkEnding();
    };
    PracticeClient.prototype.checkEnding = function () {
        if (this.playerB.game.isFinished()) {
            var result = this.playerB.game.getResult();
            if (result === -1) {
                this.state.ties++;
            }
            else {
                this.state.wins[result]++;
            }
            var hrend = process.hrtime(this.gameStart);
            this.state.times.push(funcs.convertExecTime(hrend[1]));
            if (this.options.verbose) {
                console.log(this.playerB.game.prettyPrint());
            }
            if (this.state.games < this.options.games) {
                this.startGame();
                return true;
            }
            else {
                console.log(this.state.printState());
                process.exit(0);
            }
        }
        return false;
    };
    PracticeClient.prototype.onDisconnect = function () {
        console.error('Error: Player process exited');
    };
    return PracticeClient;
}(Client_1["default"]));
exports["default"] = PracticeClient;
