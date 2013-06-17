var Chatroom = require('./chat_room'),
    GameRoomApiClient = require('../api/game_room'),
    UserApiClient = require('../api/user');

var ChatroomMember = function() {

};

module.exports = ChatroomMember;

ChatroomMember.prototype.key_prefix = 'Chat.Members.';

ChatroomMember.prototype.getKey = function(chat_name) {
  return this.key_prefix + chat_name;
};

ChatroomMember.prototype.add = function(chat_name, user_id, points, callback) {
  PointGaming.redis_client.zadd(this.getKey(chat_name), points, user_id, 
      runCallbacksForEvent.bind(this, 'afterAdd', chat_name, user_id, callback));
};

ChatroomMember.prototype.all = function(chat_name, callback) {
  PointGaming.redis_client.zrange(this.getKey(chat_name), 0, -1, callback);
};

ChatroomMember.prototype.count = function(chat_name, callback) {
  PointGaming.redis_client.zcard(this.getKey(chat_name), callback);
};

ChatroomMember.prototype.exists = function(chat_name, user_id, callback) {
  PointGaming.redis_client.zrank(this.getKey(chat_name), user_id, callback);
};

ChatroomMember.prototype.remove = function(chat_name, user_id, callback) {
  PointGaming.redis_client.zrem(this.getKey(chat_name), user_id, 
      runCallbacksForEvent.bind(this, 'afterRemove', chat_name, user_id, callback));
};

var runCallbacksForEvent = function(event_name, chat_name, user_id, callback, err, return_value) {
  var chat_type = Chatroom.getTypeFromServerId(chat_name),
      chat_id = Chatroom.getIdFromServerId(chat_name, chat_type);

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

var eventCallbacks = {
  afterAdd: {
    // tell the rails server that the user has joined the game room
    GameRoom: function(chat_name, user_id, chat_id, callback, return_value) {
      if (return_value === 1) {
        GameRoomApiClient.joinGameRoom(chat_id, user_id);
      }
      callback(null, return_value);
    },

    // increment the number of users viewing the stream
    Stream: function(chat_name, user_id, chat_id, callback, return_value) {
      if (return_value === 1) {
        PointGaming.stream_api_client.incrementViewerCount(chat_id, 1, function(err, data){});
      }
      callback(null, return_value);
    },
    Dispute: function(chat_name, user_id, chat_id, callback, return_value) {
      if (return_value === 1) {
        UserApiClient.getUser(user_id).on('complete', function(data, response){
          if (data instanceof Error) {
            handleError(data.message);
          } else {
            if (data.user && data.user.admin === true) {
              PointGaming.dispute_api_client.incrementAdminViewerCount(chat_id, 1, function(err, data){});
            } else {
              PointGaming.dispute_api_client.incrementUserViewerCount(chat_id, 1, function(err, data){});
            }
          }
        });
      }
      callback(null, return_value);
    }
  },

  afterRemove: {
    // tell the rails server that the user has left the game room
    GameRoom: function(chat_name, user_id, chat_id, callback, return_value) {
      GameRoomApiClient.leaveGameRoom(chat_id, user_id).on('complete', function(result){
        callback(null, return_value);
      });
    },

    Dispute: function(chat_name, user_id, chat_id, callback, return_value) {
      UserApiClient.getUser(user_id).on('complete', function(data, response){
        if (data instanceof Error) {
          handleError(data.message);
        } else {
          if (data.user && data.user.admin === true) {
            PointGaming.dispute_api_client.incrementAdminViewerCount(chat_id, -1, function(err, data){});
          } else {
            PointGaming.dispute_api_client.incrementUserViewerCount(chat_id, -1, function(err, data){});
          }
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

var handleError = function(err) {
  console.log(err);
};
