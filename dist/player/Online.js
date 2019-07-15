"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Events_1 = require("@socialgorithm/model/dist/Events");
var Player_1 = require("./Player");
var OnlinePlayer = (function (_super) {
    __extends(OnlinePlayer, _super);
    function OnlinePlayer(socket, onDataFromThisPlayer) {
        var _this = _super.call(this, onDataFromThisPlayer) || this;
        _this.socket = socket;
        _this.onServerData = function (_a) {
            var payload = _a.payload;
            if (payload && payload.length > 0) {
                var parts = payload.split(" ");
                if (parts[0] === "end") {
                    console.log("Game ended! You " + parts[1]);
                }
                else {
                    _this.onDataFromThisPlayer(payload);
                }
            }
            else {
                console.log("uabc: invalid data format received, it should be a string", payload);
            }
        };
        _this.socket.on(Events_1.EventName.Game__Player, _this.onServerData);
        return _this;
    }
    OnlinePlayer.prototype.setSocket = function (socket) {
        this.socket = socket;
        this.socket.on(Events_1.EventName.Game__Player, this.onServerData);
    };
    OnlinePlayer.prototype.onDataFromOtherPlayers = function (payload) {
        console.error("OnlinePlayers should not call this.");
    };
    return OnlinePlayer;
}(Player_1["default"]));
exports["default"] = OnlinePlayer;
//# sourceMappingURL=Online.js.map