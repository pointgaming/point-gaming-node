var Command = function() {

};

module.exports = Command;

// this function will handle the event in which a connected socket sends a message 
// to another user.
Command.prototype.handle = function(socket, message) {
  if (socket.user && message._id && message.message) {
    socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + message._id, {
      fromUser: { 
        _id: socket.user._id, 
        username: socket.user.username 
      }, 
      message: message.message
    });
  }
};
