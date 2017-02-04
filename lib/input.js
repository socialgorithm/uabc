const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const info = require('../package.json');

const optionDefinitions = [
  {
    name: 'verbose',
    description: 'The input to process.'
  },
  {
    name: 'version',
    alias: 'v',
    description: 'Display the client version'
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
    description: 'host:port where the client should connect to, defaults to localhost:8123'
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

function parseInput() {
  const options = commandLineArgs(optionDefinitions);

  function isEmpty(map) {
    for(let key in map) {
      return !map.hasOwnProperty(key);
    }
    return true;
  }

  if (options.version) {
    console.log(info.version);
    return;
  }

  if (options.help || isEmpty(options) || !options.a || !options.b) {
    console.log(getUsage(sections));
    return;
  }

  return options;
}

module.exports = parseInput;

// ------------------------------------------- //