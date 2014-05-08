"use strict";

var PointGaming = global.PointGaming,
    Model = function () {
    };

module.exports = Model;

Model.prototype.key_prefix = "Chatroom.Invites.";

Model.prototype.getKey = function (chatroom) {
    return this.key_prefix + chatroom;
};

Model.prototype.add = function (chatroom, userId, callback) {
    PointGaming.redis_client.sadd(this.getKey(chatroom), userId, callback);
};

Model.prototype.all = function (chatroom, callback) {
    PointGaming.redis_client.smembers(this.getKey(chatroom), callback);
};

Model.prototype.exists = function (chatroom, userId, callback) {
    PointGaming.redis_client.sismember(this.getKey(chatroom), userId, callback);
};

Model.prototype.remove = function (chatroom, userId, callback) {
    PointGaming.redis_client.srem(this.getKey(chatroom), userId, callback);
};
