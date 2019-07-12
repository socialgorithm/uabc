"use strict";
exports.__esModule = true;
var commandLineArgs = require("command-line-args");
var getUsage = require("command-line-usage");
var info = require("../../package.json");
var optionDefinitions = [
    {
        name: "file",
        alias: "f",
        type: String,
        typeLabel: "{underline file [file]}",
        defaultOption: true,
        description: "Path to the client executable/s. If placed at the end, you don't have to put -f",
        group: "main"
    },
    {
        name: "token",
        alias: "t",
        type: String,
        typeLabel: "{underline token}",
        description: "Your team name or identifier",
        group: "online"
    },
    {
        name: "lobby",
        alias: "l",
        type: String,
        typeLabel: "{underline lobby}",
        description: "Identification token for the lobby you want to play in",
        group: "online"
    },
    {
        name: "host",
        type: String,
        typeLabel: "{underline host:port}",
        description: "host:port where the client should connect to. You can specify https:// as well if SSL is required",
        group: "online"
    },
    {
        name: "proxy",
        type: String,
        description: "HTTP proxy to use for the web socket connection. If the env var HTTP_PROXY is set, it will automatically use that.",
        group: "online"
    },
    {
        name: "log",
        type: String,
        typeLabel: "{underline [file]}",
        description: "File where game logs should be stored, defaults to `uabc-[date].log` in the current directory if no file name is specified",
        group: "main"
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Print this guide",
        group: "helper"
    },
    {
        name: "version",
        alias: "v",
        type: Boolean,
        description: "Display the client version",
        group: "helper"
    },
    {
        name: "verbose",
        type: Boolean,
        description: "Log everything to the console",
        group: "helper"
    },
];
var sections = [
    {
        header: "uabc v" + info.version,
        content: [
            "Ultimate Algorithm Battle Client - #socialgorithm",
            "Documentation & more information at {underline https://play.socialgorithm.org}",
        ]
    },
    {
        header: "Main Options",
        optionList: optionDefinitions,
        group: ["main"]
    },
    {
        header: "Online Games",
        optionList: optionDefinitions,
        group: ["online"]
    },
    {
        header: "Helpers",
        optionList: optionDefinitions,
        group: ["helper", "_none"]
    },
    {
        header: "Synopsis",
        content: [
            "$ uabc {bold --host} {underline host:1234} {bold -l} {underline lobby} {bold -t} {underline token} {bold -f} {underline path/to/client/executable}",
            "$ uabc {bold --log} {bold -p} {bold -f} {underline path/to/client/executable}",
            "$ uabc {bold --help}",
        ]
    },
];
function parseInput() {
    var options = commandLineArgs(optionDefinitions)._all;
    Object.keys(options).map(function (key) {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    function isEmpty(map) {
        return Object.entries(map).length === 0 && map.constructor === Object;
    }
    if (options.version) {
        console.log(info.version);
        process.exit(0);
    }
    if (options.help || isEmpty(options) || !options.token) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (!options.file || options.file.length < 1) {
        console.error("uabc error: You must specify an executable.", options);
        process.exit(-1);
    }
    return options;
}
exports["default"] = parseInput;
//# sourceMappingURL=options.js.map