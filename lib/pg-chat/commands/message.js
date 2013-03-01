// TODO: we will probably remove this after talking with Dean
var Command = function() {

};

module.exports = Command;

Command.prototype.handle = function(socket, message) {
  if (message.user_id && message.message) {
    var new_message = {user_id: socket.user._id, message: message.message};
    socket.sendMessageToExchange(socket.USER_EXCHANGE_PREFIX + message.user_id, new_message);
  }
};
