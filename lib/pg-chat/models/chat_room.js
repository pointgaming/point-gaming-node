"use strict";

var Chatroom = function () {

};

Chatroom.types = {
    Dispute: {
        prefix: "Dispute_",
        regex: /^Dispute_/
    },
    Game: {
        prefix: "Game_",
        regex: /^Game_/
    },
    GameRoom: {
        prefix: "GameRoom_",
        regex: /^GameRoom_/
    },
    Private: {
        prefix: "private_",
        regex: /^private_/
    },
    Stream: {
        prefix: "Stream_",
        regex: /^Stream_/
    }
};

Chatroom.getTypeFromServerId = function (chatName) {
    if (!!chatName.match(Chatroom.types.GameRoom.regex)) {
        return "GameRoom";
    }

    if (!!chatName.match(Chatroom.types.Game.regex)) {
        return "Game";
    }

    if (!!chatName.match(Chatroom.types.Stream.regex)) {
        return "Stream";
    }

    if (!!chatName.match(Chatroom.types.Private.regex)) {
        return "Private";
    }

    if (!!chatName.match(Chatroom.types.Dispute.regex)) {
        return "Dispute";
    }

    return null;
};

Chatroom.getIdFromServerId = function (chatName, chatType) {
    return (chatType === null) ?
            chatName :
            chatName.replace(Chatroom.types[chatType].regex, "");
};

module.exports = Chatroom;
