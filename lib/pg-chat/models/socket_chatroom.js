"use strict";

var PointGaming = global.PointGaming,
    Model = function () {};

module.exports = Model;

Model.prototype.key_prefix = "Socket.Chatrooms.";

Model.prototype.getKey = function (socket_id) {
    return this.key_prefix + socket_id;
};

Model.prototype.add = function (socket_id, chatroom, callback) {
    PointGaming.redis_client.sadd(this.getKey(socket_id), chatroom, callback);
};

Model.prototype.all = function (socket_id, callback) {
    PointGaming.redis_client.smembers(this.getKey(socket_id), callback);
};

Model.prototype.exists = function (socket_id, chatroom, callback) {
    PointGaming.redis_client.sismember(this.getKey(socket_id), chatroom, callback);
};

Model.prototype.remove = function (socket_id, chatroom, callback) {
    PointGaming.redis_client.srem(this.getKey(socket_id), chatroom, callback);
};
