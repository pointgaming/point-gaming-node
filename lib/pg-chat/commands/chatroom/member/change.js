"use strict";

var Command = function () {
    },
    
    PointGaming = global.PointGaming;

// this function will handle the event in which a user joins or leaves a chatroom.
Command.prototype.handle = function (user, chatroom, new_status) {
    if (user && chatroom && new_status) {
        PointGaming.amqp_conn.sendMessageToFanoutExchange(PointGaming.amqp_conn.CHAT_EXCHANGE_PREFIX + chatroom, {
            action: "Chatroom.Member.change",
            data: {
                _id: chatroom,
                user: {
                    _id: user._id,
                    username: user.username
                },
                "status": new_status
            }
        });
    }
};

module.exports = Command;
