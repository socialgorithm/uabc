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
var io = require("socket.io-client");
var ioProxy = require("socket.io-proxy");
var model_1 = require("@socialgorithm/model");
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
            _this.socket = _this.connect(host, socketOptions);
            _this.socket.on("error", function (data) {
                console.error("Error in socket", data);
            });
            _this.socket.on("connect", function () {
                console.log("Connected! Joining Lobby \"" + options.lobby + "\"...");
                _this.socket.emit(model_1.EVENTS.LOBBY_JOIN, {
                    token: options.lobby
                });
            });
            _this.socket.on("lobby joined", function () {
                console.log("Lobby Joined!");
            });
            _this.socket.on("exception", function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.socket.on(model_1.EVENTS.LOBBY_EXCEPTION, function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.socket.on(model_1.EVENTS.GAME_SERVER_HANDOFF, function (data) {
                var socketOptions = {
                    query: "token=" + data.token
                };
                _this.gameServerSocket = _this.connect(data.gameServerAddress, socketOptions);
                _this.gameServerSocket.on("error", function (data) {
                    console.error("Error in game server socket", data);
                });
                _this.gameServerSocket.on("connect", function () {
                    console.log("Connected to Game Server, waiting for games to begin");
                });
                _this.playerB.setSocket(_this.gameServerSocket);
            });
            _this.socket.on("disconnect", function () {
                console.log("Connection to Tournament Server lost!");
            });
        }
        catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
        return _this;
    }
    OnlineClient.prototype.onPlayerAData = function (data) {
        this.log("A", data);
        if (this.gameServerSocket) {
            this.gameServerSocket.emit("game", data);
        }
    };
    OnlineClient.prototype.onPlayerBData = function (data) {
        this.log("B", data);
        this.playerA.sendData(data);
    };
    OnlineClient.prototype.connect = function (host, socketOptions) {
        if (this.options.proxy || process.env.http_proxy) {
            if (this.options.proxy) {
                ioProxy.init(this.options.proxy);
            }
            return ioProxy.connect(host, socketOptions);
        }
        else {
            return io.connect(host, socketOptions);
        }
    };
    return OnlineClient;
}(Client_1["default"]));
exports["default"] = OnlineClient;
//# sourceMappingURL=OnlineClient.js.map