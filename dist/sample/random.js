"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("ultimate-ttt");
var constants_1 = require("ultimate-ttt/dist/model/constants");
var Random = (function () {
    function Random(player, size) {
        if (size === void 0) { size = 3; }
        if (!player || player < constants_1.ME || player > constants_1.OPPONENT) {
            throw new Error('Invalid player');
        }
        this.size = size;
        this.player = player;
        this.oponent = 3 - player;
        this.init();
    }
    Random.prototype.init = function () {
        this.game = new ultimate_ttt_1["default"](this.size);
    };
    Random.prototype.addOpponentMove = function (board, move) {
        this.game.addOpponentMove(board, move);
    };
    Random.prototype.addMove = function (board, move) {
        this.game.addMyMove(board, move);
    };
    Random.prototype.getMove = function () {
        var boardCoords = this.chooseBoard();
        var board = this.game.board[boardCoords[0]][boardCoords[1]];
        var move = this.findRandomPosition(board);
        return {
            board: boardCoords,
            move: move
        };
    };
    Random.prototype.chooseBoard = function () {
        var board = this.game.nextBoard || [0, 0];
        if (!this.game.board[board[0]][board[1]].isFinished()) {
            return board;
        }
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (!this.game.board[x][y].isFinished()) {
                    return [x, y];
                }
            }
        }
        throw new Error('Error: Unable to find available board');
    };
    Random.prototype.getRandomCoordinate = function () {
        return Math.round(Math.random() * (this.size - 1));
    };
    Random.prototype.findRandomPosition = function (board) {
        var valid = null;
        while (!valid) {
            var move = [
                this.getRandomCoordinate(),
                this.getRandomCoordinate(),
            ];
            if (board.isValidMove(move) && board.board[move[0]][move[1]].player === 0) {
                valid = move;
            }
        }
        return valid;
    };
    return Random;
}());
exports["default"] = Random;
//# sourceMappingURL=random.js.map