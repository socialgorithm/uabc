import * as io from 'socket.io-client';
import OnlineClient from './client/OnlineClient';

const numberOfLobbies = 10;
const playersPerLobby = 10;

for(let lobbyNumber = 1; lobbyNumber <= numberOfLobbies; lobbyNumber++) {
    console.log(`Creating lobby ${lobbyNumber}`);
    const lobbyAdminToken = `token=${lobbyNumber}-admin`
    const lobbyAdminSocket = io.connect(
        "http://localhost:3141", 
        { query: { client: true, token: lobbyAdminToken } } 
    );
    lobbyAdminSocket.on('lobby created', (data: any) => {
        const lobbyName = data.lobby.token;
        console.log(`Created lobby ${lobbyName}`);
        
        const players: string[] = [];

        //Connect players
        for(let playerNumber = 1; playerNumber <= playersPerLobby; playerNumber++) {
            const playerName = `${lobbyName}-player-${playerNumber}`
            players.push(playerName);
            const player = new OnlineClient({
                host: 'localhost:3141', 
                lobby: lobbyName, 
                token: playerName, 
                file: ["node ../tic-tac-toe-player/run_player.js random"]});
        }

        setTimeout(() => { lobbyAdminSocket.emit('lobby tournament start', {
            token: lobbyName,
            options: { 
                token: lobbyName, 
                gameAddress: 'http://localhost:5433',
                autoPlay: true,
                numberOfGames: 50,
                timeout: 100,
                type: 'DoubleElimination' },
	        players: players,
        }) }, 10000);
    });
    lobbyAdminSocket.emit('lobby create');
}