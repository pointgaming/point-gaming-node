var UserChatroom = require('../../models/user_chatroom'),
    userChatroom = new UserChatroom();

var Command = function() {

};

module.exports = Command;

// This function will handle the event in which a connected socket requests 
// a list of chatrooms that their current user is subscribed to (across all 
// socket connections).
Command.prototype.handle = function(socket, message) {
  userChatroom.all(socket.user._id, function(err, results) {
    if (err) handleError(err);
    else respond(socket, results);
  });
};

var handleError = function(err) {
  console.log(err);
};

var respond = function(socket, results) {
  socket.emit('Chatroom.list', {
    chatrooms: results
  });
};
