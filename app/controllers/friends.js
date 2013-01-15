var async = require('async');

var Friends = function () {
  this.respondsWith = ['html', 'json'];

  this.before(this.requireAuth);

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Friend.all({userId: self.currentUser.id}, function(err, friends) {
      self.respond({params: params, friends: friends});
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
          callback(null);
        });
      }],
      // check if specifiedUser -> currentUser friend relation already exist
      secondRelationExists: ["firstRelationExists", function(callback, results) {
        geddy.model.Friend.first({userId: results.getFriendUserId, friendUserId: self.currentUser.id}, function(err, data) {
          console.log('Found the second friend relation: ' + (typeof(data) !== 'undefined'));
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
            callback(null, 'done');
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

    geddy.model.Friend.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Friends = Friends;
