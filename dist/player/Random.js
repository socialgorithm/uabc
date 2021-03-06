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
var Player_1 = require("./model/Player");
var random_1 = require("../sample/random");
var RandomPlayer = (function (_super) {
    __extends(RandomPlayer, _super);
    function RandomPlayer(sendData) {
        var _this = _super.call(this, sendData) || this;
        _this.randomPlayer = new random_1["default"](constants_1.OPPONENT, 3);
        return _this;
    }
    RandomPlayer.prototype.onReceiveData = function (data) {
        var parts = data.split(' ');
        var action = parts[0];
        var next, move, coords;
        switch (action) {
            case 'init':
                this.randomPlayer.init();
                break;
            case 'move':
                try {
                    coords = this.randomPlayer.getMove();
                    this.randomPlayer.addMove(coords.board, coords.move);
                    this.onPlayerData(this.stringifyMove(coords));
                }
                catch (e) {
                    console.error('Player Error: Failed to get a move', e);
                }
                break;
            case 'opponent':
                next = parts[1].split(';');
                var boardCoords = next[0].split(',').map(function (coord) { return parseInt(coord, 10); });
                var moveCoords = next[1].split(',').map(function (coord) { return parseInt(coord, 10); });
                this.randomPlayer.addOpponentMove([
                    boardCoords[0],
                    boardCoords[1]
                ], [
                    moveCoords[0],
                    moveCoords[1]
                ]);
                if (!this.randomPlayer.game.isFinished()) {
                    coords = this.randomPlayer.getMove();
                    this.randomPlayer.addMove(coords.board, coords.move);
                    this.onPlayerData(this.stringifyMove(coords));
                }
                break;
        }
    };
    RandomPlayer.prototype.stringifyMove = function (moveCoords) {
        return moveCoords.board.join(',') + ';' + moveCoords.move.join(',');
    };
    return RandomPlayer;
}(Player_1["default"]));
exports["default"] = RandomPlayer;
