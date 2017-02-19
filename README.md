# UABC
> uabc: Ultimate Algorithm Battle - Client

This is the client to participate in [Ultimate Algorithm Battles](https://github.com/aurbano/ultimate-ttt-server)

The client executes your player, and pipes its stdin/stout to the game server over a socket.

This means that your player can be written in any language, and it will work as long as your computer can run it.

## Getting started

Install the executable:

```bash
$ npm install -g uabc
```
Verify the installation by running:

```bash
$ uabc --version
```

## Playing

You'll need to get a valid **token** from the game server first. Let's assume that our token is `123` for now.

Simply run:

```bash
$ uabc -t 123 -f "node player.js"
```

Where `player.js` is your player. Another example, if it was a Java program:

```bash
$ uabc -t 123 -f "java Player"
```

You don't need the server running to start the client, it will automatically detect the server and connect to it when it comes up.