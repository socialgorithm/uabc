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
var Client_1 = require("./model/Client");
var OnlineClient = (function (_super) {
    __extends(OnlineClient, _super);
    function OnlineClient(options) {
        var _this = _super.call(this, options) || this;
        console.log();
        console.log('Waiting for server...');
        console.log();
        try {
            var host = options.host || 'localhost:3141';
            if (host.substr(0, 4) !== 'http') {
                host = 'http://' + host;
            }
            _this.socket = io.connect(host, {
                query: {
                    token: options.token
                }
            });
            _this.socket.on('error', function (data) {
                console.error('Error in socket', data);
            });
            _this.socket.on('connect', function () {
                console.log('Connected!');
            });
            _this.socket.on('game', function (data) {
                if (data.action && data.action.length > 0) {
                    var parts = data.action.split(' ');
                    if (parts[0] === 'end') {
                        console.log('Games ended! You ' + parts[1]);
                    }
                    else {
                        _this.sendData(data.action);
                    }
                }
            });
            _this.socket.on('disconnect', function () {
                console.log('Connection lost!');
            });
        }
        catch (e) {
            console.error('Error running player', e);
        }
        return _this;
    }
    OnlineClient.prototype.onPlayerData = function (data) {
        this.socket.emit('game', data);
    };
    OnlineClient.prototype.onDisconnect = function () {
        this.socket.disconnect();
    };
    return OnlineClient;
}(Client_1["default"]));
exports["default"] = OnlineClient;
//# sourceMappingURL=OnlineClient.js.map