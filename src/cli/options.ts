// using require because these packages are missing definitions
// tslint:disable:no-var-requires
const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
const info = require("../../package.json");

export interface IOptions {
  files?: string[];
  token?: string;
  lobby?: string;
  host?: string;
  proxy?: string;
  log?: string;
  help?: boolean;
  verbose?: boolean;
  version?: boolean;
  practice?: string;
  games?: number;
}

const optionDefinitions = [
  {
    name: "files",
    alias: "f",
    type: String,
    typeLabel: "{underline file}",
    defaultOption: true,
    multiple: true,
    description: "Path to the client executable/s. If placed at the end, you don't have to put -f. You can pass multiple executables when in practice mode.",
    group: "main",
  },
  {
    name: "token",
    alias: "t",
    type: String,
    typeLabel: "{underline token}",
    description: "Your team name or identifier",
    group: "online",
  },
  {
    name: "lobby",
    alias: "l",
    type: String,
    typeLabel: "{underline lobby}",
    description: "The name of the lobby you want to play in",
    group: "online",
  },
  {
    name: "host",
    type: String,
    typeLabel: "{underline host:port}",
    description: "host:port where the client should connect to. You can specify https:// as well if SSL is required. Also used by practice mode to override the local game server port.",
    group: "online",
  },
  {
    name: "proxy",
    type: String,
    description: "HTTP proxy to use for the web socket connection. If the env var HTTP_PROXY is set, it will automatically use that.",
    group: "online",
  },
  {
    name: "log",
    type: String,
    typeLabel: "{underline [file]}",
    description: "Turn on file logging. It accepts an optional log filename if you want to override the default (`uabc-[date].log` in the current directory)",
    group: "helper",
  },
  {
    name: "verbose",
    type: Boolean,
    description: "Turn on console logging.",
    group: "helper",
  },
  {
    name: "version",
    alias: "v",
    type: Boolean,
    description: "Displays the uabc client version",
    group: "helper",
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Print this guide",
    group: "helper",
  },
  {
    name: "practice",
    alias: "p",
    type: String,
    typeLabel: "{underline game}",
    description: "Use uabc in practice mode (playing locally), you must specify here what game to use",
    group: "practice",
  },
  {
    name: "games",
    type: Number,
    description: "Number of games to play in practice mode (Defaults to 10)",
    group: "practice",
  },
];

const sections = [
  {
    header: `uabc v${info.version}`,
    content: [
      "Ultimate Algorithm Battle Client - #socialgorithm",
      "Documentation & more information at {underline https://play.socialgorithm.org}",
    ],
  },
  {
    header: "Main Options",
    optionList: optionDefinitions,
    group: ["main"],
  },
  {
    header: "Online Games",
    optionList: optionDefinitions,
    group: ["online"],
  },
  {
    header: "Practice (Offline Games)",
    optionList: optionDefinitions,
    group: ["practice"],
  },
  {
    header: "Helpers",
    optionList: optionDefinitions,
    group: ["helper", "_none"],
  },
  {
    header: "Synopsis",
    content: [
      "$ uabc {bold --host} {underline host:1234} {bold -l} {underline lobby} {bold -t} {underline token} {bold -f} {underline path/to/client/executable}",
      "$ uabc {bold --log} {bold --practice} {underline tic-tac-toe} {bold -f} {underline \"python player1.py\"} {underline \"node player2.js\"}",
      "$ uabc {bold --help}",
    ],
  },
];

export default function parseInput(): IOptions {
  const options = commandLineArgs(optionDefinitions)._all;

  Object.keys(options).map((key: string) => {
    if (options[key] === null) {
      options[key] = true;
    }
  });

  console.log("files", options.file);

  function isEmpty(map: any) {
    return Object.entries(map).length === 0 && map.constructor === Object;
  }

  if (options.version) {
    console.log(info.version);
    process.exit(0);
  }

  const practiceMode = !!options.practice;

  if (options.help || isEmpty(options) || (!options.token && !practiceMode)) {
    console.log(getUsage(sections));
    process.exit(0);
  }

  if (practiceMode && options.practice.length < 1) {
    error("You must specify a game when in practice mode.");
    process.exit(-1);
  }

  if (!options.file || options.file.length < 1) {
    error("You must specify an executable.");
    process.exit(-1);
  }

  return options;
}

function error(message: string) {
  console.error("uabc error:", message);
}
