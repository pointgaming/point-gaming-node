var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket 
// receives an invite to join a chatroom.
Command.prototype.handle = function(socket, message) {
  if (message._id && message.fromUser) {
    socket.emit('Chatroom.Invite.new', {
      _id: message._id, 
      fromUser: message.fromUser
    });
  }
};
