var Friend = function () {
  this.property("userId", "string");
  this.property("friendUserId", "string");
};

Friend = geddy.model.register('Friend', Friend);
