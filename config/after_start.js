var S = require("string");

geddy.io.sockets.on("connection", function (socket) {
    socket.on("message", function (message) {
        console.log(geddy.io.sockets);
        geddy.io.sockets.emit("chat", {
            text: S(message.text).escapeHTML().s
        });
    });
});
