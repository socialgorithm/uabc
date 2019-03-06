#!/usr/bin/env bash

NUMBER_PLAYERS=$1
LOBBY=$2
HOST=http://localhost:3141

for i in `seq 1 $NUMBER_PLAYERS`;
do
    yarn start --host $HOST --lobby $LOBBY --token "Player $i" -f "node dist/sample/player.js" > multitest.log  &
done

echo "All clientes started"
echo

read -p "Press enter to stop all uabc processes..."

ps -e | grep $LOBBY | awk '{print $1}' | xargs kill -9
