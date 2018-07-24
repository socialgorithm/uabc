/**
 * A Player represents one player of the two required to play a game.
 * 
 * It exposes the necessary methods to interact with it (sendData, receiveData)
 */
export default abstract class Player {
    
    constructor(public onPlayerData: (data: string) => void) {}

    public sendData(data: string) {
        this.onReceiveData(data);
    }

    protected abstract onReceiveData(data: string): void;
}