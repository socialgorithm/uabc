export default abstract class Player {
    onPlayerData: (data: string) => void;
    constructor(onPlayerData: (data: string) => void);
    sendData(data: string): void;
    protected abstract onReceiveData(data: string): void;
}
