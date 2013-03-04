var ChatroomMember = require('../../../models/chatroom_member'),
    chatroomMember = new ChatroomMember(),
    UserUsername = require('../../../models/user_username'),
    userUsername = new UserUsername(),
    async = require('async');

var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket requests 
// a list of members within a chatroom. 
Command.prototype.handle = function(socket, message) {
  if (message._id) {
    chatroomMember.all(message._id, function(err, results) {
      if (err) handleError(err);
      else respond(socket, message._id, results);
    });
  }
};

var handleError = function(err) {
  console.log(err);
};

var respond = function(socket, chatroom, results) {
  async.map(results, function(item, callback) {
    userUsername.find(item, function(err, username) {
      if (err) callback(err);
      else callback(null, {_id: item, username: username});
    });
  }, function(err, results) {
    if (err) return;

    socket.emit('Chatroom.Member.list', {
      _id: chatroom,
      members: results
    });
  });
};
