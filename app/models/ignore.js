var Ignore = function () {
  this.property("userId", "string");
  this.property("ignoreUserId", "string");

  this.getIgnoredUser = function(callback){
    geddy.model.User.first({id: this.ignoreUserId}, callback);
  };
};

Ignore = geddy.model.register('Ignore', Ignore);
