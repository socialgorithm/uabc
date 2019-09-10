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
var model_1 = require("@socialgorithm/model");
var connect_1 = require("../lib/connect");
var Online_1 = require("../player/Online");
var Client_1 = require("./Client");
var OnlineClient = (function (_super) {
    __extends(OnlineClient, _super);
    function OnlineClient(options) {
        var _this = _super.call(this, options) || this;
        console.log("Starting Online Mode");
        console.log("Local Player: " + _this.options.files[0]);
        console.log();
        console.log("Waiting for server...");
        console.log();
        try {
            var host = options.host || "localhost:3141";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }
            var socketOptions = {
                query: "token=" + options.token
            };
            _this.tournamentServerSocket = connect_1["default"](host, options, socketOptions);
            _this.tournamentServerSocket.on("error", function (data) {
                console.error("Error in socket", data);
            });
            _this.tournamentServerSocket.on("connect", function () {
                console.log("Connected! Joining Lobby \"" + options.lobby + "\"...");
                _this.tournamentServerSocket.emit(model_1.LegacyEvents.EVENTS.LOBBY_JOIN, {
                    token: options.lobby
                });
            });
            _this.tournamentServerSocket.on("lobby joined", function () {
                console.log("Lobby Joined! Waiting for match...");
            });
            _this.tournamentServerSocket.on("exception", function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.tournamentServerSocket.on(model_1.LegacyEvents.EVENTS.LOBBY_EXCEPTION, function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.tournamentServerSocket.on(model_1.EventName.GameServerHandoff, function (handoffMessage) {
                var gameServerSocketOptions = {
                    query: {
                        token: handoffMessage.token
                    }
                };
                console.log("Initiating handoff to Game Server " + handoffMessage.gameServerAddress + ", token = " + handoffMessage.token);
                if (_this.gameServerSocket && _this.gameServerSocket.connected) {
                    _this.gameServerSocket.disconnect();
                }
                _this.gameServerSocket = connect_1["default"](handoffMessage.gameServerAddress, options, gameServerSocketOptions);
                _this.gameServerSocket.on("error", function (data) {
                    console.error("Error in game server socket", data);
                });
                _this.gameServerSocket.on("connect", function () {
                    console.log("Connected to Game Server (token: " + handoffMessage.token + "), waiting for match to begin");
                });
                _this.gameServerSocket.on("disconnect", function () {
                    console.log("Disconnected from game server (token: " + handoffMessage.token + ")");
                });
                if (!_this.otherPlayers[0]) {
                    _this.otherPlayers[0] = new Online_1["default"](_this.gameServerSocket, _this.onOtherPlayersData.bind(_this));
                }
                else {
                    _this.otherPlayers[0].setSocket(_this.gameServerSocket);
                }
            });
            _this.tournamentServerSocket.on("disconnect", function () {
                console.log("Connection to Tournament Server lost!");
            });
        }
        catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
        return _this;
    }
    OnlineClient.prototype.onLocalPlayerData = function (payload) {
        this.log("A", payload);
        var message = {
            payload: payload
        };
        if (this.gameServerSocket) {
            this.gameServerSocket.emit(model_1.EventName.Game__Player, message);
        }
    };
    OnlineClient.prototype.onOtherPlayersData = function (data) {
        this.log("B", data);
        this.otherPlayers[0].onDataFromOtherPlayers(data);
    };
    return OnlineClient;
}(Client_1["default"]));
exports["default"] = OnlineClient;
//# sourceMappingURL=OnlineClient.js.map