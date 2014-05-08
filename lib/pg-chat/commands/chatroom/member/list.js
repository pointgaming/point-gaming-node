"use strict";

var ChatroomMember = require("../../../models/chatroom_member"),
    chatroomMember = new ChatroomMember(),
    Chatroom = require("../../../models/chat_room"),
    GameRoomApiClient = require("../../../api/game_room"),
    UserApiClient = require("../../../api/user"),

    handleError = function (chatroom, message) {
        console.log("Failed to getMembersForChatroom " + chatroom + ": " + message);
    },

    respond = function (socket, chatroom, results) {
        socket.emit("Chatroom.Member.list", {
            _id: chatroom,
            members: results
        });
    },

    Command = function () {
    };

// This function will handle the event in which a connected socket requests 
// a list of members within a chatroom. 
Command.prototype.handle = function (socket, message) {
    var id = message._id;

    if (id) {
        this.getMembersForChatroom(id, function (err, members) {
            if (err) {
                handleError(id, err);
            } else {
                respond(socket, id, members);
            }
        });
    }
};

Command.prototype.getMembersForChatroom = function (chatroom, callback) {
    chatroomMember.all(chatroom, function (err, user_ids) {
        if (err) {
            callback(err);
        } else {
            UserApiClient.getUsers(user_ids).on("complete", function (data) {
                if (data instanceof Error) {
                    callback(data.message);
                } else {
                    callback(null, data.users || []);
                }
            });
        }
    });
};

module.exports = Command;
