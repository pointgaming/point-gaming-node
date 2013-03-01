var messageHandler = require('./message/receive'),
    messageHandler = new messageHandler();

// TODO: change the 'join_chat' event name

var Command = function() {

};

// This function will handle the event in which a connected socket joins a chatroom.
// It will subscribe the users socket to the chat rooms exchange.
// It will emit events when the user joins the chat.
Command.prototype.handle = function(socket, message) {
  if (message._id) {
    socket.subscribeToExchange(socket.CHAT_EXCHANGE_PREFIX + message._id, messageHandler.handle.bind(messageHandler, socket));

    socket.emit('join_chat', {success: true});
  } else {
    socket.emit('join_chat', {success: false});
  }
};

module.exports = Command;
