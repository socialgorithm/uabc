const UTTT = require('ultimate-ttt');
const readline = require('readline');

/**
 * Random client implementation of the UTTT Game
 */

function input() {
  console.error('player> ready');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let game = new UTTT();

  rl.on('line', function (input) {
    const parts = input.split(' ');
    const action = parts[0];
    switch (action) {
      case 'init':
        game = new UTTT();
        console.error('init game');
        break;
      case 'move':
        write('[1,2][2,1]');
        break;
      case 'opponent':
        console.error('opponent moved', parts[1]);
        break;
    }
  });
}

function player() {
  input();
}

function write(output) {
  console.log(output);
}

player();