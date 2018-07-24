"use strict";
exports.__esModule = true;
var Player = (function () {
    function Player(onPlayerData) {
        this.onPlayerData = onPlayerData;
    }
    Player.prototype.sendData = function (data) {
        this.onReceiveData(data);
    };
    return Player;
}());
exports["default"] = Player;
