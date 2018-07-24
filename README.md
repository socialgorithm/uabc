# UABC
> uabc: Ultimate Algorithm Battle - Client

This is the client to participate in [Ultimate Algorithm Battles](https://github.com/aurbano/ultimate-ttt-server)

The client executes your player, and pipes its stdin/stout to the game server over a socket.

This means that your player can be written in any language, and it will work as long as your computer can run it.

## Getting started

Install the executable:

```bash
$ npm install -g @socialgorithm/uabc
```
Verify the installation by running:

```bash
$ uabc --version
```

## Options

Run `uabc -h` to see the full list of options:

```
Main Options

  -f, --file file [file]   Path to the client executable/s (you can specify two when in practice mode,
                           separated by spaces to have two versions of your algorithm play each other).
                           If placed at the end, you don't have to put -f

Local Practice

  -p, --practice       Practice mode - it will play locally against a random algorithm. It doesn't
                       require a connection to a server (so no need to specify the lobby/token)
  -g, --games number   Number of games to play in practice mode, defaults to 100

Online Games

  -l, --lobby lobby   Identification token for the lobby you want to play in
  -t, --token token   Your team name or identifier
  --host host:port    host:port where the client should connect to, defaults to localhost:8123. You
                      can specify https:// as well if SSL is required
  --proxy string      HTTP proxy to use for the web socket connection. If the env var HTTP_PROXY is
                      set, it will automatically use that.

Helpers

  -v, --version    Display the client version
  --verbose        Log everything to the console
  --log [file]     File where game logs should be stored, defaults to `uabc-[date].log` in the
                   current directory if no file name is specified
  -h, --help       Print this guide

Synopsis

  $ uabc --host host:1234 -l lobby -t token -f path/to/client/executable
  $ uabc --log -p -f path/to/client/executable
  $ uabc --verbose ---practice "executable_1.py" "node executable_2.js"
  $ uabc --help
```

## [Player Documentation](https://socialgorithm.org/ultimate-ttt-docs/sections/player/analyse_games.html)

## Running the sample player

uabc provides a sample player that choses valid moves at random. To test it clone this repository and select it as your player:

*(Make sure you have already installed `uabc`)*

```bash
$ git clone https://github.com/socialgorithm/uabc.git
$ cd uabc
$ uabc -p -f "node dist/sample/player.js"
```
