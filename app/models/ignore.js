var Ignore = function () {
  this.property("userId", "string");
  this.property("ignoreUserId", "string");
};

Ignore = geddy.model.register('Ignore', Ignore);
