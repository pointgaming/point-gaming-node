var client = require("redis").createClient(),
    User = geddy.model.User,
    S = require("string");

geddy.io.sockets.on("connection", function (socket) {
    socket.on("message", function (message) {
        if (!message.sessionID) {
            return;
        }

        client.hget(message.sessionID, "userId", function (err, userId) {
            var id = userId.replace(/"/g, "");

            if (userId && !err) {
                User.first({ id: id }, function (err, _user) {
                    if (_user && !err) {
                        geddy.io.sockets.emit("chat", {
                            username: _user.username,
                            text: S(message.text).escapeHTML().s
                        });
                    }
                });
            }
        });
    });
});
