"use strict";

var UserSocket = require('../../models/user_socket'),
    userSocket = new UserSocket(),
    UserUsername = require('../../models/user_username'),
    userUsername = new UserUsername(),

    Command = function () {
    },

    handleUserOffline = function (socket, message) {
        socket.emit('Message.Send.fail', {
            _id: message._id,
            message: 'That user is not currently online.'
        });
    },

    handleUserNotFound = function (socket, message) {
        socket.emit('Message.Send.fail', {
            _id: message._id,
            message: 'That user was not found.'
        });
    },

    // this method will deliver a confirmation that the message was sent 
    // to all connected sockets for the current user
    deliverConfirmation = function (socket, message) {
        // TODO: this should be an API call, not an in-memory check
        userUsername.find(message._id, function (err, username) {
            if (err) {
                handleUserNotFound(socket, message);
            } else {
                socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + socket.user._id, {
                    toUser: {
                        _id: message._id,
                        username: username
                    },
                    message: message.message
                });
            }
        });
    },

    deliverMessage = function (socket, message) {
        socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + message._id, {
            fromUser: {
                _id: socket.user._id,
                username: socket.user.username
            },
            message: message.message
        });

        deliverConfirmation(socket, message);
    };

// this function will handle the event in which a connected socket sends a message 
// to another user.
Command.prototype.handle = function (socket, message) {
    if (socket.user && message._id && message.message) {
        userSocket.count(message._id, function (err, onlineSockets) {
            if (err || onlineSockets <= 0) {
                handleUserOffline(socket, message);
            } else {
                deliverMessage(socket, message);
            }
        });
    } else {
        // invalid message structure or user was not logged in
    }
};

module.exports = Command;
