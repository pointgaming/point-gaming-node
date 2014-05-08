"use strict";

var Command = function () {
    },
    
    PointGaming = global.PointGaming;

// this function will handle the event in which a user joins or leaves a chatroom.
Command.prototype.handle = function (user, chatroom, stat) {
    if (user && chatroom && stat) {
        PointGaming.amqp_conn.sendMessageToFanoutExchange(PointGaming.amqp_conn.CHAT_EXCHANGE_PREFIX + chatroom, {
            action: "Chatroom.Member.change",
            data: {
                _id: chatroom,
                user: {
                    _id: user._id,
                    username: user.username,
                    team: user.team
                },
                "status": stat
            }
        });
    }
};

module.exports = Command;
