var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket 
// receives a message from another user.
Command.prototype.handle = function(socket, exchange_name, message) {
  message = JSON.parse(message.data.toString());

  // TODO: we can probably remove this validation
  if (message._id && message.fromUser && message.message) {
    socket.emit('Chatroom.Message.new', {
      _id: message._id, 
      fromUser: message.fromUser,
      message: message.message
    });
  }
};
