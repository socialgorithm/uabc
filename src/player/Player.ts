/**
 * A Player represents one player of the two required to play a game.
 *
 * It exposes the necessary methods to interact with it (sendData, receiveData)
 */
export default abstract class Player {

    constructor(public onDataFromThisPlayer: (data: string) => void) {}

    /**
     * Used when uabc is interacting with a player as a proxy with game server.
     * @param data payload for the server
     */
    public abstract onDataFromOtherPlayers(data: string): void;
}
