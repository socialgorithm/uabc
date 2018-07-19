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
    function RandomPlayer(options, sendMove) {
        var _this = _super.call(this, options, sendMove) || this;
        _this.randomPlayer = new random_1["default"](constants_1.OPPONENT, 3);
        return _this;
    }
    RandomPlayer.prototype.addOpponentMove = function (move) {
        var coords = this.parseMove(move);
        if (!coords) {
            return;
        }
        this.randomPlayer.addOpponentMove(coords.board, coords.move);
        if (!this.randomPlayer.game.isFinished()) {
            var moveCoords = this.randomPlayer.getMove();
            this.randomPlayer.addMove(moveCoords.board, moveCoords.move);
            this.sendPlayerMove(this.stringifyMove(moveCoords));
        }
    };
    RandomPlayer.prototype.stringifyMove = function (moveCoords) {
        return moveCoords.board.join(',') + ';' + moveCoords.move.join(',');
    };
    RandomPlayer.prototype.parseMove = function (data) {
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
            return {
                board: board,
                move: move
            };
        }
        console.error('Unknown command', data);
        return null;
    };
    return RandomPlayer;
}(Player_1["default"]));
exports["default"] = RandomPlayer;
