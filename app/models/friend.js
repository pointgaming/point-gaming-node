var Friend = function () {
  this.property("userId", "string");
  this.property("friendUserId", "string");

  this.getFriendUser = function(callback){
    geddy.model.User.first({id: this.friendUserId}, callback);
  };
};

Friend = geddy.model.register('Friend', Friend);
