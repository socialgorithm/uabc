"use strict";
exports.__esModule = true;
var input_1 = require("./lib/input");
var exec_1 = require("./lib/exec");
var io = require("socket.io-client");
var FileLogger_1 = require("./lib/FileLogger");
var ConsoleLogger_1 = require("./lib/ConsoleLogger");
var random_1 = require("./sample/random");
main();
function main() {
    var options = input_1["default"]();
    console.info("+----------------------------------+");
    console.info("|     Ultimate Algorithm Battle    |");
    console.info("+----------------------------------+");
    var fileLogger;
    if (options.log) {
        if (options.log.length > 0) {
            fileLogger = new FileLogger_1["default"](options.log);
        }
        else {
            var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /, '_');
            fileLogger = new FileLogger_1["default"]('uabc-' + date + '.log');
        }
    }
    var practiceGame = null;
    if (options.practice) {
        practiceGame = new random_1["default"](1);
    }
    console.log();
    console.log('Waiting for server...');
    console.log();
    function log(writer, data) {
        if (options.verbose) {
            ConsoleLogger_1["default"].log(writer, data);
        }
        if (options.log) {
            fileLogger.log(writer, data);
        }
    }
    try {
        var player_1 = exec_1["default"](options.file);
        var host = options.host || 'localhost:3141';
        if (host.substr(0, 4) !== 'http') {
            host = 'http://' + host;
        }
        var socket_1 = io.connect(host, {
            query: {
                token: options.token
            }
        });
        player_1.on('close', function (code) {
            console.log("client> child process exited with code " + code);
            socket_1.disconnect();
        });
        socket_1.on('error', function (data) {
            console.error('Error in socket', data);
        });
        socket_1.on('connect', function () {
            console.log('Connected!');
        });
        socket_1.on('game', function (data) {
            log('server', data.action);
            if (data.action && data.action.length > 0) {
                var parts = data.action.split(' ');
                if (parts[0] === 'end') {
                    console.log('Games ended! You ' + parts[1]);
                }
                else {
                    player_1.stdin.write(data.action + "\n");
                    if (parts[0] === 'init' && practiceGame) {
                        practiceGame.init();
                    }
                }
            }
        });
        player_1.stdout.on('data', function (data) {
            log('player', data);
            if (!options.practice) {
                socket_1.emit('game', data);
            }
            else {
            }
        });
        socket_1.on('disconnect', function () {
            console.log('Connection lost!');
        });
    }
    catch (e) {
        console.error('Error running player', e);
    }
}
//# sourceMappingURL=index.js.map