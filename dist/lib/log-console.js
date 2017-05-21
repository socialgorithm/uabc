module.exports = function (writer, data) {
    var time = (new Date()).toTimeString().substr(0, 8);
    console.log('[' + time + ' ' + writer + '] ' + data);
};
//# sourceMappingURL=log-console.js.map