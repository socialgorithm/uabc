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
var Player_1 = require("./model/Player");
var OnlinePlayer = (function (_super) {
    __extends(OnlinePlayer, _super);
    function OnlinePlayer(socket, sendData) {
        var _this = _super.call(this, sendData) || this;
        _this.socket = socket;
        _this.onServerData = function (data) {
            if (data.action && data.action.length > 0) {
                var parts = data.action.split(' ');
                if (parts[0] === 'end') {
                    console.log('Games ended! You ' + parts[1]);
                }
                else {
                    _this.onPlayerData(data.action);
                }
            }
        };
        _this.socket.on('game', _this.onServerData);
        return _this;
    }
    OnlinePlayer.prototype.onReceiveData = function (move) {
        this.socket.emit('game', move);
    };
    return OnlinePlayer;
}(Player_1["default"]));
exports["default"] = OnlinePlayer;
