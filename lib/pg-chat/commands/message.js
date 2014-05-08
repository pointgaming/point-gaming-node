"use strict";

// TODO: we will probably remove this after talking with Dean
var Command = function () {
};

Command.prototype.handle = function (socket, message) {
    var newMessage;

    if (message.user_id && message.message) {
        newMessage = {
            user_id: socket.user._id,
            message: message.message
        };

        socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + message.user_id, newMessage);
    }
};

module.exports = Command;
