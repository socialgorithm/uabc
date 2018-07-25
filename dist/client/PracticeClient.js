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
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var Client_1 = require("./model/Client");
var Executable_1 = require("../player/Executable");
var Random_1 = require("../player/Random");
var funcs_1 = require("../lib/funcs");
var PracticeClient = (function (_super) {
    __extends(PracticeClient, _super);
    function PracticeClient(options) {
        var _this = _super.call(this, options) || this;
        _this.size = 3;
        var playerBName;
        if (_this.options.file.length > 1) {
            _this.playerB = new Executable_1["default"](options.file[1], _this.onPlayerBData.bind(_this));
            playerBName = options.file[1];
        }
        else {
            _this.playerB = new Random_1["default"](_this.onPlayerBData.bind(_this));
            playerBName = '[Built-in Random Player]';
        }
        _this.firstPlayer = Math.round(Math.random());
        console.log("Starting practice mode (" + _this.options.games + " games)");
        console.log("Player A: " + _this.options.file[0]);
        console.log("Player B: " + playerBName);
        _this.startGame();
        return _this;
    }
    PracticeClient.prototype.startGame = function () {
        this.currentGame = new UTTT_1["default"]();
        this.firstPlayer = 1 - this.firstPlayer;
        this.playerA.sendData('init');
        this.playerB.sendData('init');
        this.gameStart = process.hrtime();
        this.state.games++;
        if (this.firstPlayer === constants_1.ME) {
            this.playerA.sendData('move');
        }
        else {
            this.playerB.sendData('move');
        }
    };
    PracticeClient.prototype.nextGame = function () {
        var result = this.currentGame.getResult();
        if (result === -1) {
            this.state.ties++;
        }
        else {
            this.state.wins[result]++;
        }
        var hrend = process.hrtime(this.gameStart);
        this.state.times.push(funcs_1.convertExecTime(hrend[1]));
        if (this.options.verbose) {
            var winner = null;
            if (result === constants_1.ME) {
                winner = 'Player A';
            }
            else if (result === constants_1.OPPONENT) {
                winner = 'Player B';
            }
            else {
                winner = 'Tie';
            }
            console.log('-----------------------');
            console.log("Game " + this.state.games + " Ended (" + funcs_1.convertExecTime(hrend[1]) + "ms)");
            console.log("Winner: " + winner + " (" + result + ")");
            console.log(this.currentGame.prettyPrint());
            console.log('');
        }
        if (this.state.games < this.options.games) {
            this.startGame();
            return;
        }
        this.state.printState();
        process.exit(0);
    };
    PracticeClient.prototype.onPlayerAData = function (data) {
        var coords = funcs_1.parseMove(data);
        if (!coords) {
            console.log('error: received invalid move from player A');
        }
        this.currentGame = this.currentGame.addMyMove(coords.board, coords.move);
        this.log('A', data);
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerB.sendData("opponent " + data);
    };
    PracticeClient.prototype.onPlayerBData = function (data) {
        var coords = funcs_1.parseMove(data);
        if (!coords) {
            console.log('error: received invalid move from player B');
        }
        this.currentGame = this.currentGame.addOpponentMove(coords.board, coords.move);
        this.log('B', data);
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerA.sendData("opponent " + data);
    };
    return PracticeClient;
}(Client_1["default"]));
exports["default"] = PracticeClient;
