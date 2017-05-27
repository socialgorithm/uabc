"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("@socialgorithm/ultimate-ttt");
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var Random = (function () {
    function Random(player, size) {
        if (size === void 0) { size = 3; }
        if (!player || player < constants_1.ME || player > constants_1.OPPONENT) {
            throw new Error('Invalid player');
        }
        this.size = size;
        this.player = player;
        this.opponent = 1 - player;
        this.init();
    }
    Random.prototype.init = function () {
        this.game = new ultimate_ttt_1["default"](this.size);
    };
    Random.prototype.addOpponentMove = function (board, move) {
        try {
            this.game = this.game.addOpponentMove(board, move);
        }
        catch (e) {
            console.error('-------------------------------');
            console.error("\n" + 'AddOpponentMove: Game probably already over when adding', board, move, e);
            console.error("\n" + this.game.prettyPrint());
            console.error("\n" + this.game.stateBoard.prettyPrint(true));
            console.error('-------------------------------');
            throw new Error(e);
        }
    };
    Random.prototype.addMove = function (board, move) {
        try {
            this.game = this.game.addMyMove(board, move);
        }
        catch (e) {
            console.error('-------------------------------');
            console.error("\n" + 'AddMyMove: Game probably already over when adding', board, move, e);
            console.error("\n" + this.game.prettyPrint());
            console.error("\n" + this.game.stateBoard.prettyPrint(true));
            console.error('-------------------------------');
            throw new Error(e);
        }
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
        var validBoards = this.game.getValidBoards();
        if (validBoards.length === 0) {
            console.error("\n" + this.game.prettyPrint());
            console.error("\n" + this.game.stateBoard.prettyPrint(true));
            throw new Error('Error: There are no boards available to play');
        }
        return validBoards[Math.floor(Math.random() * validBoards.length)];
    };
    Random.prototype.getRandomCoordinate = function () {
        return Math.round(Math.random() * (this.size - 1));
    };
    Random.prototype.findRandomPosition = function (board) {
        if (board.isFull() || board.isFinished()) {
            console.error('This board is full/finished', board);
            console.error(board.prettyPrint());
            return;
        }
        var validMoves = board.getValidMoves();
        if (validMoves.length === 0) {
            throw new Error('Error: There are no moves available on this board');
        }
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    };
    return Random;
}());
exports["default"] = Random;
