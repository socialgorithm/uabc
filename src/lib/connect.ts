import * as ioProxy from "socket.io-proxy";

import { IOptions } from "../cli/options";

export default (host: string, options: IOptions, socketOptions?: any): SocketIOClient.Socket => {
    if (options.proxy || process.env.http_proxy) {
        if (options.proxy) {
            ioProxy.init(options.proxy);
        }
        return ioProxy.connect(host, socketOptions);
    } else {
        return io.connect(host, socketOptions);
    }
};
