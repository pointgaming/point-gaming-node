var Model = function() {

};

module.exports = Model;

Model.prototype.key_prefix = 'Chat.Members.';

Model.prototype.getKey = function(chat_id) {
  return this.key_prefix + chat_id;
};

Model.prototype.add = function(chat_id, username, points, callback) {
  PointGaming.redis_client.zadd(this.getKey(chat_id), points, username, callback);
};

Model.prototype.all = function(chat_id, callback) {
  PointGaming.redis_client.zrange(this.getKey(chat_id), 0, -1, callback);
};

Model.prototype.exists = function(chat_id, username, callback) {
  PointGaming.redis_client.zrank(this.getKey(chat_id), username, callback);
};

Model.prototype.remove = function(chat_id, username, callback) {
  PointGaming.redis_client.zrem(this.getKey(chat_id), username, callback);
};
