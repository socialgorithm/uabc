"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var ioProxy = require("socket.io-proxy");
var model_1 = require("@socialgorithm/model");
var Online_1 = require("../player/Online");
var Client_1 = require("./Client");
var OnlineClient = (function (_super) {
    __extends(OnlineClient, _super);
    function OnlineClient(options) {
        var _this = _super.call(this, options) || this;
        console.log("Starting Online Mode");
        console.log("Player A: " + _this.options.file);
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
            _this.tournamentServerSocket = _this.connect(host, socketOptions);
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
                _this.gameServerSocket = _this.connect(handoffMessage.gameServerAddress, gameServerSocketOptions);
                _this.gameServerSocket.on("error", function (data) {
                    console.error("Error in game server socket", data);
                });
                _this.gameServerSocket.on("connect", function () {
                    console.log("Connected to Game Server (token: " + handoffMessage.token + "), waiting for match to begin");
                });
                _this.gameServerSocket.on("disconnect", function () {
                    console.log("Disconnected from game server (token: " + handoffMessage.token + ")");
                });
                if (!_this.playerB) {
                    _this.playerB = new Online_1["default"](_this.gameServerSocket, _this.onPlayerBData.bind(_this));
                }
                else {
                    _this.playerB.setSocket(_this.gameServerSocket);
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
    OnlineClient.prototype.onPlayerAData = function (payload) {
        this.log("A", payload);
        var message = {
            payload: payload
        };
        if (this.gameServerSocket) {
            this.gameServerSocket.emit(model_1.EventName.Game__Player, message);
        }
    };
    OnlineClient.prototype.onPlayerBData = function (data) {
        this.log("B", data);
        this.playerA.onDataFromOtherPlayers(data);
    };
    OnlineClient.prototype.connect = function (host, socketOptions) {
        if (this.options.proxy || process.env.http_proxy) {
            if (this.options.proxy) {
                ioProxy.init(this.options.proxy);
            }
            return ioProxy.connect(host, socketOptions);
        }
        else {
            return (0, socket_io_client_1.io)(host, socketOptions);
        }
    };
    return OnlineClient;
}(Client_1["default"]));
exports["default"] = OnlineClient;
//# sourceMappingURL=OnlineClient.js.map