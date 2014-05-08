"use strict";

var Join = require("./join"),
    Leave = require("./leave"),
    List = require("./list"),
    Message = {
        Send: require("./message/send")
    },
    Member = {
        List: require("./member/list")
    },
    Invite = {
        Send: require("./invite/send"),
        Receive: require("./invite/receive")
    };

module.exports = {
    join: new Join(),
    leave: new Leave(),
    list: new List(),
    message: {
        send: new Message.Send()
    },
    member: {
        list: new Member.List()
    },
    invite: {
        send: new Invite.Send(),
        receive: new Invite.Receive()
    }
};
