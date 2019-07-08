"use strict";
exports.__esModule = true;
var io = require("socket.io-client");
var OnlineClient_1 = require("./client/OnlineClient");
var numberOfLobbies = 10;
var playersPerLobby = 10;
var _loop_1 = function (lobbyNumber) {
    console.log("Creating lobby " + lobbyNumber);
    var lobbyAdminToken = "token=" + lobbyNumber + "-admin";
    var lobbyAdminSocket = io.connect("http://localhost:3141", { query: { client: true, token: lobbyAdminToken } });
    lobbyAdminSocket.on('lobby created', function (data) {
        var lobbyName = data.lobby.token;
        console.log("Created lobby " + lobbyName);
        var players = [];
        for (var playerNumber = 1; playerNumber <= playersPerLobby; playerNumber++) {
            var playerName = lobbyName + "-player-" + playerNumber;
            players.push(playerName);
            var player = new OnlineClient_1["default"]({
                host: 'localhost:3141',
                lobby: lobbyName,
                token: playerName,
                file: ["node ../tic-tac-toe-player/run_player.js random"]
            });
        }
        setTimeout(function () {
            lobbyAdminSocket.emit('lobby tournament start', {
                token: lobbyName,
                options: {
                    token: lobbyName,
                    gameAddress: 'http://localhost:5433',
                    autoPlay: true,
                    numberOfGames: 50,
                    timeout: 100,
                    type: 'DoubleElimination'
                },
                players: players
            });
        }, 10000);
    });
    lobbyAdminSocket.emit('lobby create');
};
for (var lobbyNumber = 1; lobbyNumber <= numberOfLobbies; lobbyNumber++) {
    _loop_1(lobbyNumber);
}
