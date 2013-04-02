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

Model.prototype.count = function(chat_id, callback) {
  PointGaming.redis_client.zcard(this.getKey(chat_id), callback);
};

Model.prototype.exists = function(chat_id, username, callback) {
  PointGaming.redis_client.zrank(this.getKey(chat_id), username, callback);
};

Model.prototype.remove = function(chat_id, username, callback) {
  PointGaming.redis_client.zrem(this.getKey(chat_id), username, afterRemove.bind(this, chat_id, callback));
};

// TODO: determine if we need to accept additional parameters for this function 
// and also if we need to pass them to the callback
//
// delete the game_room if there are no more users in the chat
var afterRemove = function(chat_id, callback) {
  chat_id = chat_id.replace(new RegExp('^' + PointGaming.chat_rooms.GAME_ROOM_PREFIX), '');
  if (typeof(callback) !== 'function') {
    callback = function(){};
  }

  this.count(chat_id, function(err, count) {
    if (err) callback(err);
    else if (count === 0) {
      PointGaming.game_room_api_client.destroyGameRoom(chat_id, function(err, data){});
      callback(null);
    } else {
      callback(null);
    }
  });
};
