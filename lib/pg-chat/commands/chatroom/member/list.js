var chatroomMember = require('../../../models/chatroom_member'),
    ChatroomMember = new chatroomMember(),
    Chatroom = require('../../../models/chat_room'),
    GameRoomApiClient = require('../../../api/game_room'),
    UserApiClient = require('../../../api/user');

var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket requests 
// a list of members within a chatroom. 
Command.prototype.handle = function(socket, message) {
  if (message._id) {
    this.getMembersForChatroom(message._id, function(err, members){
      if (err) {
        handleError(message._id, err);
      } else {
        respond(socket, message._id, members);
      }
    });
  }
};

Command.prototype.getMembersForChatroom = function(chatroom, callback) {
  ChatroomMember.all(chatroom, function(err, user_ids) {
    if (err) {
      callback(err);
    } else {
      UserApiClient.getUsers(user_ids).on('complete', function(data) {
        if (data instanceof Error) {
          callback(data.message);
        } else {
          callback(null, data.users || []);
        }
      });
    }
  });
};

var handleError = function(chatroom, message) {
  console.log('Failed to getMembersForChatroom ' + chatroom + ': ' + message);
};

var respond = function(socket, chatroom, results) {
  socket.emit('Chatroom.Member.list', {
    _id: chatroom,
    members: results
  });
};
