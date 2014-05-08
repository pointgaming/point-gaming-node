"use strict";

var PointGaming = global.PointGaming,
    Model = function () {};

Model.prototype.key_prefix = "Server.Sockets.";

Model.prototype.getKey = function () {
    return this.key_prefix + PointGaming.config.servername;
};

Model.prototype.add = function (item, callback) {
    PointGaming.redis_client.sadd(this.getKey(), item, callback);
};

Model.prototype.all = function (callback) {
    PointGaming.redis_client.smembers(this.getKey(), callback);
};

Model.prototype.exists = function (item, callback) {
    PointGaming.redis_client.sismember(this.getKey(), item, callback);
};

Model.prototype.remove = function (item, callback) {
    PointGaming.redis_client.srem(this.getKey(), item, callback);
};

module.exports = Model;
