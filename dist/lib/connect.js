"use strict";
exports.__esModule = true;
var io = require("socket.io-client");
var ioProxy = require("socket.io-proxy");
exports["default"] = (function (host, options, socketOptions) {
    if (options.proxy || process.env.http_proxy) {
        if (options.proxy) {
            ioProxy.init(options.proxy);
        }
        return ioProxy.connect(host, socketOptions);
    }
    else {
        return io.connect(host, socketOptions);
    }
});
//# sourceMappingURL=connect.js.map