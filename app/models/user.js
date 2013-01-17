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
    this.hasMany("Ignores");
    this.hasMany("Passports");

    this.getIgnoredUsers = function(callback){
      var _iterGetIgnoredUser = function(err, ignores){
        if (ignores) {
          async.map(ignores, function(item, loopCallback){
            item.getIgnoredUser(loopCallback);
          }, callback);
        } else {
          callback(err, ignores);
        }
      };

      geddy.model.Ignore.all({userId: this.id}, _iterGetIgnoredUser);
    };

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
