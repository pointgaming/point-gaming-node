var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket sends an invitation
// to join a private chatroom to another user.
Command.prototype.handle = function(socket, message) {
  if (socket.user && message._id && message.toUser) {
    // verify that the user is currently in the chatroom if they want to send an invite.
    PointGaming.models.ChatroomMember.exists(message._id, socket.user._id, function(err, exists) {
      if (err) handleError(err, socket, message);
      else if (exists === null) handlePermissionDenied(socket, message);
      else sendInvite(message.toUser._id, message._id, socket.user);
    });
  }
};

var sendInvite = function(to_user_id, chatroom, from_user) {
  PointGaming.models.ChatroomInvite.add(chatroom, to_user_id, function(err) {
    if (err) throw err;

    PointGaming.amqp_conn.sendMessageToFanoutExchange(PointGaming.amqp_conn.USER_EXCHANGE_PREFIX + to_user_id, {
      action: 'Chatroom.Invite.new',
      data: {
        _id: chatroom, 
        fromUser: { 
          _id: from_user._id, 
          username: from_user.username 
        }
      }
    });
  });
};

var handlePermissionDenied = function(socket, message) {
  handleError(new Error('Permission Denied.'), socket, message);
};

var handleError = function(err, socket, message) {
  socket.emit('Chatroom.Invite.fail', {_id: message._id, message: err.message});
};
