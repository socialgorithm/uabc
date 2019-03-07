"use strict";
exports.__esModule = true;
exports.round = function (time) {
    return Math.round(time * 100) / 100;
};
exports.convertExecTime = function (nanosecs) {
    return exports.round(nanosecs / 1000000);
};
exports.getPercentage = function (num, total) {
    if (total < 1) {
        return '0%';
    }
    return Math.floor(num * 100 / total) + '%';
};
exports.parseMove = function (data) {
    var parts = data.split(';');
    var boardStr = parts[0].split(',');
    if (parts.length > 1) {
        var moveStr = parts[1].split(',');
        var board = [
            parseInt(boardStr[0], 10),
            parseInt(boardStr[1], 10)
        ];
        var move = [
            parseInt(moveStr[0], 10),
            parseInt(moveStr[1], 10)
        ];
        return {
            board: board,
            move: move
        };
    }
    else {
        var move = [
            parseInt(boardStr[0], 10),
            parseInt(boardStr[1], 10)
        ];
        return { board: null, move: move };
    }
    console.error('Unknown command', data);
    return null;
};
