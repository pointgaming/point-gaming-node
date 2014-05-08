"use strict";

var Authenticator = require("../authenticator"),

    Command = function () {
        this.authenticator = new Authenticator();
    },

    processError = function (socket, error) {
        console.log(error);
        socket.emit("auth_resp", {
            success: false
        });
    },

    respond = function (socket, user) {
        socket.emit("auth_resp", {
            success: true,
            username: user.username,
            user: user
        });
    };

Command.prototype.handle = function (socket, message) {
    if (!this.authenticator) {
        processError(socket, "this.authenticator was not found");
    } else {
        this.authenticator.authenticate(message, function (err, user) {
            if (err) {
                processError(socket, err);
            } else {
                socket.setCurrentUser(user, message);
                respond(socket, user);
            }
        });
    }
};

module.exports = Command;
