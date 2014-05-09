"use strict";

var Chatroom = require("./chat_room"),
    GameRoomApiClient = require("../api/game_room"),
    LobbyApiClient = require("../api/lobby"),
    UserApiClient = require("../api/user"),
    PointGaming = global.PointGaming,
    ChatroomMember = function () {},

    handleError = function (err) {
        console.log(err);
    },

    eventCallbacks = {
        afterAdd: {
            // tell the rails server that the user has joined the lobby
            Game: function (chatName, userId, chatId, callback, returnValue) {
                if (returnValue === 1) {
                    LobbyApiClient.join(chatId, userId);
                }
                callback(null, returnValue);
            },

            // tell the rails server that the user has joined the game room
            GameRoom: function (chatName, userId, chatId, callback, returnValue) {
                if (returnValue === 1) {
                    GameRoomApiClient.joinGameRoom(chatId, userId);
                }
                callback(null, returnValue);
            },

            // increment the number of users viewing the stream
            Stream: function (chatName, userId, chatId, callback, returnValue) {
                if (returnValue === 1) {
                    PointGaming.stream_api_client.incrementViewerCount(chatId, 1, function (err, data) {});
                }
                callback(null, returnValue);
            },
            Dispute: function (chatName, userId, chatId, callback, returnValue) {
                if (returnValue === 1) {
                    UserApiClient.getUser(userId).on("complete", function (data, response) {
                        if (data instanceof Error) {
                            handleError(data.message);
                        } else {
                            if (data.user && data.user.admin === true) {
                                PointGaming.dispute_api_client.incrementAdminViewerCount(chatId, 1, function (err, data) {});
                            } else {
                                PointGaming.dispute_api_client.incrementUserViewerCount(chatId, 1, function (err, data) {});
                            }
                        }
                    });
                }
                callback(null, returnValue);
            }
        },

        afterRemove: {
            // tell the rails server that the user has left the lobby
            Game: function (chatName, userId, chatId, callback, returnValue) {
                LobbyApiClient.leave(chatId, userId).on("complete", function (result) {
                    callback(null, returnValue);
                });
            },

            // tell the rails server that the user has left the game room
            GameRoom: function (chatName, userId, chatId, callback, returnValue) {
                GameRoomApiClient.leaveGameRoom(chatId, userId).on("complete", function (result) {
                    callback(null, returnValue);
                });
            },

            Dispute: function (chatName, userId, chatId, callback, returnValue) {
                UserApiClient.getUser(userId).on("complete", function (data, response) {
                    if (data instanceof Error) {
                        handleError(data.message);
                    } else {
                        if (data.user && data.user.admin === true) {
                            PointGaming.dispute_api_client.incrementAdminViewerCount(chatId, -1, function (err, data) {});
                        } else {
                            PointGaming.dispute_api_client.incrementUserViewerCount(chatId, -1, function (err, data) {});
                        }
                    }
                });
            },

            // decrement the number of users viewing the stream
            Stream: function (chatName, userId, chatId, callback, returnValue) {
                PointGaming.stream_api_client.incrementViewerCount(chatId, -1, function (err, data) {});
                callback(null, returnValue);
            }
        }
    },

    runCallbacksForEvent = function (eventName, chatName, userId, callback, err, returnValue) {
        var chatType = Chatroom.getTypeFromServerId(chatName),
            chatId = Chatroom.getIdFromServerId(chatName, chatType);

        if (typeof callback !== "function") {
            callback = function () {};
        }

        // check if there is an callback specific to this eventName and chatType
        if (chatType && eventCallbacks && eventCallbacks[eventName] && typeof eventCallbacks[eventName][chatType] === "function") {
            eventCallbacks[eventName][chatType].bind(this)(chatName, userId, chatId, callback, returnValue);
        } else {
            callback(null, returnValue);
        }
    };

ChatroomMember.prototype.key_prefix = "Chat.Members.";

ChatroomMember.prototype.getKey = function (chatName) {
    return this.key_prefix + chatName;
};

ChatroomMember.prototype.add = function (chatName, userId, callback) {
    PointGaming.redis_client.sadd(this.getKey(chatName), userId,
        runCallbacksForEvent.bind(this, "afterAdd", chatName, userId, callback));
};

ChatroomMember.prototype.all = function (chatName, callback) {
    PointGaming.redis_client.smembers(this.getKey(chatName), callback);
};

ChatroomMember.prototype.count = function (chatName, callback) {
    PointGaming.redis_client.scard(this.getKey(chatName), callback);
};

ChatroomMember.prototype.exists = function (chatName, userId, callback) {
    PointGaming.redis_client.sismember(this.getKey(chatName), userId, callback);
};

ChatroomMember.prototype.remove = function (chatName, userId, callback) {
    PointGaming.redis_client.srem(this.getKey(chatName), userId,
        runCallbacksForEvent.bind(this, "afterRemove", chatName, userId, callback));
};

module.exports = ChatroomMember;
