var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket 
// receives a message from another user.
Command.prototype.handle = function(socket, message) {
  if (message.fromUser && message.message) {
    socket.emit('Message.new', {
      fromUser: message.fromUser,
      message: message.message
    });
  }
};
