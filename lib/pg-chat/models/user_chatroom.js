"use strict";

var PointGaming = global.PointGaming,
    Model = function () {};

module.exports = Model;

Model.prototype.key_prefix = "User.Chatrooms.";

Model.prototype.getKey = function (userId) {
    return this.key_prefix + userId;
};

Model.prototype.add = function (userId, chatroom, callback) {
    PointGaming.redis_client.zincrby(this.getKey(userId), 1, chatroom, callback);
};

Model.prototype.all = function (userId, callback) {
    PointGaming.redis_client.zrange(this.getKey(userId), 0, -1, callback);
};

Model.prototype.exists = function (userId, chatroom, callback) {
    PointGaming.redis_client.zscore(this.getKey(userId), chatroom, callback);
};

// callback(null, true) will be fired if the user has completely left the chatroom
// callback(null, false) will be fired if the users connection has left the room (successfully)
// callback(err) will be returned if there is a problem
Model.prototype.remove = function (userId, chatroom, callback) {
    var self = this;

    // decrement the number of sockets in the chat
    PointGaming.redis_client.zincrby(this.getKey(userId), -1, chatroom, function (err, data) {
        if (err) {
            callback(err);
        } else {
            // check how many sockets are left
            self.exists(userId, chatroom, function (err, count) {
                if (err) {
                    callback(err);
                } else if (count <= 0) {
                    // there"s not any sockets left so we will remove the chatroom from the list
                    PointGaming.redis_client.zrem(self.getKey(userId), chatroom);
                    callback(null, true);
                } else {
                    if (typeof callback === "function") {
                        callback(null, false);
                    }
                }
            });
        }
    });
};
