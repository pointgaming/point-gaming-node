var authenticator = require('../authenticator');

var Command = function() {
  this.authenticator = new authenticator();
};

module.exports = Command;

Command.prototype.handle = function(socket, message) {
  if (!this.authenticator) {
    processError(socket, "this.authenticator was not found");
  } else {
    this.authenticator.authenticate(message, function(err, user) {
      if (err) {
        processError(socket, err);
      } else {
        socket.setCurrentUser(user, message);
        respond(socket, user);
      }
    }); 
  }
};

var processError = function(socket, error) {
  console.log(error);
  socket.emit('auth_resp', {success: false});
};

var respond = function(socket, user) {
  socket.emit('auth_resp', {success: true, username: user.username, user: user});
};
