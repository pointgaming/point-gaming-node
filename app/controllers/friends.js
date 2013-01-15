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

    async.waterfall([
      // @TODO move this check to some form model validation?
      function(callback) {
        if (params.username === self.currentUser.username) {
            callback({username: 'You cannot add yourself as a friend.'});
        } else {
            callback(null);
        }
      },
      function(callback) {
        geddy.model.User.first({username: params.username}, function(err, data) {
          if (typeof(data) === 'undefined') {
            callback({username: 'That user does not exist.'});
          } else {
            callback(null, data.id);
          }
        });
      },
      // verify that currentUser -> specifiedUser friend relation doesn't already exist
      function(friendUserId, callback) {
        geddy.model.Friend.first({userId: self.currentUser.id, friendUserId: friendUserId}, function(err, data) {
          if (typeof(data) !== 'undefined') {
            callback({username: 'You are already friends with that user.'});
          } else {
            callback(null, friendUserId);
          }
        });
      },
      // add currentUser -> specifiedUser friend relation
      function(friendUserId, callback) {
        var friend = geddy.model.Friend.create({
          userId: self.currentUser.id,
          friendUserId: friendUserId
        });

        friend.save(function(err, data) {
          callback(null, friendUserId);
        });
      },
      // verify that specifiedUser -> currentUser friend relation doesn't already exist
      function(friendUserId, callback) {
        geddy.model.Friend.first({userId: friendUserId, friendUserId: self.currentUser.id}, function(err, data) {
          if (typeof(data) !== 'undefined') {
            callback({username: 'That user is already friends with you.'});
          } else {
            callback(null, friendUserId);
          }
        });
      },
      // add specifiedUser -> currentUser friend relation
      function(friendUserId, callback) {
        var friend = geddy.model.Friend.create({
          userId: friendUserId,
          friendUserId: self.currentUser.id
        });

        friend.save(function(err, data) {
          callback(null, 'done');
        });
      }
    ], function(err, results){
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
