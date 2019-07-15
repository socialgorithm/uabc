import Player from "./Player";
export default class ExecutablePlayer extends Player {
    private playerProcess;
    constructor(file: string, onDataFromThisPlayer: (data: string) => void);
    onDataFromOtherPlayers(data: string): void;
}
