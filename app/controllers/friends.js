var async = require('async');

var Friends = function () {
  this.respondsWith = ['html', 'json'];

  this.before(this.requireAuth);

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Friend.all({userId: self.currentUser.id}, function(err, friends) {
      async.map(friends, function(item, callback){
        geddy.model.User.first({id: item.friendUserId}, function(err, data){
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
      }, function(err, friends){
        self.respond({params: params, friends: friends});
      });
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this;

    async.auto({
      // @TODO move this check to some form model validation?
      validateSelf: function(callback) {
        if (params.username === self.currentUser.username) {
            callback({username: 'You cannot add yourself as a friend.'});
        } else {
            callback(null);
        }
      },
      getFriendUserId: ["validateSelf", function(callback) {
        geddy.model.User.first({username: params.username}, function(err, data) {
          if (typeof(data) === 'undefined') {
            callback({username: 'That user does not exist.'});
          } else {
            callback(null, data.id);
          }
        });
      }],
      // check if currentUser -> specifiedUser friend relation already exist
      firstRelationExists: ["getFriendUserId", function(callback, results) {
        geddy.model.Friend.first({userId: self.currentUser.id, friendUserId: results.getFriendUserId}, function(err, data) {
          if (typeof(data) !== 'undefined') {
            callback({username: 'You are already friends with that user.'});
          } else {
            callback(null, false);
          }
        });
      }],
      // add currentUser -> specifiedUser friend relation
      createFirstRelation: ["firstRelationExists", function(callback, results) {
        var friend = geddy.model.Friend.create({
          userId: self.currentUser.id,
          friendUserId: results.getFriendUserId
        });

        friend.save(function(err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data.id);
          }
        });
      }],
      // check if specifiedUser -> currentUser friend relation already exist
      secondRelationExists: ["firstRelationExists", function(callback, results) {
        geddy.model.Friend.first({userId: results.getFriendUserId, friendUserId: self.currentUser.id}, function(err, data) {
          callback(null, typeof(data) !== 'undefined');
        });
      }],
      // add specifiedUser -> currentUser friend relation
      createSecondRelation: ["secondRelationExists", function(callback, results) {
        if (results.secondRelationExists) {
          callback(null);
        } else {
          var friend = geddy.model.Friend.create({
            userId: results.getFriendUserId,
            friendUserId: self.currentUser.id
          });

          friend.save(function(err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data.id);
            }
          });
        }
      }]
    }, function(err, results){
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    async.auto({
      // find User.id by username
      getFriendUserId: function(callback) {
        geddy.model.User.first({username: params.id}, function(err, data) {
          if (typeof(data) === 'undefined') {
            callback({username: 'That user does not exist.'});
          } else {
            callback(null, data.id);
          }
        });
      },
      // lookup the first friend relation
      firstFriendRelationId: ["getFriendUserId", function(callback, results) {
        geddy.model.Friend.first({userId: self.currentUser.id, friendUserId: results.getFriendUserId}, function(err, data) {
          if (typeof(data) === 'undefined') {
            callback({username: 'You are not friends with that user.'});
          } else {
            callback(null, data.id);
          }
        });
      }],
      // lookup the second friend relation
      secondFriendRelationId: ["getFriendUserId", function(callback, results) {
        geddy.model.Friend.first({userId: results.getFriendUserId, friendUserId: self.currentUser.id}, function(err, data) {
          if (typeof(data) !== 'undefined') {
            callback(null, data.id);
          } else {
            callback(null);
          }
        });
      }],
      // delete the first relation
      deleteFirstFriendRelation: ["firstFriendRelationId", function(callback, results) {
        geddy.model.Friend.remove(results.firstFriendRelationId, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }],
      // delete the second relation, if there was one
      deleteSecondFriendRelation: ["firstFriendRelationId", "secondFriendRelationId", function(callback, results) {
        if (typeof(results.secondFriendRelationId) !== 'undefined') {
          geddy.model.Friend.remove(results.secondFriendRelationId, function(err) {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      }]
    }, function(err, results){
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Friends = Friends;
