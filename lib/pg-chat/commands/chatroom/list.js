"use strict";

var UserChatroom = require("../../models/user_chatroom"),
    UserChatroom = new UserChatroom(),

    handleError = function (err) {
        console.log(err);
    },

    respond = function (socket, results) {
        socket.emit("Chatroom.User.list", {
            chatrooms: results
        });
    },

    Command = function () {
    };

module.exports = Command;

// This function will handle the event in which a connected socket requests 
// a list of chatrooms that their current user is subscribed to (across all 
// socket connections).
Command.prototype.handle = function (socket, message) {
    UserChatroom.all(socket.user._id, function (err, results) {
        if (err) {
            handleError(err);
        } else {
            respond(socket, results);
        }
    });
};
