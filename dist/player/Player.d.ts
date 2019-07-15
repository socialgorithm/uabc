export default abstract class Player {
    onDataFromThisPlayer: (data: string) => void;
    constructor(onDataFromThisPlayer: (data: string) => void);
    abstract onDataFromOtherPlayers(data: string): void;
}
