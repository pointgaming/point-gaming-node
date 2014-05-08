"use strict";

var Command = function () {

};

module.exports = Command;

// this function will handle the event in which a connected socket sends a message 
// to a chatroom. It will build the new chat message and then push it into the 
// chatrooms exchange.
Command.prototype.handle = function (socket, message) {
    if (socket.user && message._id && message.message) {
        socket.sendMessageToExchange(socket.CHAT_EXCHANGE_PREFIX + message._id, {
            _id: message._id,
            fromUser: {
                _id: socket.user._id,
                username: socket.user.username
            },
            message: message.message
        });
    }
};
