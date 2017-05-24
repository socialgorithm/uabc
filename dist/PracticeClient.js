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
var Client_1 = require("./model/Client");
var State_1 = require("./lib/State");
var random_1 = require("./sample/random");
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var PracticeClient = (function (_super) {
    __extends(PracticeClient, _super);
    function PracticeClient(options) {
        var _this = _super.call(this, options) || this;
        var size = 3;
        _this.state = new State_1["default"]();
        _this.opponent = new random_1["default"](constants_1.OPPONENT, size);
        console.log('Starting practice mode');
        _this.sendData('init');
        _this.sendData('move');
        return _this;
    }
    PracticeClient.prototype.onPlayerData = function (data) {
        var parts = data.split(';');
        var boardStr = parts[0].split(',');
        var moveStr = parts[1].split(',');
        var board = [
            parseInt(boardStr[0], 10),
            parseInt(boardStr[1], 10)
        ];
        var move = [
            parseInt(moveStr[0], 10),
            parseInt(moveStr[1], 10)
        ];
        this.opponent.addOpponentMove(board, move);
        if (this.checkEnding()) {
            return;
        }
        var opponentMove = this.opponent.getMove();
        this.opponent.addMove(opponentMove.board, opponentMove.move);
        if (this.checkEnding()) {
            return;
        }
        this.sendData('opponent ' + opponentMove.board.join(',') + ';' + opponentMove.move.join(','));
    };
    PracticeClient.prototype.checkEnding = function () {
        if (this.opponent.game.isFinished()) {
            console.log('someone has won!');
            console.log(this.opponent.game.prettyPrint());
            console.log(this.opponent.game.stateBoard.prettyPrint());
            return true;
        }
        return false;
    };
    PracticeClient.prototype.onDisconnect = function () {
        console.error('Error: Player process exited');
    };
    return PracticeClient;
}(Client_1["default"]));
exports["default"] = PracticeClient;
//# sourceMappingURL=PracticeClient.js.map