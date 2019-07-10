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
var io = require("socket.io-client");
var ioProxy = require("socket.io-proxy");
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
            if (options.proxy || process.env.http_proxy) {
                if (options.proxy) {
                    ioProxy.init(options.proxy);
                }
                _this.socket = ioProxy.connect(host, socketOptions);
            }
            else {
                _this.socket = io.connect(host, socketOptions);
            }
            _this.playerB = new Online_1["default"](_this.socket, _this.onPlayerBData.bind(_this));
            _this.socket.on("error", function (data) {
                console.error("Error in socket", data);
            });
            _this.socket.on("connect", function () {
                console.log("Connected! Joining Lobby \"" + options.lobby + "\"...");
                _this.socket.emit("lobby join", {
                    token: options.lobby
                });
            });
            _this.socket.on("lobby joined", function () {
                console.log("Lobby Joined! Waiting for tournament to begin...");
            });
            _this.socket.on("exception", function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.socket.on("lobby exception", function (data) {
                console.error(data.error);
                process.exit(-1);
            });
            _this.socket.on("disconnect", function () {
                console.log("Connection lost!");
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
        this.socket.emit("game", data);
    };
    OnlineClient.prototype.onPlayerBData = function (data) {
        this.log("B", data);
        this.playerA.sendData(data);
    };
    return OnlineClient;
}(Client_1["default"]));
exports["default"] = OnlineClient;
//# sourceMappingURL=OnlineClient.js.map