"use strict";
exports.__esModule = true;
var readline = require("readline");
var random_1 = require("./random");
function input() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var player = new random_1["default"](1);
    rl.on('line', function (input) {
        var parts = input.split(' ');
        var action = parts[0];
        var next, move, coords;
        switch (action) {
            case 'init':
                player.init();
                break;
            case 'move':
                try {
                    coords = player.getMove();
                    player.addMove(coords.board, coords.move);
                    writeMove(coords);
                }
                catch (e) {
                    console.log('fail');
                }
                break;
            case 'opponent':
                next = parts[1].split(';');
                var boardCoords = next[0].split(',').map(function (coord) { return parseInt(coord, 10); });
                var moveCoords = next[1].split(',').map(function (coord) { return parseInt(coord, 10); });
                player.addOpponentMove([
                    boardCoords[0],
                    boardCoords[1]
                ], [
                    moveCoords[0],
                    moveCoords[1]
                ]);
                try {
                    coords = player.getMove();
                    player.addMove(coords.board, coords.move);
                    writeMove(coords);
                }
                catch (e) {
                    console.log('fail');
                }
                break;
        }
    });
}
function writeMove(coords) {
    var move = coords.board[0] + ',' + coords.board[1] + ';' +
        coords.move[0] + ',' + coords.move[1];
    write(move);
}
function player() {
    input();
}
function write(output) {
    if (output) {
        console.log(output);
    }
}
player();
//# sourceMappingURL=player.js.map