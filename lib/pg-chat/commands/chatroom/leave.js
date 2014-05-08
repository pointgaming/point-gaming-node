"use strict";

// TODO: change the "leave_chat" event name

var Command = function () {

};

module.exports = Command;

// This function will handle the event in which a connected socket leaves a chatroom.
// It will unsubscribe the users socket from the chat rooms exchange.
// It will emit events when the user leaves the chat.
Command.prototype.handle = function (socket, message) {
    if (message._id) {
        socket.unsubscribeFromExchange(message._id);
        socket.removeFromChat(message._id);

        socket.emit("leave_chat", {
            _id: message._id
        });
    }
};
