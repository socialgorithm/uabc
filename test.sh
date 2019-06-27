#!/usr/bin/env bash

NUMBER_PLAYERS=$1
LOBBY=$2
HOST=http://localhost:3141
LOG_FILE="multitest.log"

echo "Starting tests" > $LOG_FILE

for i in `seq 1 $NUMBER_PLAYERS`;
do
    yarn start --verbose --host $HOST --lobby $LOBBY --token "Player $i" -f "node ../tic-tac-toe-player/run_player.js random" >> $LOG_FILE 2>&1  &
done

echo "All clientes started"
echo

read -p "Press enter to stop all uabc processes..."

ps -e | grep $LOBBY | awk '{print $1}' | xargs kill -9
