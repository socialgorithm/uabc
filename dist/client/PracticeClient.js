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
var exec_1 = require("../lib/exec");
var practice_1 = require("../lib/practice");
var FileLogger_1 = require("../logger/FileLogger");
var Executable_1 = require("../player/Executable");
var Client_1 = require("./Client");
var PracticeClient = (function (_super) {
    __extends(PracticeClient, _super);
    function PracticeClient(options) {
        var _this = _super.call(this, options) || this;
        _this.onMatchCreated = function (message) {
            console.log("player tokens", message.playerTokens);
            console.log("Connecting players to game server...");
            _this.playerSockets = [];
            Object.keys(message.playerTokens).forEach(function (playerName) {
                var token = message.playerTokens[playerName];
                var socket = _this.connectPlayer(token);
                _this.playerSockets.push(socket);
                socket.on("connect", function () {
                    console.log("  - " + playerName + " connected");
                });
            });
        };
        _this.connectPlayer = function (token) {
            var socketOptions = {
                econnection: true,
                timeout: 2000,
                query: {
                    token: token
                }
            };
            return connect_1["default"](_this.gameServerHost, _this.options, socketOptions);
        };
        _this.onGameEnded = function (game) {
            console.log("game ended, winner ", game.winner);
        };
        _this.onMatchEnded = function (match) {
            console.log("match ended, winner ", match.winner);
            _this.gameServerSocket.disconnect();
            if (_this.gameServerProcess) {
                _this.gameServerProcess.kill();
            }
        };
        var host = _this.options.host || "localhost:5433";
        if (host.substr(0, 4) !== "http") {
            host = "http://" + host;
        }
        _this.gameServerHost = host;
        console.log("Starting Practice Mode: " + options.practice);
        if (_this.options.log) {
            _this.gameServerLogger = new FileLogger_1["default"]("gameServer.log");
        }
        if (options.host) {
            _this.initGameServerConnection();
        }
        else {
            _this.initGameServer().then(function () {
                _this.initGameServerConnection();
            });
        }
        return _this;
    }
    PracticeClient.prototype.onLocalPlayerData = function (data) {
        throw new Error("Method not implemented.");
    };
    PracticeClient.prototype.onOtherPlayersData = function (data) {
        throw new Error("Method not implemented.");
    };
    PracticeClient.prototype.initGameServer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var gameServerBin = practice_1.GAME_SERVER_BIN[_this.options.practice];
                if (!gameServerBin) {
                    throw new Error("Unknown game \"" + _this.options.practice + "\"");
                }
                console.log("Running game server: ", gameServerBin);
                _this.gameServerProcess = exec_1["default"](gameServerBin);
                console.log("Started game server");
                _this.gameServerProcess.on("close", function (code) {
                    console.log("uabc> game server exited with code " + code);
                });
                _this.gameServerProcess.stdout.on("data", function (data) {
                    console.log("gameServer>", data);
                });
                _this.gameServerProcess.stderr.on("data", function (data) {
                    console.log("gameServer error>", data);
                });
                setTimeout(function () {
                    resolve();
                }, 3000);
            }
            catch (e) {
                console.error("uabc error:", e);
                process.exit(-1);
            }
        });
    };
    PracticeClient.prototype.initGameServerConnection = function () {
        var _this = this;
        try {
            this.options.files.forEach(function (file) {
                _this.otherPlayers.push(new Executable_1["default"](file, _this.onOtherPlayersData.bind(_this)));
            });
            console.log();
            console.log("Connecting to local game server...");
            console.log();
            var socketOptions = {
                reconnection: true,
                timeout: 2000
            };
            this.gameServerSocket = connect_1["default"](this.gameServerHost, this.options, socketOptions);
            this.gameServerSocket.on("error", function (data) {
                console.error("Error in socket", data);
            });
            this.gameServerSocket.on("connect", function () {
                console.log("Connected! Initiating games...");
                _this.initMatch();
            });
            this.gameServerSocket.on("disconnect", function () {
                console.log("Disconnected from game server");
            });
            this.gameServerSocket.on("exception", function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            this.gameServerSocket.on(model_1.EventName.MatchCreated, this.onMatchCreated);
            this.gameServerSocket.on(model_1.EventName.GameEnded, this.onGameEnded);
            this.gameServerSocket.on(model_1.EventName.MatchEnded, this.onMatchEnded);
        }
        catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    };
    PracticeClient.prototype.initMatch = function () {
        var matchOptions = {
            maxGames: this.options.games || 10,
            timeout: 1000,
            autoPlay: true
        };
        var players = this.options.files.map(function (file, index) { return "player" + index; });
        this.gameServerSocket.emit(model_1.EventName.CreateMatch, { players: players, options: matchOptions });
    };
    return PracticeClient;
}(Client_1["default"]));
exports["default"] = PracticeClient;
//# sourceMappingURL=PracticeClient.js.map