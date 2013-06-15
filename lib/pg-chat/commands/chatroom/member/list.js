var ChatroomMember = require('../../../models/chatroom_member'),
    chatroomMember = new ChatroomMember(),
    UserUsername = require('../../../models/user_username'),
    userUsername = new UserUsername(),
    async = require('async'),
    Chatroom = require('../../../models/chat_room'),
    GameRoomApiClient = require('../../../api/game_room');

var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket requests 
// a list of members within a chatroom. 
Command.prototype.handle = function(socket, message) {
  if (message._id) {
    var chat_type = Chatroom.getTypeFromServerId(message._id);

    if (chat_type === 'GameRoom') {
      this.getMembersForGameRoom(socket, message);
    } else {
      this.getMembersFromRedis(socket, message);
    }
  }
};

Command.prototype.getMembersForGameRoom = function(socket, message) {
  var game_room_id = Chatroom.getIdFromServerId(message._id, 'GameRoom');
  GameRoomApiClient.getGameRoom(game_room_id).on('complete', function(data, response) {
    if (data instanceof Error) {
      handleError(data.message);
    } else {
      if (data.game_room && data.game_room.members) {
        respond(socket, message._id, data.game_room.members);
      }
    }
  });
};

Command.prototype.getMembersFromRedis = function(socket, message) {
  chatroomMember.all(message._id, function(err, results) {
    if (err) {
      handleError(err);
    } else {
      async.map(results, function(item, callback) {
        userUsername.find(item, function(err, username) {
          if (err) callback(err);
          else callback(null, {_id: item, username: username});
        });
      }, function(err, results) {
        if (err) return;

        respond(socket, message._id, results);
      });
    }
  });
};

var handleError = function(err) {
  console.log(err);
};

var respond = function(socket, chatroom, results) {
  socket.emit('Chatroom.Member.list', {
    _id: chatroom,
    members: results
  });
};
