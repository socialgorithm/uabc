import Player from "./Player";
export default class ExecutablePlayer extends Player {
    private playerProcess;
    constructor(file: string, sendData: (data: string) => void);
    protected onReceiveData(data: string): void;
}
