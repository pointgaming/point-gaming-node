var Command = function() {

};

module.exports = Command;

// this function will handle the event in which a connected socket joins or 
// leaves a chatroom. 
Command.prototype.handle = function(socket, chatroom, new_status) {
  if (socket.user && chatroom && new_status) {
    socket.sendMessageToExchange(socket.CHAT_EXCHANGE_PREFIX + chatroom, {
      action: 'Chatroom.Member.change',
      data: {
        _id: chatroom,
        user: { 
          _id: socket.user._id, 
          username: socket.user.username 
        }, 
        "status": new_status
      }
    });
  }
};
