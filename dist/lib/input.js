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
        description: 'Display the client version',
        group: 'helper'
    },
    {
        name: 'verbose',
        type: Boolean,
        description: 'Log everything to the console',
        group: 'helper'
    },
    {
        name: 'log',
        type: String,
        typeLabel: '{underline [file]}',
        description: 'File where game logs should be stored, defaults to `uabc-[date].log` in the current directory if no file name is specified',
        group: 'helper'
    },
    {
        name: 'lobby',
        alias: 'l',
        type: String,
        typeLabel: '{underline lobby}',
        description: 'Identification token for the lobby you want to play in',
        group: 'online'
    },
    {
        name: 'token',
        alias: 't',
        type: String,
        typeLabel: '{underline token}',
        description: 'Your team name or identifier',
        group: 'online'
    },
    {
        name: 'host',
        type: String,
        typeLabel: '{underline host:port}',
        description: 'host:port where the client should connect to, defaults to localhost:8123. You can specify https:// as well if SSL is required',
        group: 'online'
    },
    {
        name: 'practice',
        type: Boolean,
        alias: 'p',
        description: 'Practice mode - it will play locally against a random algorithm. It doesn\'t require a connection to a server (so no need to specify the lobby/token)',
        group: 'practice'
    },
    {
        name: 'proxy',
        type: String,
        description: 'HTTP proxy to use for the web socket connection. If the env var HTTP_PROXY is set, it will automatically use that.',
        group: 'online'
    },
    {
        name: 'games',
        alias: 'g',
        type: Number,
        defaultValue: exports.DEFAULT_OPTIONS.games,
        description: 'Number of games to play in practice mode, defaults to 100',
        group: 'practice'
    },
    {
        name: 'file',
        alias: 'f',
        type: String,
        typeLabel: '{underline file [file]}',
        defaultOption: true,
        multiple: true,
        description: 'Path to the client executable/s (you can specify two when in practice mode, separated by spaces to have two versions of your algorithm play each other). If placed at the end, you don\'t have to put -f',
        group: 'main'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this guide',
        group: 'helper'
    }
];
var sections = [
    {
        header: "uabc v" + info.version,
        content: [
            'Ultimate Algorithm Battle Client - #socialgorithm',
            'Documentation & more information at {underline https://play.socialgorithm.org}'
        ]
    },
    {
        header: 'Main Options',
        optionList: optionDefinitions,
        group: ['main']
    },
    {
        header: 'Local Practice',
        optionList: optionDefinitions,
        group: ['practice']
    },
    {
        header: 'Online Games',
        optionList: optionDefinitions,
        group: ['online']
    },
    {
        header: 'Helpers',
        optionList: optionDefinitions,
        group: ['helper', '_none']
    },
    {
        header: 'Synopsis',
        content: [
            '$ uabc {bold --host} {underline host:1234} {bold -l} {underline lobby} {bold -t} {underline token} {bold -f} {underline path/to/client/executable}',
            '$ uabc {bold --log} {bold -p} {bold -f} {underline path/to/client/executable}',
            '$ uabc {bold --verbose} {bold ---practice} "{underline executable_1.py}" "{underline node executable_2.js}"',
            '$ uabc {bold --help}'
        ]
    }
];
function parseInput() {
    var options = commandLineArgs(optionDefinitions)._all;
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
    if (options.help || isEmpty(options) || (!options.token && !options.practice)) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (!options.file || options.file.length < 1) {
        console.error('uabc error: You must specify at least one executable.', options);
        process.exit(-1);
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
