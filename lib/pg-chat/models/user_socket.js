var Model = function() {

};

module.exports = Model;

Model.prototype.key_prefix = 'User.Sockets.';

Model.prototype.getKey = function(user_id) {
  return this.key_prefix + user_id;
};

Model.prototype.add = function(user_id, item, callback) {
  PointGaming.redis_client.sadd(this.getKey(user_id), item, callback);
};

Model.prototype.all = function(user_id, callback) {
  PointGaming.redis_client.smembers(this.getKey(user_id), callback);
};

Model.prototype.count = function(user_id, callback) {
  PointGaming.redis_client.scard(this.getKey(user_id), callback);
};

Model.prototype.exists = function(user_id, item, callback) {
  PointGaming.redis_client.sismember(this.getKey(user_id), item, callback);
};

Model.prototype.remove = function(user_id, item, callback) {
  PointGaming.redis_client.srem(this.getKey(user_id), item, callback);
};
