"use strict";

var MessageHandler = require("./message/receive"),
    MessageHandler = new MessageHandler(),
    MemberChange = require("./member/change"),
    memberChange = new MemberChange(),
    async = require("async");

// TODO: change the "join_chat" event name

var Command = function () {

};

// This function will handle the event in which a connected socket joins a chatroom.
// It will check if the user has permission to join the room if it is private.
// It will subscribe the users socket to the chat rooms exchange.
// It will emit events when the user joins the chat.
Command.prototype.handle = function (socket, message) {
    if (message._id) {
        if (message._id.substr(0, 8) === "private_") {
            ensureUserCanJoinPrivateChat(socket.user, message, function (err) {
                if (err) handleError(err, socket, message);
                else joinChat(socket, message);
            });
        } else {
            joinChat(socket, message);
        }
    } else {
        socket.emit("join_chat", {
            success: false
        });
    }
};


var ensureUserCanJoinPrivateChat = function (user, message, callback) {
    // check if there are other users connected to the chat
    PointGaming.models.ChatroomMember.count(message._id, function (err, count) {
        if (err) {
            callback(err);
        } else if (count === 0) {
            // the user can freely join private rooms when there are no other users in them.
            callback(null);
        } else {
            async.parallel({
                isInvitedToChat: PointGaming.models.ChatroomInvite.exists.bind(PointGaming.models.ChatroomInvite, message._id, user._id),
                isCurrentlyInChat: PointGaming.models.ChatroomMember.exists.bind(PointGaming.models.ChatroomMember, message._id, user._id)
            }, function (err, results) {
                if (err) {
                    callback(err);
                } else if (!results.isInvitedToChat && results.isCurrentlyInChat === null) {
                    callback(new Error("Permission Denied."));
                } else {
                    if (results.isInvitedToChat) {
                        PointGaming.models.ChatroomInvite.remove(message._id, user._id, callback);
                    }
                    callback(null);
                }
            });
        }
    });
};

var joinChat = function (socket, message) {
    socket.subscribeToExchange(socket.CHAT_EXCHANGE_PREFIX + message._id, MessageHandler.handle.bind(MessageHandler, socket));

    PointGaming.models.ChatroomMember.add(message._id, socket.user._id);
    PointGaming.models.UserChatroom.add(socket.user._id, message._id, function (err, userSocketCountInChat) {
        if (userSocketCountInChat === "1") {
            memberChange.handle(socket.user, message._id, "joined");
        }
    });
    PointGaming.models.SocketChatroom.add(socket.socket.id, message._id);

    socket.emit("join_chat", {
        success: true
    });
};

var handleError = function (err, socket, message) {
    socket.emit("join_chat", {
        success: false,
        message: "There was an error when joining the chat."
    });
};

module.exports = Command;
