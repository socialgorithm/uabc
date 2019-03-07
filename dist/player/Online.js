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
    function OnlinePlayer(socket, onPlayerData) {
        var _this = _super.call(this, onPlayerData) || this;
        _this.socket = socket;
        _this.onServerData = function (data) {
            if (data && data.length > 0) {
                var parts = data.split(' ');
                if (parts[0] === 'end') {
                    console.log('Game ended! You ' + parts[1]);
                }
                else {
                    _this.onPlayerData(data);
                }
            }
            else {
                console.log('uabc: invalid data format received, it should be a string', data);
            }
        };
        _this.socket.on('game', _this.onServerData);
        return _this;
    }
    OnlinePlayer.prototype.onReceiveData = function (data) {
        this.socket.emit('game', data);
    };
    return OnlinePlayer;
}(Player_1["default"]));
exports["default"] = OnlinePlayer;
