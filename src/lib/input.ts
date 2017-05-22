import * as commandLineArgs from 'command-line-args';
import * as getUsage from 'command-line-usage';
const info = require('../../package.json');

// type safe options
export interface Options {
  version: boolean;
  verbose: boolean;
  file: string;
  token: string;
  host: string;
  practice: boolean;
  log: string;
  help: boolean;
}

const optionDefinitions = [
  {
    name: 'version',
    alias: 'v',
    description: 'Display the client version'
  },
  {
    name: 'verbose',
    description: 'Log everything to the console'
  },
  {
    name: 'file',
    alias: 'f',
    typeLabel: '[underline]{file}',
    description: 'Path to the client executable'
  },
  {
    name: 'token',
    alias: 't',
    typeLabel: '[underline]{token}',
    description: 'Identification token for the game server'
  },
  {
    name: 'host',
    typeLabel: '[underline]{host:port}',
    description: 'host:port where the client should connect to, defaults to localhost:8123. You can specify https:// as well if SSL is required'
  },
  {
    name: 'practice',
    alias: 'p',
    description: 'Practice mode - it will play locally against a random algorithm. It doesn\'t require a connection to a server'
  },
  {
    name: 'log',
    alias: 'l',
    typeLabel: '[underline]{[file]}',
    description: 'File where game logs should be stored, defaults to `uabc-{date}.log` in the current directory if no file is specified'
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Print this guide'
  }
];

const sections = [
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
      '$ uabc [bold]{--host} [underline]{host:1234} [bold]{-t} [underline]{token} [bold]{-f} [underline]{path/to/client/executable}',
      '$ uabc [bold]{--help}'
    ]
  }
];

// ------------------------------------------- //

export default function parseInput(): Options {
  const options = commandLineArgs(optionDefinitions);

  Object.keys(options).map((key: string) => {
    if (options[key] === null) {
      options[key] = true;
    }
  });

  function isEmpty(map: any) {
    for(let key in map) {
      return !map.hasOwnProperty(key);
    }
    return true;
  }

  if (options.version) {
    console.log(info.version);
    process.exit(0);
  }

  if (options.help || isEmpty(options) || !options.token || !options.file) {
    console.log(getUsage(sections));
    process.exit(0);
  }

  return options;
}

// ------------------------------------------- //