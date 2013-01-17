(function () {
var Passport = function () {
    this.property("authType", "string");
    this.property("key", "string");

    this.belongsTo("User");
};

Passport = geddy.model.register("Passport", Passport);
}());

(function () {
var async = require('async');

var User = function () {
    this.property("username", "string", {required: true});
    this.property("password", "string", {required: true});
    this.property("firstName", "string", {required: true});
    this.property("lastName", "string", {required: true});
    this.property("email", "string", {required: true});

    this.validatesLength("username", {min: 3});
    this.validatesLength("password", {min: 8});
    this.validatesConfirmed("password", "confirmPassword");

    this.hasMany("Friends");
    this.hasMany("Passports");

    this.getFriendUsers = function(callback){
      var _iterGetFriendUser = function(err, friends){
        if (friends) {
          async.map(friends, function(item, loopCallback){
            item.getFriendUser(loopCallback);
          }, callback);
        } else {
          callback(err, friends);
        }
      };

      geddy.model.Friend.all({userId: this.id}, _iterGetFriendUser);
    };
};

User = geddy.model.register("User", User);
}());

(function () {
var News = function () {
    this.defineProperties({
        title: {
            type: "string",
            required: true
        },
        content: {
            type: "string"
        }
    });

    this.validatesPresent("title");
    this.validatesPresent("content");
};

News = geddy.model.register("News", News);
}());

(function () {
var Friend = function () {
  this.property("userId", "string");
  this.property("friendUserId", "string");

  this.getFriendUser = function(callback){
    geddy.model.User.first({id: this.friendUserId}, callback);
  };
};

Friend = geddy.model.register('Friend', Friend);
}());