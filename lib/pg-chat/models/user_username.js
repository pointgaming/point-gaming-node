"use strict";

var PointGaming = global.PointGaming,
    Model = function () {};

Model.prototype.key_prefix = "User.Username.";

Model.prototype.getKey = function (key) {
    return this.key_prefix + key;
};

Model.prototype.set = function (key, value, callback) {
    PointGaming.redis_client.set(this.getKey(key), value, callback);
};

Model.prototype.find = function (key, callback) {
    PointGaming.redis_client.get(this.getKey(key), callback);
};

Model.prototype.remove = function (key, callback) {
    PointGaming.redis_client.del(this.getKey(key), callback);
};

module.exports = Model;
