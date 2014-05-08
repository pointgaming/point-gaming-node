"use strict";

var PointGaming = global.PointGaming,
    Model = function () {};

Model.prototype.key_prefix = "User.Sockets.";

Model.prototype.getKey = function (userId) {
    return this.key_prefix + userId;
};

Model.prototype.add = function (userId, item, callback) {
    PointGaming.redis_client.sadd(this.getKey(userId), item, callback);
};

Model.prototype.all = function (userId, callback) {
    PointGaming.redis_client.smembers(this.getKey(userId), callback);
};

Model.prototype.count = function (userId, callback) {
    PointGaming.redis_client.scard(this.getKey(userId), callback);
};

Model.prototype.exists = function (userId, item, callback) {
    PointGaming.redis_client.sismember(this.getKey(userId), item, callback);
};

Model.prototype.remove = function (userId, item, callback) {
    PointGaming.redis_client.srem(this.getKey(userId), item, callback);
};

module.exports = Model;
