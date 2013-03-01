var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket sends an invitation
// to join a private chatroom to another user.
Command.prototype.handle = function(socket, message) {
  if (message._id && message.toUser) {
    socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + message.toUser._id, {
      action: 'Chatroom.Invite.new',
      data: {
        _id: message._id, 
        fromUser: { 
          _id: socket.user._id, 
          username: socket.user.username 
        }
      }
    });
  }
};
