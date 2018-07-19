"use strict";
exports.__esModule = true;
var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage');
var info = require('../../package.json');
exports.DEFAULT_OPTIONS = {
    games: 100
};
var optionDefinitions = [
    {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'Display the client version'
    },
    {
        name: 'verbose',
        type: Boolean,
        description: 'Log everything to the console'
    },
    {
        name: 'file',
        alias: 'f',
        type: String,
        typeLabel: '{underline file}',
        defaultOption: true,
        multiple: true,
        description: 'Path to the client executable'
    },
    {
        name: 'lobby',
        alias: 'l',
        type: String,
        typeLabel: '{underline lobby}',
        description: 'Identification token for the lobby you want to play in'
    },
    {
        name: 'token',
        alias: 't',
        type: String,
        typeLabel: '{underline token}',
        description: 'Your team name or identifier'
    },
    {
        name: 'host',
        type: String,
        typeLabel: '{underline host:port}',
        description: 'host:port where the client should connect to, defaults to localhost:8123. You can specify https:// as well if SSL is required'
    },
    {
        name: 'practice',
        type: Boolean,
        alias: 'p',
        description: 'Practice mode - it will play locally against a random algorithm. It doesn\'t require a connection to a server (so no need to specify the lobby/token)'
    },
    {
        name: 'proxy',
        type: String,
        description: 'HTTP proxy to use for the web socket connection'
    },
    {
        name: 'games',
        alias: 'g',
        type: Number,
        defaultValue: exports.DEFAULT_OPTIONS.games,
        description: 'Number of games to play in practice mode, defaults to 100'
    },
    {
        name: 'log',
        type: String,
        typeLabel: '{underline [file]}',
        description: 'File where game logs should be stored, defaults to `uabc-[date].log` in the current directory if no file is specified'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this guide'
    }
];
var sections = [
    {
        header: 'uabc [--host host] -t token -f file',
        content: 'Ultimate Algorithm Battle Client'
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    },
    {
        header: 'Synopsis',
        content: [
            '$ uabc {bold --host} {underline host:1234} {bold -l} {underline lobby} {bold -t} {underline token} {bold -f} {underline path/to/client/executable}',
            '$ uabc {bold --log} {bold -p} {bold -f} {underline path/to/client/executable}',
            '$ uabc {bold --help}'
        ]
    }
];
function parseInput() {
    var options = commandLineArgs(optionDefinitions);
    Object.keys(options).map(function (key) {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    function isEmpty(map) {
        for (var key in map) {
            return !map.hasOwnProperty(key);
        }
        return true;
    }
    if (options.version) {
        console.log(info.version);
        process.exit(0);
    }
    if (options.help || isEmpty(options) || (!options.token && !options.practice) || !options.file || options.file.length < 1) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (!options.practice && options.file.length > 1) {
        console.error('uabc error: You can only specify one executable when in online mode.');
        process.exit(-1);
    }
    if (options.practice && options.file.length > 2) {
        console.error('uabc error: You can only specify up to two executables when in practice mode.');
        process.exit(-1);
    }
    return options;
}
exports["default"] = parseInput;
