import { EventName, Messages } from "@socialgorithm/model";
import Player from "./Player";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlinePlayer extends Player {
    constructor(private socket: SocketIOClient.Socket, onDataFromThisPlayer: (data: string) => void) {
        super(onDataFromThisPlayer);

        this.socket.on(EventName.Game__Player, this.onServerData);
    }

    public setSocket(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.socket.on(EventName.Game__Player, this.onServerData);
    }

    public onDataFromOtherPlayers(payload: string) {
        console.error("OnlinePlayers should not call this.");
    }

    /**
     * When receiving output from the online player, process the message
     * and call onDataFromThisPlayer
     */
    private onServerData = ({payload}: Messages.GameToPlayerMessage) => {
        if (payload && payload.length > 0) {
            const parts = payload.split(" ");
            if (parts[0] === "end") {
                console.log("Game ended! You " + parts[1]);
            } else {
                this.onDataFromThisPlayer(payload);
            }
        } else {
            console.log("uabc: invalid data format received, it should be a string", payload);
        }
    }
}
