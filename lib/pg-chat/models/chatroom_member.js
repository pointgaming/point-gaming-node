var Model = function() {

};

module.exports = Model;

Model.prototype.key_prefix = 'Chat.Members.';

Model.prototype.getKey = function(chat_name) {
  return this.key_prefix + chat_name;
};

Model.prototype.add = function(chat_name, user_id, points, callback) {
  PointGaming.redis_client.zadd(this.getKey(chat_name), points, user_id, 
      runCallbacksForEvent.bind(this, 'afterAdd', chat_name, user_id, callback));
};

Model.prototype.all = function(chat_name, callback) {
  PointGaming.redis_client.zrange(this.getKey(chat_name), 0, -1, callback);
};

Model.prototype.count = function(chat_name, callback) {
  PointGaming.redis_client.zcard(this.getKey(chat_name), callback);
};

Model.prototype.exists = function(chat_name, user_id, callback) {
  PointGaming.redis_client.zrank(this.getKey(chat_name), user_id, callback);
};

Model.prototype.remove = function(chat_name, user_id, callback) {
  PointGaming.redis_client.zrem(this.getKey(chat_name), user_id, 
      runCallbacksForEvent.bind(this, 'afterRemove', chat_name, user_id, callback));
};

var runCallbacksForEvent = function(event_name, chat_name, user_id, callback, err, return_value) {
  var chat_type = getChatRoomType(chat_name),
      chat_id = getChatRoomId(chat_name, chat_type);

  if (typeof(callback) !== 'function') {
    callback = function(){};
  }

  // check if there is an callback specific to this event_name and chat_type
  if (chat_type && eventCallbacks && eventCallbacks[event_name] && typeof(eventCallbacks[event_name][chat_type]) === 'function') {
    eventCallbacks[event_name][chat_type].bind(this)(chat_name, user_id, chat_id, callback, return_value);
  } else {
    callback(null, return_value);
  }
};

var getChatRoomType = function(chat_name) {
  switch (true) {
    case !!chat_name.match(PointGaming.chat_rooms.GameRoom.regex):
      return 'GameRoom';
    case !!chat_name.match(PointGaming.chat_rooms.Game.regex):
      return 'Game';
    case !!chat_name.match(PointGaming.chat_rooms.Stream.regex):
      return 'Stream';
    case !!chat_name.match(PointGaming.chat_rooms.Private.regex):
      return 'Private';
    case !!chat_name.match(PointGaming.chat_rooms.Dispute.regex):
      return 'Dispute';
    default:
      return null;
  }
};

var getChatRoomId = function(chat_name, chat_type) {
  return (chat_type === null) ?
            chat_name : 
            chat_name.replace(PointGaming.chat_rooms[chat_type].regex, '');
};

var eventCallbacks = {
  afterAdd: {
    // increment the number of users viewing the stream
    Stream: function(chat_name, user_id, chat_id, callback, return_value) {
      if (return_value === 1) {
        PointGaming.stream_api_client.incrementViewerCount(chat_id, 1, function(err, data){});
      }
      callback(null, return_value);
    },
    Dispute: function(chat_name, user_id, chat_id, callback, return_value) {
      if (return_value === 1) {
        PointGaming.user_api_client.getUser(user_id, function(err, data){
          if (data.user.admin === true) {
            PointGaming.dispute_api_client.incrementAdminViewerCount(chat_id, 1, function(err, data){});
          } else {
            PointGaming.dispute_api_client.incrementUserViewerCount(chat_id, 1, function(err, data){});
          }
        });
      }
      callback(null, return_value);
    }
  },

  afterRemove: {
    // delete the game_room if there are no more users in the chat
    GameRoom: function(chat_name, user_id, chat_id, callback, return_value) {
      this.count(chat_name, function(err, count) {
        if (err) callback(err);
        else if (count === 0) {
          PointGaming.game_room_api_client.destroyGameRoom(chat_id, function(err, data){});
          callback(null, return_value);
        } else {
          callback(null, return_value);
        }
      });
    },

    Dispute: function(chat_name, user_id, chat_id, callback, return_value) {
      PointGaming.user_api_client.getUser(user_id, function(err, data){
        if (data.user.admin === true) {
          PointGaming.dispute_api_client.incrementAdminViewerCount(chat_id, -1, function(err, data){});
        } else {
          PointGaming.dispute_api_client.incrementUserViewerCount(chat_id, -1, function(err, data){});
        }
      });
    },

    // decrement the number of users viewing the stream
    Stream: function(chat_name, user_id, chat_id, callback, return_value) {
      PointGaming.stream_api_client.incrementViewerCount(chat_id, -1, function(err, data){});
      callback(null, return_value);
    }
  }
};
